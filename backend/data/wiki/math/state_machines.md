# State machines

-   A set $S$ of states $S = \{s_1, s_2, ...\}$
-   An initial state $s_0 \in S$
-   Transitions: a binary relation over $S$: $T = \{(s_1, s_2), (s_1, s_3), ...\}$
    -   Shorthand for transition: $s_i \rightarrowtail s_{i+1}$ (note that $\rightarrowtail	  \neq \to$; the latter is used for logic statements)

### Lingo

-   execution: a legal series of states from $S$ (_legal_ meaning that for any adjacent states in the execution there is an equivalent transition in $T$)

## Invariants

A predicate $P$ of some state is an invariant of the state-machine if:
$$s_i \rightarrowtail s_{i+1} \land P(s_i) \to P(s_{i+1}) $$
... that is, if there is a transition $s_i \rightarrowtail s_{i+1}$ and if $P$ already holds for $s_i$, then $P$ holds for $s_{i+1}$. If that is true, then we have an invariant.

### Invariant Principle

If a preserved invariant of a state machine is true for the start state, then it is true for all reachable states.
The Invariant Principle is nothing more than the Induction Principle reformulated in a convenient form for state machines. Showing that a predicate is true in the start state is the base case of the induction, and showing that a predicate is a preserved invariant corresponds to the inductive step.
