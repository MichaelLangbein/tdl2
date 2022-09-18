# TDL

## Requirements

- multiple clients at once
  
  - Problem: 
    - userA deletes task0
    - userB updates task0 before his frontend had time to become aware of userA's action
 
  - How can this be resolved?
    - Option 1 - AP: allow for conflicts, let users resolve them manually. 
    - Option 2 - CP: only allow one client to write
    - Option 3 - CA: only allow writes while connection to the server is there
 
  - Implementations:
    - Option 1 - Like dropbox: Each datapoint contains time of current and previous edit. if a new datapoint is committed that has a previous edit < db's current edit, you have a conflict.
    - Option 2 - Like spotify: force user to log out from other clients
    - Option 3 - Like RoR: block writes until connection is established; otherwise show error message

- Eventual Consistency: multiple users should, after some time, see the same state

- allow for times without connection to server
  - ActionQueue

