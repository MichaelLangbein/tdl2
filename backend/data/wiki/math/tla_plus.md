# TLA+

Given a specification, TLA+: - _doesn't_ run all possible executions of that spec - but rather computes a graph of all reachable states.

The difference is that TLA+ can discover infinite repetitions, even cycles in that graph.
Using that information, it can notify you when an algorithm won't ever terminate.

## Lingo

- Model values: values that can be changed for every model run via the model-UI. Marked as `CONSTANT` in spec.
- Variables: not changeable via ui, but change through course of algorithm. Their evolution is traced in the model-run UI.
- **Termination** is halting when we want the algorithm to halt.
- **Deadlock** is halting when we don't want it to halt.
- **Livelock**: The situation in which processes don't deadlock but keep taking steps without making progress

### invariants vs intertemporals

- invariants: check that a state has a good property
  - eg: never have an account in overdraft
- intertemporals: check that transitions are correct
  - eg: a lock can only be released by the process that currently owns it.
  - eg: the algorithm eventually terminates
- There are two kinds of temporal properties: “safety” properties say our system doesn’t do bad things. “liveness” properties say our system always does a good thing.
  - “We do not violate any database constraints” is a safety property.
  - “All transactions either complete or roll back” is a liveness property.
  - All invariants are safety properties, but not all safety properties are invariants
  - Not all safety properties are invariants
    - Example: In every behavior, there is a particular server, and that server is online at all points in time.

## Syntax

### Basics

- `==` assignment
- `=` checks equality
- `#` checks inequality
- `:=` re-assigns a value
- `/\` land `\/` lor `~` lnot `=>` then

### Sets

`{1, 2, 3}` set

- unordered, no duplicates
- `\union`
  - aka `\cup`
- `\intersect`
  - aka `\cap`
- `\`: except
- `\X` cartesian product: `{1, 2} \X {3, 4} = {<<1, 3>>, <<1, 4>>, <<2, 3>>, <<2, 4>>}
- `S \subseteq T`: checks if S is a subset of T
- `SUBSET S`: returns _all_ subsets of S, aka. the _power set_
  - these two expressions are equal: `S \subseteq T` and `S \in SUBSET T`
- The operator `UNION` is defined so that for any set S whose elements are sets, UNION S equals the union of all the elements of S.
  - Thus, these two sets are equal: `UNION {S1, S2, ... , S99}` and `S1 \cup S2 \cup  ... \cup S99`
  - In general, the set UNION S is the _set of all elements of elements_ of S. Kind of like `.flat()`, I think.
- `BOOLEAN = {TRUE, FALSE}`
- `a..b = {a, a+1, ..., b}`
- Mapping sets: `Squares == {x*x: x \in 1..4}`
- Filtering sets: `Evens == {x \in 1..4: x % 2 = 0 }`
  - `Primes == {x \in Int: \A y \in 3..(x-1): a % y # 0 }`
- `Range` converts sequence to set: `Range(seq) == {seq[i]: i \in 1..Len(seq)}`
- `CHOOSE` picks the lowest element in a set that satisfies some predicate: `ToClock(seconds) == CHOOSE x \in ClockType: ToSeconds(x) = seconds`
- `Cardinality(S)` returns the size of a finite set

### Functions

functions `F == [x \in S |-> expr]`

- `DOMAIN F`: gives the source set of the function `F`

- ```
      Prod ==
          LET S == 1..10 IN
          [p \in S \X S |-> p[1] * p[2]]

      /* Prod[<<3, 5>>] = 15   ("<<" and ">>" are optional)
    ```

- ```
      ProdAlt == [x, y \in S |-> x * y]

      /* ProdAlt[3, 5] = 15
    ```

- ```
      Zip1(seq1, seq2) ==
          LET Min(a, b) == IF a < b THEN a ELSE b
              N == Min(Len(seq1), Len(seq2))
          IN
              [i \in 1..N |-> <<seq1[i], seq2[i]>>]
    ```

