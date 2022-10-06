# CI

## Github actions
Documentation from [here](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)

### Terminology

- A **runner** is a VM. Each workflow runs in a fresh VM.
- A **workflow** will run one or more jobs.
- A **job** is a set of steps. 
    - Each step is eather a shell-script or an action.
    - All steps of a job execute on the same runner.
- An **action** is a separate script
    - either provided by github
    - or self-defined and stored at `.github/actions/<action-name>/action.yml`
- Defined in `.github/workflows/<workflow-name>.yml`