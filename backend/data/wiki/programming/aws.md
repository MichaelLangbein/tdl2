# AWS

## Lingo

- AZ: availability zone


## S3: File storage

https://aws.amazon.com/s3/pricing/

- storage: 
    - First 50 TB / Month: $0.023 per GB
- transfer: 
    - to AWS service in same region:
        - free
    - to AWS service in other region:
        - 2ct / GB
    - to internet:
        - first 100GB / month free
        - then 9ct / GB
    - to CloudFront:
        - free


## File cache 



## EC2: Server hosting


## Lambda
- seconds:
    - First 6 Billion GB-seconds / month	$0.0000166667 for every GB-second	
- requests:
    - $0.20 per 1M requests
- memory:
    - 8192MB	$0.0001333 / s
- ephemeral storage:
    - $0.0000000309 for every GB-second
- download:
    - same as s3


If one session lasts 100sec, uses 1GB of data and involves 100 requests, this gets us to 1.669ct per session ... plus the download costs.



## RDS: Database
- Allows Postgres
- first year free
- Pricy, because needs to be running always.
- 100GB storage, postgres, 4CPU, 8GB:
    - Total Upfront cost: 921.00 USD
    - Total Monthly cost: 11.50 USD


## SimpleDB  👍
- first 25h and 1GB free
- data in: free
- data out:
    - 14ct / hour
    - $0.09 per GB


## CloudFront: CDN

- transfer to internet:
    - fist 1TB / month free
    - then 8.5 ct / GB
- ssl certificates:
    - free