- Create a set of functions:

  - `[S -> T]`: denotes the set of all functions whose domain is S and such that $f[x] \in T$ holds for all $x \in S$.
  - That means `f \in [S -> T]` is total in S, but all the functions in this set have different codomains (aka ranges).
  - A function set of form `[A -> B]` will have $|B|^{|A|}$ elements in it.

  - ```
        Range(f) == {f[x] : x \in DOMAIN f}

        CountMatching(f, val) ==
              Cardinality({key \in DOMAIN f: f[key] = val})

        Sort(seq) ==
            CHOOSE sorted \in [DOMAIN seq -> Range(seq)]:
                /\ \A i \in DOMAIN seq:
                    CountMatching(seq, seq[i]) = CountMatching(sorted, seq[i])
                /\ IsSorted(sorted)
        ```

- `f @@ g` merges two functions, preferring keys in `f`.
- `a :> b` is special syntax for a function with a single-value-domain ({a}) and a single-value-codomain ({b}), i.e. `[x \in {a} |-> b]`
- Convenient shorthand for functions:

- ```
    Double == [x \in 1..10 |-> x * 2]
    \* can also be written as
    Double[x \in 1..10] == x * 2
    ```

### Sequences aka lists

`<<a, b, c>>` list (btw, lists are 1-indexed)

- aka tuple
- with repetition, with order
- actually just syntactic sugar for a function mapping indices `1..n` (the domain) to values: `<<a, b, c>> = [i \in 1..3 |-> IF i = 1 THEN "a" ELSE IF i = 2 THEN "b" ELSE "c"]`
- `Append(S, "a")`
- `Head(S)`
- `Tail(S)`
- `Len(S)`
- `SubSeq(S, 1, 3)`
- `seq1 \o seq2` concatenates two sequences
- `Seq(set)` is the set of all sequences with elements in set
- `Range` converts sequence to set: `Range(seq) == {seq[i]: i \in 1..Len(seq)}`

### Structures

- actually just syntactic sugar for a function mapping from some string-keys (the domain) to some values
- `struct == [a |-> 1, b |-> {}]`
- `struct["a"] = 1` or `struct.a = 1`
- sets of structures:
  - `BankTransactionType == [acct: Accounts, amnt: 1..10, type: {"deposit", "withdraw"}]`
  - This is the set of all structures where s.acct \in Accounts, s.amnt \in 1..10, etc.
- `DOMAIN`: gets all the keys of a struct
- `RangeStruct(struct) == {struct[key]: key \in DOMAIN struct}`: converts a struct to a set

### Control structures

- `IF ... ELSE ...`
- `LET ... IN ...`

  - ```
        ClockType == (0..23) \X (0..59) \X (0..59)

        ToClock(seconds) ==
            LET seconds_per_day == 86400
            IN CHOOSE x \in ClockType: ToSeconds(x) = seconds % seconds_per_day
        ```

  - ```
          ToClock2(seconds) ==
              LET
                  h == seconds \div 3600
                  h_left == seconds % 3600
                  m == h_left \div 60
                  m_left == h_left % 60
                  s == m_left
              IN
                  <<h, m, s>>
        ```

- `CONSTANT`: define a variable not in spec, but via UI in model-wizard
- `VARIABLE`: identical to PlusCal's `variable`
- `ASSUME`: identical to PlusCal's `assert`. Commonly used to restrict `CONSTANT` to have certain values.
- `LAMBDA`: for anonymous operators

- ```
    Fizzbuzz(x) ==
        CASE (x % 3 = 0) /\ (x % 5 = 0) -> "Fizzbuzz"
            [] (x % 3 = 0)                -> "Fizz"
            [] (x % 5 = 0)                -> "Buzz"
            [] OTHER                      -> x
    ```

### Temporal properties

The following hold for within one behavior:

- always true: `[]P`
  - means P is true for every state in every behavior
  - `~[]P`: "In every behavior, there is at least one state where P is false".
    - _Doesn't mean_: "There is at least one behavior which has at least one state where P is false".
  - `~[]~P`: in every behavior, P holds at least once ... aka `<>P`
