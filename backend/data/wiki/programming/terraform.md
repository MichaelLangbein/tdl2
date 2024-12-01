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

### Creating a cloud run function

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

data "archive_file" "source_code" {
  type        = "zip"
  source_dir  = "../WatchData/"
  output_path = "../functionSource.zip"
}

# Updating name ensures that the source code is re-uploaded
# https://stackoverflow.com/questions/71320503/is-it-possible-to-update-the-source-code-of-a-gcp-cloud-function-in-terraform
resource "google_storage_bucket_object" "source_code" {
  name   = "functionSource.${data.archive_file.source_code.output_md5}.zip"
  source = data.archive_file.source_code.output_path
  bucket = google_storage_bucket.source_code_bucket_1234.name
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
    retry_policy   = "RETRY_POLICY_DO_NOT_RETRY"
  }
  service_config {
    max_instance_count = 1
    available_memory   = "256M"
  }
  depends_on = [google_storage_bucket_object.source_code]
}
```

### Creating a pubsub to cloud-run setup

```yml
terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
    }
    google = {
      source = "hashicorp/google"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

provider "google" {
  project = var.project_id
  region  = var.region
}

#------------------------------------------------------------------------------------------------------------
# Service account
#------------------------------------------------------------------------------------------------------------

resource "google_service_account" "pubsub_cloudrun_sa" {
  account_id   = "pubsub-cloudrun-sa"
  display_name = "Pub/Sub and Cloud Run Service Account"
}

resource "google_project_iam_binding" "cloudrun_invoking" {
  project = var.project_id
  role    = "roles/run.invoker"
  members = ["serviceAccount:${google_service_account.pubsub_cloudrun_sa.email}", ]
}

#------------------------------------------------------------------------------------------------------------
# Pubsub & scheduler
#------------------------------------------------------------------------------------------------------------


resource "google_project_service" "cloud_scheduler_api" {
  service = "cloudscheduler.googleapis.com"
  project = var.project_id
}

resource "google_project_service" "pubsub_api" {
  service                    = "pubsub.googleapis.com"
  project                    = var.project_id
  disable_dependent_services = true
}

resource "google_pubsub_topic" "heartbeat_topic" {
  name    = "heartbeat_topic"
  project = var.project_id
}

resource "google_cloud_scheduler_job" "clock" {
  name      = "clock"
  schedule  = "* * * * *"
  time_zone = "Europe/Berlin"
  pubsub_target {
    topic_name = google_pubsub_topic.heartbeat_topic.id
    data       = base64encode("{'body': 'tick tock'}")
  }
  # NB: a scheduler can also use a HTTP_target to directly post to a service,
  # circumventing a pubsub queue.
  #   http_target {
  #     http_method = "POST"
  #     uri         = "https://example.com/"
  #     body        = base64encode("{\"foo\":\"bar\"}")
  #     headers = {
  #       "Content-Type" = "application/json"
  #     }
  #   }
  depends_on = [
    google_project_service.cloud_scheduler_api,
    google_project_service.pubsub_api
  ]
}


#------------------------------------------------------------------------------------------------------------
# Code to image repo
#------------------------------------------------------------------------------------------------------------

resource "google_artifact_registry_repository" "registry" {
  format        = "docker"
  repository_id = "mydockerimages"
  location      = var.region
}

locals {
  processor_source_files   = fileset("./processor", "**/*.py")
  processor_source_content = join("", [for file in local.processor_source_files : file("./processor/${file}")])
  processor_source_hash    = md5(local.processor_source_content)
  processor_image_name     = "europe-west3-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.registry.name}/processor:${local.processor_source_hash}"
}

resource "docker_image" "processor_image" {
  name = local.processor_image_name
  build {
    context = "./processor"
  }
  triggers = {
    source_hash = local.processor_source_hash
    docker_hash = "${md5(file("./processor/Dockerfile"))}"
  }
}


# pushing image to gcp image repo.
# weirdly, there is no idiomatic terraform resource to accomplish this.
resource "null_resource" "push_docker_image" {
  provisioner "local-exec" {
    command = "docker push ${local.processor_image_name}"
  }
  triggers = {
    image_id = docker_image.processor_image.image_id
  }
  depends_on = [docker_image.processor_image]
}



#------------------------------------------------------------------------------------------------------------
# Cloud run instance
#------------------------------------------------------------------------------------------------------------

resource "google_project_service" "cloud_run_api" {
  service = "run.googleapis.com"
  project = var.project_id
}

resource "google_cloud_run_service" "processor_service" {
  name     = "process-data-service"
  location = var.region
  template {
    spec {
      service_account_name = google_service_account.pubsub_cloudrun_sa.email
      containers {
        image = local.processor_image_name
      }
    }
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" : "1"
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }
  depends_on = [
    google_project_service.cloud_run_api,
    docker_image.processor_image,
    null_resource.push_docker_image
  ]
}

resource "google_pubsub_subscription" "push_to_cloudrun" {
  name  = "push-to-cloudrun"
  topic = google_pubsub_topic.heartbeat_topic.name
  push_config {
    # This has pubsub post it's messages to our cloudrun instance
    push_endpoint = "${google_cloud_run_service.processor_service.status[0].url}/echo"
    oidc_token {
      service_account_email = google_service_account.pubsub_cloudrun_sa.email
    }
  }
}
```
