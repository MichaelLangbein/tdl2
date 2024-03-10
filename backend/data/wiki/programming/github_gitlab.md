# Gitlab

- group
  - projects
    - one git repo
    - issue tracker
    - wiki
  - contacts, CRM
  - users
    - role: guest, reporter, dev, maintainer, owner, minimal

# Github

https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository
https://stackoverflow.com/questions/40509838/project-vs-repository-in-github#:~:text=Ibbotson%27s%20comment%3A-,A%20GitHub%20repository%20is%20just%20a%20%22directory%22%20where,folders%20and%20files%20can%20exist.&text=A%20project%20can%20contain%20many,tasks%20for%20a%20certain%20feature.

- repo

  - can belong to users or to organizations
  - visibility
  - issues
  - actions
  - PRs
  - access:
    - admin, collaborator
    - unlimited amount
    - need to have a github account
    - can be grouped in organizations

- projects

  - can belong to repositories or organizations
  - visibility
  - kanban board
  - access:
    - owner, write, read

- organizations
  - teams
    - user

## Experiments

**Setup**:

- create clientA
- create clientB

**Experiment 1**: many projects on one repo.
I don't want different clients to see each other.

- crete one repo
- make two projects from that repo
- to project a invite user a
- to project b invite user b
- Can user a see user b?
- Can user a see project b?
- Can users a and b see the actual repo?

**Experiment 2**: one user, many projects.
I want my old clients to not lose their old history.

- create one repo
- create one project
- invite user a
- create another project
- can user a already see project b?
- invite user a
- can user a still see project a?

## Pages

https://pages.github.com
