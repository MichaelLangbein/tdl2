# Terraform

-   Infrastructure as code
-   Like ansible, but more about infrastructure and orchestration, not only configuration

1. **Terraform**: Prepare environment on AWS
    1. create users
    2. create private network
    3. create instances
    4. install docker on instances
    5. setup firewalls
2. **CI**: Deploy docker containers to instances

## CLI

-   `terraform`
    -   `init`
    -   `fmt`
    -   `validate`
    -   `test`
    -   `plan`
    -   `apply`
        -   `-var`: depends on you having registered variables with `main.tf or variables.tf / variable <variable_name> {}`
        -   alternatively, provide values using a `*.auto.tfvars` of `terrform.vars` file
    -   `show`
    -   `state`
        -   `list`
        -   `show`
    -   `output`
        -   depends on you having registered outputs with `main.tf or outputs.tf / output <output_name> {}`
    -   `destroy`
    -   `taint google_cloudfunctions_function.watch_data`: marks for re-creation
    -   `state list`
    -   `state rm google_cloudfunctions_function.watch_data`: tells terraform that this resource no longer exists

## Debugging

-   `TF_LOG=DEBUG terraform plan > debug.log 2>&1`

## Syntax

-   Terraform
    -   required_providers
-   variable
    -   type
    -   default
    -   condition
-   local
-   data <from-source> <as-name>
-   output
    -   description
    -   value
-   import: imports an existing resource on a provider and turns it into a terrform managed resource
    -   id
    -   to
-   resource <type> <name>
-   module
    -   source
    -   version

## AWS

-   create account
-   create budget with alert
-   create terraform user
-   install aws-cli
    -   configure cli to use terraform-user:
        -   `export AWS_ACCESS_KEY_ID=`
        -   `export AWS_SECRET_ACCESS_KEY=`

## Google

```bash
#! /bin/bash

# create project
gcloud projects create experiments-442613
gcloud config set project experiments-442613
# @TODO: connect a billing-account/credit-card
echo "Don't forget to connect a billing-account/credit-card"

# create user
cloud iam service-accounts create trfmbot --display-name="terraform bot"
gcloud iam service-accounts keys create mykeyfile.json --iam-account=trfmbot@experiments-442613.iam.gserviceaccount.com

# Add permissions to your service-account as required by your main.tf.
# If you need a certain permission, find the matching role here:
# https://cloud.google.com/iam/docs/permissions-reference
# Also, find terrform documentation for different resources here:
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/

# activate pubsub api
gcloud services enable pubsub.googleapis.com
gcloud projects add-iam-policy-binding experiments-442613 --member="serviceAccount:trfmbot@experiments-442613.iam.gserviceaccount.com" --role="roles/pubsub.editor"

# activate storage api
gcloud services enable storage.googleapis.com
gcloud projects add-iam-policy-binding experiments-442613 --member="serviceAccount:trfmbot@experiments-442613.iam.gserviceaccount.com" --role="roles/storage.admin"

# activate cloud scheduler api
gcloud services enable cloudscheduler.googleapis.com
gcloud projects add-iam-policy-binding experiments-442613 --member="serviceAccount:trfmbot@experiments-442613.iam.gserviceaccount.com" --role="roles/cloudscheduler.admin"

# activate cloudfunctions api
gcloud services enable cloudfunctions.googleapis.com
gcloud projects add-iam-policy-binding experiments-442613 --member="serviceAccount:trfmbot@experiments-442613.iam.gserviceaccount.com" --role="roles/cloudfunctions.developer"
# follow-up permissions associated with cloudfunctions
gcloud services enable cloudbuild.googleapis.com
gcloud iam service-accounts add-iam-policy-binding projects/-/serviceAccounts/152847464795-compute@developer.gserviceaccount.com --member="serviceAccount:trfmbot@experiments-442613.iam.gserviceaccount.com" --role="roles/iam.serviceAccountUser"
gcloud services enable eventarc.googleapis.com
gcloud services enable run.googleapis.com


# sleep for one minute to allow permissions to propagate
sleep 60
```

```yml
provider "google" {
  project     = var.project_id
  region      = var.region
  credentials = file("./mykeyfile.json")
}

resource "google_pubsub_topic" "heartbeat_topic" {
  name = "heartbeat_topic"
}

resource "google_cloud_scheduler_job" "clock" {
  name      = "clock"
  schedule  = "* * * * *"
  time_zone = "Europe/Berlin"
  pubsub_target {
    topic_name = google_pubsub_topic.heartbeat_topic.id
    attributes = {
      message = "tick tock"
    }
  }
}

resource "google_storage_bucket" "source_code_bucket_1234" {
  name     = "source_code_bucket_1234"
  location = var.region
}

resource "null_resource" "package_function" {
  provisioner "local-exec" {
    command = "zip functionSource.zip main.py"
  }
  triggers = {
    # always_run = "${timestamp()}"
    file_hash_main = "${md5(file("./main.py"))}"
  }
}

resource "google_storage_bucket_object" "source_code" {
  name   = "functionSource.zip"
  bucket = google_storage_bucket.source_code_bucket_1234.name
  source = "./functionSource.zip"
  # to make sure that this updates when the zip file changes,
  # both `depends_on` and `lifecycle` are required!
  depends_on = [null_resource.package_function]
  lifecycle {
    create_before_destroy = true
  }
}

resource "google_cloudfunctions2_function" "check_data" {
  name        = "check_data"
  location    = var.region
  description = "Check if there is new data available"
  build_config {
    runtime     = "python310"
    entry_point = "entryPoint"
    source {
      storage_source {
        bucket = google_storage_bucket.source_code_bucket_1234.name
        object = google_storage_bucket_object.source_code.name
      }
    }
  }
  event_trigger {
    trigger_region = var.region
    event_type     = "google.cloud.pubsub.topic.v1.messagePublished"
    pubsub_topic   = google_pubsub_topic.heartbeat_topic.id
  }
  service_config {
    max_instance_count = 1
    available_memory   = "256M"
  }
}
```