- eventually true: `<>P`
  - might become false again later
  - `<>[]P`: P is eventually true and then stays true
  - `[]<>P`: For example, in an hour clock, []<>(time = midnight) is true, but <>[](time = midnight) is false.
    - I haven't explained what []<>P asserts about a finite behavior. An easy way to think about what a temporal formula means for finite behaviors is to pretend that a finite behavior is an infinite behavior in which the final state is repeated forever. This pretense tells us that []<>P is true for a finite behavior iff P is true of the last state of that behavior.
- leads to: `P ~> Q`
  - If P is true, Q will eventually be true (in the same or a future time step)
  - P ~> Q is triggered every time P is true. Even if the formula was satisfied before, if P becomes true again, then Q has to become true again too.
- `ENABLED someLabel` is true if `someLabel` can be reached in the next step

### Action properties

- `[statement]_vrbl`:
  - means $vrbl' \neq vrbl \to statement$
- `<<statement>>_vrbl`:
  - means $vrbl' \neq vrbl \land statement$
- `[][x' > x]_x`: it's always true (`[]`) that x only increases (`x' > x`) assuming that x has changed at all (`[...]_x`)
  - a reason why x might not have changed is stuttering
- Action properties can account for one of multiple values changing:

- ```
       CounterOnlyIncreases ==
            [][
                \A c \in Counters:
                    values[c]' >= values[c]
              ]_values
    ```

### Fairness formally

- Weak fairness

  - `WF_v(A) == <>[](ENABLED <<A>>_v) => []<><<A>>_v`
  - WF_v(A) (A is weakly fair): If it is eventually always true that the A action can happen (in a way that changes v), then it will eventually happen (and change v).
  - My informal definition: if the process is always online (= never offline), it will eventually run

- Strong fairness
  - `SF_v(A) == []<>(ENABLED <<A>>_v) => []<><<A>>_v`
  - SF_v(A) (A is strongly fair): If it is always eventually true that the A action can happen (in a way that changes v), then it will eventually happen (and change v).
  - My informal definition: if the process is online infinitely often (even if its also offline infinitely often), it will eventually run

Syntax:

- <https://d3s.mff.cuni.cz/f/teaching/nswi101/old/pluscal.pdf>
- `fair algorithm`
- `fair+ algorithm`
- `fair process`
- `fair+ process`
- `label:+`: make label strongly fair
- `label:-`: make label unfair

Strong and weak fairness of a step sp are equivalent if the step cannot be disabled or enabled by a step of another process. This is usually the case if sp does not contain an await statement.

### Recursion

Summing a sequence:

```TLA+
RECURSIVE SumSeq(_)
SumSeq(s) == IF s = <<>> THEN 0 ELSE
    Head(s) + SumSeq(Tail(s))
```

Note that TLA+ does not check that a recursive expression ever terminates.

Alternatively:

```TLA+
SumSeq(s) == LET
  RECURSIVE Helper(_)
  Helper(s_) == IF s_ = <<>> THEN 0 ELSE
  Head(s_) + Helper(Tail(s_))
