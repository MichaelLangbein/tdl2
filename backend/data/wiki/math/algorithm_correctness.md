# Algorithm correctness

1. Write down algorithm
    1. write down the algorithms objective
2. List derived variables
    1. Good candidates include:
        1. algebraic combinations of the algorithms variables
        2. simple if then formulas
3. If a variable is an **invariant**:
    1. prove that it is an invariant (using induction)
    2. if it relates to the objective: use it to prove **correctness** upon termination
    3. if it isn't: can it be used to differentiate between reachable and unreachable states?
4. It a variable is increasing or **decreasing**:
    1. use it to prove **termination** (using well ordering principle)
    2. if it is _strictly_ in/decreasing: use it as an upper bound for runtime

# Liveness and Safety

-   **Safety**:
    -   A safety property is one that, if it is not satisfied by an execution, then you can tell that it's not satisfied by looking at a finite portion of the execution—even if the execution is infinite.
    -   Invariants are one example of a safety property.
-   **Liveness**:
    -   A liveness property is one for which you have to look at the entire execution, which may be infinite, to determine that it is not satisfied.
    -   Termination is one example of a liveness property.
    -   Weak and strong fairness are also liveness properties.

https://courses.csail.mit.edu/6.042/spring18/mcs.pdf

# Well ordering principle

This is one of the most fundamental axioms of number theory.

> Let $C$ be a non-empty set of integers $\mathbf{N}$. Then $C$ must have a smallest element.

Mathematicians often talk about the WOP being equivalent to the axiom of choice, but as is the custom, they mean something even more general. We'll be dealing with this simple version here.

## WOP proofs

WOP proofs are useful for proving things in number theory and algorithms. Often times, things are more intuitively done with induction, but proving that an algorithm halts, or proving things about prime-numbers or divisibility, are actually elegantly solved with WOP proofs.

> To proof a statement of the form $\forall x \in \mathbf{N}: S(x)$:
>
> Consider the set of counterexamples $C := \{c \in \mathbf{N} | \lnot S(c) \}$
>
> For proof by contradiction, assume that $C \neq \{\}$
>
> Then by the WOP, $C$ must have a smallest element $c_0$
>
> Often: proof that $0 \not\in C$
>
> Now we have a number line like this:

```
    natural numbers
  |----------------------|-----------
  0                      c_0
\_____________________/  |
        S                |
                        not S

```

> Now try to find a contradiction:
>
> -   Strat 1: consider $c_0 - 1$ where $S(c_0-1)$ must hold. Proof that this contradicts something.
> -   Strat 2: proof that $S(c_0)$ must be true, after all

### Example 1

Statement $S(k)$: $k$ can be factorized by primes

-   In math: $\exists p_1, p_2, p_3, ... \in \mathbf{P}: p_1 \cdot p_2 \cdot p_3 \cdot ... = k$
-   where $\mathbf{P}$ is the primes $\mathbf{P} := \{ p \in \mathbf{N} | \forall a: 1 < a < p, \forall b: 1 < b < p: p \neq a \cdot b \}$

Proof that $\forall k \in \mathbf{N}: S(k)$

> Let $C$ be the set of counterexamples $C := \{ c \in \mathbf{N} | \lnot S(c) \}$
>
> For a contradiction, assume that $C$ is non-empty. Thus it must have a smallest element $c_0$.
>
> > **Case 1**: $c_0 \in \mathbf{P}$$:
> >
> > Then $S(c_0)$ holds trivially: you just need to pick a single prime $p$, namely $c_0$ itself
>
> > **Case 2**: $c_0 \not\in \mathbf{P}$$:
> >
> > Then $\exists a_0 < c_0, b_0 < c_0: c_0 = a_0 b_0$
> >
> > Since both $a_0$ and $b_0$ are smaller than $c_0$, $S$ must hold for them.
> >
> > Thus $a_0 = p^a_1 \cdot p^a_2 \cdot p^a_3 \cdot ...$ and $b_0 = p^b_1 \cdot p^b_2 \cdot p^b_3 \cdot ...$
> >
> > But that means that $c_0 = a_0 b_0 = p^a_1 \cdot p^a_2 \cdot p^a_3 \cdot ... p^b_1 \cdot p^b_2 \cdot p^b_3 \cdot ...$
> >
> > Thus again, $S$ holds for $c_0$

### Example 2

You're given checks of the following values:

-   1$
-   2$
-   4$
-   ...
-   $2^m$$

Proof $\forall k \in \mathbf{N}, k < 2^{m+1}$ holds the statement $S(k)$: you can get k$ by adding up some of your checks.

$S(k)$ in math-notation:
$$ \exists \alpha_1, \alpha_2, ...: k = 1 \alpha_1 + 2 \alpha_2 + 4 \alpha_3 + ... + 2^m \alpha_m$$
where all $\alpha$s are either 0 or 1.

> Proof by contradiction.
>
> Let $C$ be the set of counterexamples: $C := \{ c \in \mathbf{N} | \lnot S(c) \}$
>
> For a contradiction, assume that $C$ is non-empty.
>
> Then $C$ must have a smallest element, $c_0$.
>
> $c_0$ cannot be $0$, because $0$ is trivially obtained with all $\alpha$s being 0.
>
> ... hmmm ...

### Using WOP to proof week induction

Defining week induction:

-   Consider set $S$
-   $S$ has the property $k \in S \to (k+1) \in S$
-   Week induction := $1 \in S \to S = \mathbf{N}$

Proving week induction: prove that $1 \in S \to S = \mathbf{N}$

> By contradiction, assume $\lnot(1 \in S \to S = \mathbf{N})$
>
> That is equivalent to $1 \in S \land S \neq \mathbf{N}$
>
> Now we have:
>
> 1. $1 \in S$
> 2. $k \in S \to (k+1) \in S$
> 3. $S \neq \mathbf{N}$
>
> Consider the set of counterexamples $C := \mathbf{N} \backslash S$, i.e. those numbers that 2. does not manage to place in $S$
>
> By WOP, there is a smallest element of $C$, called $c_0$.
>
> $c_0 \neq 1$, because of (1). So $c_0 > 1$
>
> Consider $c_0 - 1$. This must be in $S$, since $c_0$ is the smallest element not in $S$.
>
> But by (2), $c_0 \in S$, which is a contradiction.
