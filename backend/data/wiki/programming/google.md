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
            -   compute/region us-west1
        -   get
    -   `projects`
        -   create, list, describe, delete
        -   add-iam-policy-binding
    -   `services` (_enables access to diverse API's_)
        -   enable|disable|list
    -   `storage` (_access to buckets_)
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
        -   subscriptions
            -   create|delete|list
            -   pull <subscription-name> --auto-ack --limit=3
    -   `source` (_creates cloud-source repositories_)
        -   repos create <repo-name>
    -   `build` (_manages cloud-build environments_)
-   **bq** (_separate cli specifically for big-query_)

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
-   IAM: _who_ can do _what_ on _which_ resources
    -   **who**, aka **principal**:
        -   user
        -   group
        -   service-account: like a user, but not associated with a human, but a VM. So that VM can do admin-work, access cloud-storage, ...
            -   service-accounts are resources themselves, so you can control who can edit them
        -   or cloud-id
            -   used to manage roles with rotating personel in larger organizations
    -   **what**, aka **role**:
        -   there's also _deny_ roles
        -   basic roles:
            -   owner, editor, viewer, billing-admin
    -   **which** resource: org, folder, project or resource

# Services and pricing

| Service           | Description                                           | Pricing    |
| ----------------- | ----------------------------------------------------- | ---------- |
| Cloud compute     | long running VMs, <br> docker container               | ~25€/month |
| Kubernetes        | More control over scaling than app-engine             |            |
| App engine        | Like firebase, but custom backend coding              |            |
| Firebase          | Provides standardized backend for frontend-apps       |            |
| Artifact registry | both for images as well as packages                   |            |
| Cloud Source Repo | Like github (you can mirror existing github into GSR) |            |

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
