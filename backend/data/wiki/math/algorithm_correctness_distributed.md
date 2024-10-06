# Distributed algorithm correctness

References based on "Designing data intensive applications"

# Multithreading

## Locks

Note how this algorithm fails to reliably result in the number 2:

```TLA+
EXTENDS Integers

(* --algorithm session7_mine

variable
    x = 0;

define
    isEventuallyTwo ==
        <>[](x = 2)
end define;

fair process ReadWriter \in {1, 2}
    variable temp = 0;
begin
    read:
        temp := x;
    write:
        x := temp + 1;
end process;

end algorithm; *)
```

It's fixed with a lock, aka _mutex_:

```TLA+
EXTENDS Integers

CONSTANT None, N

(* --algorithm session7_mine

variable
    lock = None,
    x = 0;

define
    isEventuallyN ==
        <>[](x = N)

    noInterloping ==
        \A i, j \in 1..N:
            (pc[i] \in {"read", "write"}) /\ (pc[j] \in {"read", "write"})  =>  (i = j)
end define;


fair process LockedReadWriter \in 1..N
    variable temp = 0;
begin
    acquireLock:
        await lock = None;
        lock := self;
    read:
        temp := x;
    write:
        x := temp + 1;
    freeLock:
        lock := None;
end process;

end algorithm; *)
```

## Dijkstra conditions on locks

https://lamport.azurewebsites.net/tla/tutorial/session8.html

Dijkstra defines a non-critical section (which may lag arbitrarily long), an enter-section, a critical section and an exit section.

```TLA+
fair process Alg \in Procs
begin
    Loop:
        while TRUE do
            NonCriticalSection:-    (*Note that this label is _un_fair*)
                skip;
            Enter:
                skip;
            CriticalSection:
                skip;
            Exit:
                skip;
        end while;
end process;

end algorithm; *)
```

Dijkstra lists the following requirements for a lock:

1. **Mutex**:
    - $\forall p, q \in Procs: p:\text{critical} \land q:\text{critical} \to p = q$
    - ```TLA+
        mutualExclusion ==
            \A p, q \in Procs:
                (pc[p] = "CriticalSection" /\ pc[q] = "CriticalSection") => p = q
      ```
2. Any processes may take arbitrarily long to execute its noncritical section, and may even halt there. Other processes must be able to enter the critical section without having to wait for those processes to complete the noncritical section.

    - in TLA+ this means that `NonCriticalSection` must not be fair, in combination with
    - $\forall p,q \in Procs: p:\text{stuck} \land \lnot q:\text{stuck} \to \diamond pc[q] = \text{CriticalSection}$
    - In code:
        ```
        noWaitingOnOthers ==
        \A p, q \in Procs:
            <>[](pc[p] = "NonCriticalSection") /\ \lnot <>[](pc[q] = "NonCriticalSection")
                => <>(pc[q] = "CriticalSection")
        ```
    - Maybe this can be written better with `ENABLED`?

3. There exists no execution, no matter how improbable it may be, in which at some point a process is in the entry code but no process is ever in the critical section.
    - ```TLA+
        ifEnterThenCritical ==
            (\E p \in Procs : pc[p] = "enter") ~> (\E q \in Procs : pc[q] = "cs")
      ```
4. If no process remains forever in the critical section, then any process that begins executing the entry code eventually enters the critical section. This is called being **starvation free**
    - ```TLA+
      starvationFree ==
          (\A p \in Procs: \lnot <>[](pc[p] = "CriticalSection")) =>
              \A p \in Procs: pc[p] = "Entry" ~> pc[p] = "CriticalSection"
      ```

### Example of violating Dijkstra's second condition

```TLA+
turn = 1

process p \in 1..N begin
    NonCriticalSection:
        ...
    Enter:
        await turn = self;
    CriticalSection:
        ...
    Exit:
        turn := turn + 1;
end process;
```

Prove that a process can be held up from entering critical by another process stuck in non-critical:

-   Let p_1, p_2 \in Procs
-   Let turn = 1
-   Assume p_1 hangs at NonCriticalSection
    -   thus turn can never become 2
    -   thus p_2 can never complete Enter

# Routing

https://lamport.azurewebsites.net/tla/tutorial/session10.html

# Replication

## Replica failover

p. 156

## Replication lag

p. 161

# Transactions

## Transaction concurrency control (weak isolation levels)

p. 233

# Cache invalidation

-   Most common strategy: "cache aside"
-   Invalidating cache entries when db updates:
    -   "write through caching": upon writing to db, delete matching line from cache
        -   make sure this is transactional/atomic
-   Invalidating cache entries for other reasons:
    -   for cookies/sessions: fixed expiry date for each cache-entry
    -   to save memory: remove least-recently-used keys from cache

# DB indexing

# Message delivery

-   Prove that exactly-once-delivery is impossible in a faulty network
-   https://blog.bulloak.io/post/20200917-the-impossibility-of-exactly-once/
