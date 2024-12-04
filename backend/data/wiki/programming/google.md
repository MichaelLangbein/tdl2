# Google cloud

https://cloud.google.com/

# gcloud

4 ways of interacting with GCP:

1. Cloud console (=UI)
2. Cloud SDK & cloud shell (gcloud)
3. APIs (via python, java, ...)
4. Google cloud app
    1. billing alerts, custom graphs

<br/>

-   **gcloud**
    -   `auth`
        -   list
        -   login --update-adc
        -   configure-docker
    -   `config`
        -   list
            -   project
        -   set
            -   project <ProjectId>
            -   compute/region us-west1
            -   functions/region us-east1
        -   get
    -   `iam`
        -   `service-accounts` list, create, update, delete, disable
    -   `projects`
        -   create, list, describe, delete
        -   add-iam-policy-binding
        -   get-iam-policy
    -   `services` (_enables access to diverse API's_)
        -   enable|disable|list
    -   `storage` (_access to buckets_)
    -   `functions`
        -   deploy
            -   --project PROJECT_ID --runtime nodejs20 --trigger-resource gs://PROJECT_ID --trigger-event google.storage.object.finalize
        -   logs
    -   `compute` (_for vm's_)
        -   instances create <machine-name> --machine-type e2-medium --zone=$ZONE
        -   ssh <machine-name> --zone=$ZONE
    -   `container` (_for k8s_)
    -   `artifacts` (_for docker-images as well as software-artifacts_)
    -   `pubsub`
        -   topics
            -   create|delete|list
            -   list-subscriptions --topic <topic-name>
            -   publish <topic-name> --message "Hello"
            -   get-iam-policy <topic-name>
        -   subscriptions
            -   create|delete|list
            -   pull <subscription-name> --auto-ack --limit=3
            -   get-iam-policy <subscription-name>
    -   `source` (_creates cloud-source repositories_)
        -   repos create <repo-name>
    -   `builds` (_manages cloud-build environments_)
        -   submit
    -   `deploy`
-   **bq** (_separate cli specifically for big-query_)
    -   Find public dataset: `bq ls --project_id=bigquery-public-data -n 10000 | grep ecmwf`
    -   List tables inside dataset: `bq ls bigquery-public-data:ecmwf_era5_reanalysis`
    -   Show schema of table: `bq show --format=prettyjson bigquery-public-data:ecmwf_era5_reanalysis.ar-era5-v0`
    -   Execute sql on table: `bq query --use_legacy_sql=false 'select * from 'bigquery-public-data.ecmwf_era5_reanalysis.ar-era5-v0' limit 10'`
    -   Google will sometimes refer you to bigquery data like this:
        -   `https://bigquery.cloud.google.com/table/bigquery-public-data:cloud_storage_geo_index.landsat_index`
        -   this reads as follows: `https://bigquery.cloud.google.com/table/<Project-ID>:<Dataset-ID>.<Table-ID>`
-   **gsutil** (_separate cli specifically for buckets_)

# Concepts

-   Hierarchy:
    -   Organization
    -   -> Folders and sub-folders (you can actually skip this level)
    -   -> Projects
        -   Resources, Contributors
    -   -> Resources
        -   (VMs, Buckets, Tables, ...)
-   Policies:
    -   Inherit downward
-   IAM: _who_ can do _what_ on _which_ resources.
    -   The tuple (who(member), what(role), whom(resource)) is called a **binding**
    -   **who**, aka **principal**, aka **member**:
        -   user
        -   group
        -   service-account: like a user, but not associated with a human, but a VM. So that VM can do admin-work, access cloud-storage, ...
            -   service-accounts are resources themselves, so you can control who can edit them
        -   or cloud-id
            -   used to manage roles with rotating personel in larger organizations
        -   If you need a certain permission, find the matching role here: https://cloud.google.com/iam/docs/permissions-reference
    -   **what**, aka **role**:
        -   there's also _deny_ roles
        -   basic roles:
            -   owner, editor, viewer, billing-admin
        -   roles are just tuples of permissions
    -   **which** resource: org, folder, project or resource

# Services and pricing

| Service                           | Description                                           | Pricing    |
| --------------------------------- | ----------------------------------------------------- | ---------- |
| Cloud compute                     | long running VMs, <br> docker container               | ~25€/month |
| Kubernetes                        | More control over scaling than app-engine             |            |
| App engine                        | Like firebase, but custom backend coding              |            |
| Firebase                          | Provides standardized backend for frontend-apps       |            |
| Artifact registry                 | both for images as well as packages                   |            |
| Cloud Source Repo (discontinued!) | Like github (you can mirror existing github into GSR) |            |

# Remote sensing data

https://cloud.google.com/storage/docs/public-datasets?hl=de

# Google earth engine

# Local emulator

| Service         | Note                                                               |
| --------------- | ------------------------------------------------------------------ |
| pub/sub         | like kafka                                                         |
| spanner         | OLTP: like cockroach: distributed sql (transactions, linearizable) |
| big query       | OLAP: data-warehouse, columnar                                     |
| cloud storage   | like S3/minio                                                      |
| cloud functions | like lambda                                                        |
| cloud run       | kind of like k8s?                                                  |

```yml
version: "3"
services:
    pubsub:
        image: google/cloud-sdk
        command: gcloud beta emulators pubsub start --host-port=0.0.0.0:8085
        ports:
            - "8085:8085"

    bigquery:
        image: ghcr.io/goccy/bigquery-emulator:latest
        command: bigquery-emulator --host=0.0.0.0 --port=8080
        ports:
            - "8080:8080"

    storage:
        image: google/cloud-sdk
        command: gcloud beta emulators storage start --host-port=0.0.0.0:8082
        ports:
            - "8082:8082"

    functions:
        image: google/cloud-sdk
        command: gcloud alpha functions locals start --host-port=0.0.0.0:8081 --entry-point=<entry-point> --runtime=nodejs20
        ports:
            - "8081:8081"
```

# Service account management

Creating service accounts is usually not automated with terraform, but done manually. Terraform is then to use the manually created service-account for all further, automated actions.

-   create service account
    -   no password, only keypair
    -   cannot be logged in via browser
    -   List service-accounts:
        -   `gcloud iam service-accounts list`
    -   List **user/service-account** -> **IAM-role** mapping:
        -   `gcloud projects get-iam-policy <ProjectId>`
    -   Check roles of specific account:
        -   `gcloud projects get-iam-policy terraformexperiments --flatten="bindings[].members" --format="table(bindings.role,bindings.members)"  | grep TerraformSA`
    -   Check services activated for project:
        -   `gcloud services list --enabled --project <ProjectId>`
    -   Create new account:
        -   `gcloud iam service-accounts create <AccountName> --display-name=<DisplayName> --description=<Description> --project=<ProjectId>`
-   grant IAM roles
    -   `gcloud projects add-iam-policy-binding <ProjectId> --member=serviceAccount:<AccountName>@<ProjectId>.iam.gserviceaccount.com`
        -   `--role=roles/editor`
        -   `--role=roles/cloudfunctions.admin`
        -   `--role=roles/cloudscheduler.admin`
-   get keypair
    -   `gcloud iam service-accounts keys create mykeyfile.json --iam-account=<AccountName>@<ProjectId>.iam.gserviceaccount.com`
    -   make sure to git-ignore this file