IN Helper(s)
```

# Pluscal

## Variables

- `variable` at the beginning of your code, list all variables used

  - ```
        variable
            seq \in S \X S \X S \X S;
            index = 1;
            seen = {};
            is_unique = TRUE;
        ```

  - inside a variable block, we use a single `=` for assignment.
  - variables using `\in` will pick a different member for every run
  - I think that assignment `==` happens in TLA+ but outside of PlusCal, so all `==` that you need to make should occur before `(*--algorithm`.
  - all those variables will be watched in the debug-view, plus an additional `pc` variable, which contains the name of the next label to be executed.
  - `CONSTANT`: like a variable, but can be configured via the model ui. (Actually not pluscal, but TLA+ syntax)

## Definitions

- `define ... end define;`
  - specify here all your operators aka predicates aka invariants:

  - ```
        define
            TypeInvariant ==
                /\ is_unique \in BOOLEAN
                /\ seen \subseteq S
                /\ index \in 1..Len(seq)+1
        end define;
        ```

  - the contents of define are written in TLA+, not in plusCal

## Labels

Labels: an atomic unit of work. Code inside a label cannot be interrupted, but between labels it can.

- every statement must belong to a label
- a variable can only be assigned to once inside of one label
  - special case: lists
    - technically, you cannot update two elements of a list within one label
    - but there is the `simultaneous update` operator `||`

    - ```
            Label:
                seq[1] := seq[1] + 1 ||
                seq[2] := seq[2] - 1;
            ```

- labels are not really nested. Label `B` can be nested inside an `if` statement inside label `A`, but its not like label `B` then disappears once the `if` statement is done - it remains active until the control-flow reaches another label.
- `pc`: the program-counter; shows the name of the next label to be executed. If inside of a `process`, `pc` is indexed by the processes instance-name
- `await` is a restriction on when the label can run. A label can only run when all `await`s evaluate to true.
  - don’t use updated variables in await statements
- `+` appended after label: makes label "strongly fair"

## Control flow

- `if ... else ... end if;`
- `while ... do ... end while;`
  - a while loop may be interrupted on every iteration
- `with ... do ... end with;`
  - `with x \in set` blocks a label from running if `set` is empty.
  - randomly picks one x from set
- `skip`: noop
- Either or: is a non-deterministic "pick one of the following":

- ```
    either
        approve_pull_request();
    or
        request_changes();
    or
        reject_request();
    end either;
    ```

- `assert someExpr`
  - When an assert fails, the error trace will end with the step _before_ the failed assert; whereas if an invariant fails, the error trace goes all the way up to and including the failing step.
- `goto L`: jumps to label L. A label must immediately follow any goto statement.
- `macro ... begin ...; end macro;` macros are just textual substitutions that accept parameters. Macros cannot contain labels

## Processes

`process processName = "instanceName" [variables ...;] begin ...; end process;`

- Note that you can have many processes and for each process many instances
- `instanceName`s must be comparable, so the should be integers, strings or model-values.
- The variable `pc` is actually indexable by `instanceName` like so: `currentProgramCounter := pc["instanceName"]`
- Processes can get their own instance-name with the special variable `self`
  - This only works if the processes instance-name comes from a set. If the instance name is instead hardcoded with a `=`, just use the hardcoded value instead.
- `fair process processName`: "weakly fair"; means that this process cannot crash (aka. stutter = remain in same state) _forever_
- `fair+`: "strongly fair"
  - weakly fair: if the process is always online (= never offline), it will eventually run
  - strongly fair: if the process is online infinitely often (even if its also offline infinitely often), it will eventually run
  - the `+` can also be applied to individual labels
-

## Things that I'm not sure about

- I think that you can't have a `LET` statement inside an `either` statement
- I think that you can't have a `:=` update inside of a `define` block
- `await` inside an `either` block will make choosing this option impossible ... but it doesn't block other options from running

## Examples

### Get all arrays of elements (a, b, c) of up to 5 members

```TLA+
EXTENDS Integers


Permutations ==
    UNION {                                     ; .flat()
            [1..j -> {"a","b","c"}]             ; all arrays of length j with range a,b,c
            : j \in 1..5
        }
```

### Find max

```TLA+
EXTENDS Integers, TLC, Sequences, FiniteSets

list == <<1, 2>>

(* --algorithm session2

    variable
        index = 0,
        candidate = 0,
        currentMax = 0;

    define
        range(seq) ==
            {seq[i]: i \in 1..Len(seq)}

        indexInRange ==
            index \in 0..(Len(list)+1)

        isMax ==
            \A x \in range(list): currentMax >= x

        eventuallyIsMax ==
            <>[]isMax

        inSeq ==
            currentMax \in range(list)

        eventuallyInSeq ==
            <>[]inSeq
    end define;

    fair process p = 1
    begin
        Step:
            while index < Len(list) do
                index := index + 1;
                candidate := list[index];
                if candidate > currentMax then
                    currentMax := candidate;
                end if;
            end while;
   end process;

end algorithm;
*)
```

### Duplicate checker

```TLA+
EXTENDS Integers, Sequences, TLC, FiniteSets

S == 1..10

(*--algorithm duplicates

variable seq \in S \X S \X S \X S;
    index = 1;
    seen = {};
    is_unique = TRUE;

define
  TypeInvariant ==
    /\ is_unique \in BOOLEAN
    /\ seen \subseteq S
    /\ index \in 1..Len(seq)+1

   IsUnique(s) ==
        \A i, j \in 1..Len(s):
        i # j => s[i] # s[j]

   IsCorrect ==
        pc = "Done" => (IsUnique(seq) => is_unique)
end define;

begin

    Iterating:
        while index <= Len(seq) do
            if seq[index] \in seen then
                is_unique := FALSE;
            else
                seen := seen \union {seq[index]};
            end if;
            index := index + 1;
        end while;


end algorithm; *)
```

### Concurrent write and read from queue

```TLA+
EXTENDS Integers, Sequences, TLC

(* --algorithm concurrent


variables
    queue = <<>>;
    total = 0;
    maxWrites = 3;


process writer = 1
variables
    write = 0;
begin
    AddToQueue:
        while write < maxWrites do
            queue := Append(queue, 1);
            write := write + 1;
        end while;
end process;

process reader = 2
begin
    TakeFromQueue:
        if queue # <<>> then
            total := total + Head(queue);
            queue := Tail(queue);
        end if;
end process;

end algorithm; *)

```

### Showcasing a race condition

- Objective: have each thread increment the counter
- correctness: this algorithm should cause the counter in the end to equal the number of threads
- Observed race condition: because counter can become outdated after getting its current value, you can end up with a too low counter

```TLA+
----------------------------- MODULE concurrent -----------------------------
EXTENDS Integers, Sequences, TLC


NumThreads == 2
Threads == 1..NumThreads


(* --algorithm concurrent

variables
    counter = 0;

 define
    AllDone ==
        \A t \in Threads: pc[t] = "Done"

    Correct ==
        AllDone => counter = NumThreads
 end define;


process thread \in Threads
variables
    localCounter = 0;
begin
    GetCounter:
        localCounter := counter;
    IncCounter:
        counter := localCounter + 1;
end process;


end algorithm; *)
```

Fixing the race condition with a lock:

```TLA+
EXTENDS Integers, Sequences, TLC

CONSTANT NULL

NumThreads == 2
Threads == 1..NumThreads


(* --algorithm concurrent

variables
    counter = 0;
    lock = NULL;

 define
    AllDone ==
        \A t \in Threads: pc[t] = "Done"

    Correct ==
        AllDone => counter = NumThreads

    CorrectStateReachable ==
        <>[](counter = NumThreads)

    CounterOnlyIncreases ==
        [][counter' >= counter]_counter

    LockCantBeStolen ==
        [][\A t, u \in Threads: (lock = t) => (lock' # u)]_lock

 end define;


fair process thread \in Threads
variables
    localCounter = 0;
begin
    GetLock:
        await lock = NULL;
        lock := self;
    GetCounter:
        localCounter := counter;
    IncCounter:
        counter := localCounter + 1;
    ReleaseLock:
        lock := NULL;
end process;


end algorithm; *)
```

<br/>
<br/>
<br/>
<br/>
<br/>

### Die hard 3

```TLA+
EXTENDS Integers, TLC, Sequences, FiniteSets

smallJugMax == 3
largeJugMax == 5

(* --algorithm diehard

variables
    smallJug = 0;
    largeJug = 0;

define
    min(set) ==
        CHOOSE e \in set: \A o \in set: e <= o

    has4gals ==
        smallJug = 4 \/ largeJug = 4

    no4gals == ~has4gals

    eventually4gals == <>has4gals
end define;


fair process dieHard = 1
variables
    freeSpaceLarge = 0;
    freeSpaceSmall = 0;
    transferred = 0;
begin
    pouring:
        either
            (* empty small *)
            smallJug := 0
        or
            (* empty large *)
            largeJug := 0
        or
            (* fill small *)
            smallJug := smallJugMax
        or
            (*  fill large *)
            largeJug := largeJugMax
        or
            (* pour small in large *)
            freeSpaceLarge := largeJugMax - largeJug;
            transferred := min({smallJug, freeSpaceLarge});
            smallJug := smallJug - transferred;
            largeJug := largeJug + transferred;
        or
            (* pour large in small *)
            freeSpaceSmall := smallJugMax - smallJug;
            transferred := min({largeJug, freeSpaceSmall});
            smallJug := smallJug + transferred;
            largeJug := largeJug - transferred;
        end either;
    goto pouring;
end process;


end algorithm; *)
```

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

<https://lamport.azurewebsites.net/tla/tutorial/session8.html>

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

- Let p_1, p_2 \in Procs
- Let turn = 1
- Assume p_1 hangs at NonCriticalSection
  - thus turn can never become 2
  - thus p_2 can never complete Enter

# Routing

<https://lamport.azurewebsites.net/tla/tutorial/session10.html>

```TLA+
EXTENDS Integers, FiniteSets

CONSTANT None
infty == 99999

nodes == {"a", "b", "c", "d"}
edges == {
    {"a", "b"},
    {"b", "c"},
    {"c", "d"},
    {"b", "d"}
}
root == "d"

Nbrs(n)  ==  {m \in nodes : {m,n} \in edges}

SetNbrs(S)  ==  UNION {Nbrs(n) : n \in S}

RECURSIVE ReachableFrom(_, _)
ReachableFrom(B, T)  ==
    IF B = {} THEN T
    ELSE ReachableFrom(SetNbrs(B) \ T, B \union T)

ASSUME
    /\  root \in nodes
    /\  \A edge \in edges: edge \subseteq nodes /\ Cardinality(edge) = 2
    /\  ReachableFrom({root}, {}) = nodes

(* --algorithm routing

variables
    messages = {
        [depth |-> 0, from |-> root, to |-> nbr]
        : nbr \in Nbrs(root)
    };

define
    terminated ==
        Cardinality(messages) = 0

    doesTerminate ==
        <>terminated

    onTerminationshortestPaths ==
        terminated => shortestPath
end define;

fair process Node \in nodes
variables
    parent = IF self = root THEN self ELSE None,
    depth = IF self = root THEN 0 ELSE infty;
begin
    Receive:
        while TRUE do
            with message \in {m \in messages : m.to = self} do
                if message.depth < depth - 1 then
                    depth := message.depth + 1;
                    parent := message.from;
                    messages := ( messages \ {message} )
                                \union { [depth |-> depth, from |-> self, to |-> nbr] : nbr \in Nbrs(self) }
                else
                    messages := messages \ {message};
                end if;
            end with;
        end while;
end process;

end algorithm; *)
```

# Messaging

## AB-Protocol (simplified TCP)

# Caveats

## Be careful with \E and =>

With $\exists$ you usually don't want $a \to b$ but rather $a \land b$
$$\forall x \in X: x < 5 \to Q(x)$$
$$\exists x \in X: x < 5 \land Q(x)$$

## Sets defined as subsets vs constructively

Let's compare these two ways of defining the set of even integers:

```
EvenInt1  ==  {n \in Int : n % 2 = 0}
EvenInt2  ==  {2 * n  : n \in Int}
```

They define EvenInt1 and EvenInt2 to both equal the same set—the set of all integers that are multiples of 2. The first defines a subset of Int; the second builds a new set of elements from the elements of Int. I don't know of any standard names for these two ways of describing sets, so I'll call the first subsetting and the second building.

While the definitions of EvenInt1 and EvenInt2 are mathematically equivalent, TLC handles them differently. In particular, TLC can evaluate the expression 42 \in EvenInt1, but not the expression 42 \in EvenInt2. To tell if a value is an element of a set described with building, TLC has to construct the entire set, which it can do only if the set is finite.

# TLAPS

- <https://sriramsami.com/tlaps/>
- <https://lamport.azurewebsites.net/pubs/proof.pdf>

Proof strategies:

- `OBVIOUS`
- `BY DEF`
- `BY IsaMT("blast", 60)`
  - <https://proofs.tlapl.us/doc/web/content/Documentation/Tutorial/Tactics.html>
  - M: sets the Isabelle tactic (here to "blast")
  - T: sets the Isabelle timeout (here to 60 seconds)
