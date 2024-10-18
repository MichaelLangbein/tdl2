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
