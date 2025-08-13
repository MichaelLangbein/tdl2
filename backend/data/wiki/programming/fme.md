# FME

## Concepts

- **workbench** aka **FME form**: your IDE
- **Workflow** aka **workspace**: *.fmw file; an executable script
  - user parameters
    - a subset of which are "published parameters", that will be prompted for upon running
  - readers
  - transformers
  - writers
- **Workspace**:
- **fme flow**: server-side platform, like a webserver + scheduler
  - **project**s contain:
    - workflows
    - connections: to db's, buckets, api's; with securely stored credentials
    - apps = workflow + frontend
    - automation: event driven

## Publishing

- write your workflow
- publish parameters
- register with fme-flow, either as:
  - data streaming (client sends REST, then gets JSON/HTML response)
  - data download  (client sends REST, then gets link to download file)
  - job submit     (client sends REST, gets job-id for polling, but no results shown on complete, only success, cancelled or failure)
- optionally, create a webhook (not like a standard webhook, but much rather just a simple API endpoint. )

## Besprechung Milena

- publishing: rights for publishing?
  - @Avinash: muss in fme test
- test- vs prod  connection: haben 2 verschiedene server
  
- publishing: I've got a target-fgdb. Will it be published along with the worfklow?
  - manuell fgdb in data-verzeichnis kopieren, in workflow, auf server, den pfad anpassen
    - Checke dass voständig
  - config-json als userparameter mit angeben
  - ODER: verwende "Deployment parameters"
- publishing: how do I expose my user-parameters?
- data download  (client sends REST, then gets link to download file)
  - <-- kann auch polling
- async: notify on complete?
  - possible with all 3 variants
  - pubslish > subsc to notification service
  - in fme flow: new channesl in mq
  - lausche, sende email
  - body text placeholder {downloadURL}
  - <https://fmetest-sl.stromnetzdc.com/fmeserver/help/ReferenceManual/Email_Templates.htm>
  - recipietn: opt_requesteremail: <https://fmetest-sl.stromnetzdc.com/fmeserver/help/ReferenceManual/service_datadownload.htm>
- async: target-output-path (what before complete?)
