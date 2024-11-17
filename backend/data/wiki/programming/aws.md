# AWS

## Lingo

-   AZ: availability zone

## S3: File storage

https://aws.amazon.com/s3/pricing/

-   storage:
    -   First 50 TB / Month: $0.023 per GB
-   transfer:
    -   to AWS service in same region:
        -   free
    -   to AWS service in other region:
        -   2ct / GB
    -   to internet:
        -   first 100GB / month free
        -   then 9ct / GB
    -   to CloudFront:
        -   free

## File cache

Tends to be pretty expensive! Consider using S3.

## EC2: Server hosting

## Lambda

-   seconds:
    -   First 6 Billion GB-seconds / month $0.0000166667 for every GB-second
-   requests:
    -   $0.20 per 1M requests
-   memory:
    -   8192MB $0.0001333 / s
-   ephemeral storage:
    -   $0.0000000309 for every GB-second
-   download:
    -   same as s3

If one session lasts 100sec, uses 1GB of data and involves 100 requests, this gets us to 1.669ct per session ... plus the download costs.

## RDS: Database

-   Allows Postgres
-   first year free
-   Pricy, because needs to be running always.
-   100GB storage, postgres, 4CPU, 8GB:
    -   Total Upfront cost: 921.00 USD
    -   Total Monthly cost: 11.50 USD

## SimpleDB 👍

-   first 25h and 1GB free
-   data in: free
-   data out:
    -   14ct / hour
    -   $0.09 per GB

## CloudFront: CDN

-   transfer to internet:
    -   fist 1TB / month free
    -   then 8.5 ct / GB
-   ssl certificates:
    -   free

# Pricing control

-   Monitor usage with [Budgets](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/tracking-free-tier-usage.html#free-budget)

    -   setting a _zero spend budget_ using [template](https://docs.aws.amazon.com/cost-management/latest/userguide/budget-templates.html)

    -   [budget actions](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-controls.html) to shut down your services once you exceed a budget

        -   there is no "shut down" action ... instead you apply a new policy to a user-account so it can no longer execute expensive services.
        -   todo: add a "do nothing" policy to your app-user .......................................................

-   Monitor cost in [Billing console](https://console.aws.amazon.com/billing)
    -   [usage alerts](https://us-east-1.console.aws.amazon.com/billing/home#/preferences)

## Closing account

-   Only closing your account might not stop all services.
-   https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/close-account.html

# Safety

-   root account
    -   the one that you sign in with your email (instead of an IAM)
    -   has all permissions
    -   should be used only to:
        -   create and delete users
        -   inspect and set billing
-   user accounts

# Lambda: operational

-   url

# Localstack

-   intro: https://www.youtube.com/watch?v=SYCeM-Q6nRs

Simulates most AWS services locally

Capabilities: https://docs.localstack.cloud/user-guide/aws/feature-coverage/

| Service             | Free tier | Pro      | Notes                |
| ------------------- | --------- | -------- | -------------------- |
| DynamoDB            | emulated  |          | NoSql key/value      |
| DynamoDBStreams     | emulated  |          |                      |
| Relational DB (RDS) |           | emulated | Postgres             |
| Redshift            |           | emulated | OLAP                 |
| EC2                 | API       | emulated | as docker image      |
| lambda              | emulated  |          |                      |
| Step functions      | emulated  |          | workflows of lambdas |
| S3                  | emulated  |          |                      |
| SQS                 | emulated  |          |                      |
| Elastic search      | emulated  |          |                      |
