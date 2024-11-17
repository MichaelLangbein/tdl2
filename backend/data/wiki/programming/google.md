# Google cloud

https://cloud.google.com/

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
