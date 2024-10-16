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

-   variable
    -   type
    -   default
    -   condition
-   output
-   import
-   resource <type> <name>
-
