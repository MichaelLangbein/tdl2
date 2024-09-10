# Isabelle / HOL

-   General intro to isabelle: https://www.youtube.com/watch?v=goRoo6eVcnU
-   Advanced isabelle for distsys: https://www.youtube.com/watch?v=Uav5jWHNghY&t=3315s&pp=ygUecHJvdmluZyBkaXN0cmlidXRlZCBhbGdvcml0aG1z

## Syntax

-   `<>` or `""` encloses a mathematical statement, everything else is isabelle-syntax
-   `value`
-   `lemma` and `theorem`
-   closing a lemma or theorem:
    -   `done`
    -   `oops`: will finish this later
    -   `sorry`: just believe me
-   `by`
-   `using someLemmaName`

### SML borrowed syntax

-   pattern matching
-   list:
    -   `["a", "b", "c"]`
    -   `x # xs`: appending to list
    -   `xs @ ys`: concating lists

## Proof strategies

First method: "apply scripts", aka. letting isabelle do almost all of the work

-   `apply simp`: simplification
-   `apply (induction xs)`: induction
-   `apply auto`: very common
-   `apply sledgehammer`: have mutliple theorem provers have a go (will print found steps)
-   `apply metis`
-   `apply best`
-   `apply force`
-   `quickcheck`: tries to find counterexamples to your lemma

```isabelle
lemma gaussian_sum: <\sum {1..n::nat} = (n+1)*n div 2>
    apply (induction n)
    apply auto
    done
```

Second method: "structured proofs", aka. much more explicit steps, using the _isar_ language.

```isabelle
lemma gaussian_sum <\sum {1..n::nat} = (n+1)*n div 2>
proof (induction n)
    case 0
    then show ?case by sim
next
    case (Suc n)
    have <Suc n * (Suc n + 1) div 2 = (n * (Suc n+1) + Suc n+1) div 2> by simp
    also have <... = (n * (n+1) + n + n + 1 + 1) div 2> by simp         # ... refers to the right hand side of the previous line
    also have <... = (n * (n+1) + 2 * (n+1)) div 2> by simp
    also have <... = (n * (n+1)) div 2 + n + 1> by simp
    also have <... = \sum {1..n} + (n+1)> using Suc.IH by simp          # IH: induction-hypothesis
    also have <... = \sum {1..n+1}> by simp
    finally show ?case by simp
qed
```

## functions and data types

Functions: **you** must ensure that:

-   functions terminate
-   functions are total

```isabelle
fun sum_list :: <nat list => nat>
    where   <sum_list [] = 0>
    |       <sum_list (head # tail) = head + sum_list tail>

```
