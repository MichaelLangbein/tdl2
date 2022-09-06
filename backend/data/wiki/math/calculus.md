$
\gdef\then{\to}
\gdef\thereis{\exists}
\gdef\iff{\leftrightarrow}
\gdef\intersection{\cap}
\gdef\union{\cup}
\gdef\reals{\mathbb{R}}
\gdef\naturals{\mathbb{N}}
\gdef\diff#1{\mathop{d#1}}

\gdef\subs#1#2{#1_{#2}}
\gdef\std#1{\subs{#1}{std}}
\gdef\nstd#1{\subs{#1}{nstd}}
\gdef\pnstd#1{\subs{#1}{(nstd)}} %potentially nonstandard
\gdef\ext#1{\subs{#1}{ext}}
\gdef\pext#1{\subs{#1}{(ext)}} % potentially external

\gdef\mtrx#1{\mathbf{#1}}
\gdef\nullspace#1{\mathcal{N}_{#1}}
\gdef\collspace#1{\mathcal{C}_{#1}}
\gdef\rowspace#1{\mathcal{R}_{#1}}
\gdef\solspace#1{\mathcal{S}_{#1}}
\gdef\dimension#1{\text{dim}_{#1}}
\gdef\rank#1{\text{rank}_{#1}}
\gdef\symm{\text{sym}}
\gdef\orthtxt{\text{orth}}
\gdef\PSD{\text{PSD}}
$

# Calculus

## Hyperreals

For the biggest part, we're going to deal with Nelson-style nonstandard-analysis. 

List of external properties:

- std, nstd
- limt, nlimt
- inftsm, inft
- nearly cont


A statement using any external properties will be denoted as $\ext{A}$, one that *might* use external properties as $\pext{A}$.

We will use the following axioms:
 - $0:std$
 - $\forall n \in \naturals: n:std \then (n+1):std $
 - $\thereis n \in \naturals: n:nstd $
 - External induction: Induction  over \std{n} about \pext{A}: \\ 
    $ [ \pext{A}(0) \land \forall \std{n} \in \naturals: \pext{A}(n) \then \pext{A}(n+1) ] \then \forall \std{n} \in \naturals: \pext{A}(n)$
 - Internal induction: Induction over \pnstd{n} about A: \\
    $ [A(0) \land \forall \pnstd{n} \in \naturals: A(n) \then A(n+1)] \then \forall n \in \naturals: A(n) $

The rationale over the two induction-axioms is simple. Ordinary induction is about $A$ over \std{n}. 
External induction is about \pext{A} over \std{n}. This makes sure that statements about external stuff only apply to finite $n$, not to infinite ones. 
Internal induction is about $A$ over \pnstd{n}. This makes sure that when we talk about potentially infinite $n$'s, we only apply internal statements.

In other words: these two inductions ensure that we **never apply external statements to external numbers**. 

Doing so would lead to logical inconsistencies. That's why there is no "fully external" induction.

However, note that axiom 2 is actually a case of "fully external" induction.


> **Theorem**
> $\forall n \in \naturals: n:nst \then (n+1):nst$ <a id="addingNonstds"></a>
>
> Suppose $n:nst$. Proof that $(n+1):nst$
>> By contradiction. Suppose $(n+1):std$. Proof that this leads to a contradiction.
>>> $(n+1):std \then n:std$.
>>>
>>> This contradicts the premise that $n:nst$.


If you don't believe the argument in the previous proof, consider this: 

> Suppose all of the following:
> $$ [\forall n: Q(n) \then Q(n+1)] \then \forall n: Q(n) $$
> $$ [\forall n: Q(n) \then Q(n+1)] $$
> This leads to $\forall n: Q(n)$
>> Proof that $\forall n: Q(n+1) \then Q(n)$
>>
>> Let $n = n_0$ and suppose $Q(n_0+1)$. Proof that $Q(n_0)$
>>> Since $ \forall n: Q(n) $ holds, it must be true that $Q(n_0)$.



We can use [theorem](addingNonstds) to prove the following: 

> **Theorem**
> $\forall n, m \in \naturals: n:std \land m:nstd \then (n+m):nst$
>
> Let $m=m_0:nst$. Proof that $\forall n \in \naturals: n:std  \then (n+m_0):nst$
>
> By induction on $n$
>
> Base case. Let $n=0$. Proof that $(0+m_0):nst$
>> $0+m_0=m_0$
>>
>> $m_0:nst$
>
> Induction step. Proof that $[(n+m_0):nst] \then [(n+1+m_0):nst]$
>> Just apply [theorem](addingNonstds) to $n=(n+m_0)$.


It is notable that you can never reach a standard number when adding nonstandard numbers.
> **Theorem**
> $\forall n,m \in \naturals: n,m:nst \then (n+m):nst$
>
> We proceed by proving the equivalent $(n+m):std \then (n:std \lor m:std)$
>
> Suppose $(n+m):std$}{$(n:std \lor m:std)$
>> Without loss of generality, suppose $n:nst$ Proof that $m:std$
>>
>> By contradiction. Suppose $m:nst$. Proof that this leads to a contradiction.
>>> We have already assumed that  $(n+m):std$.
>>>
>>> Now, however, we also assume that $n,m:nst$.
>>>
>>> Using [theorem](addingNonstds) however, we see that when $n,m:nst$, then it must be that $(n+m):nst$.



## Limits

## Sequences and series

### Tailor
### Fourier
### Laplace

\subsection{Euler's formula}
Proof: Consider the function $f(t)=e^{-it}(cost+isint)$ for $t \in \reals$. By the quotient rule
$$ f'(t) = e^{-it} (i\ cos(t) - \sin(t)) -ie^{-it} (\cos(t) + i \sin(t)) = 0 $$
identically for all $t \in \reals$. Hence, $f$ is constant everywhere. Since $f(0)=1$, it follows that $f(t)=1$ identically. Therefore, $e^{it}=cost+isint$ for all $t \in \reals$, as claimed.


# Integration

The infinitessimal view of calculus makes it quite easy to prove theorems. Consider this illustration of how definite integrals work.

$$
    \begin{aligned}
        \int_a^b \frac{dF}{dx}(x) dx &= \int_a^b \frac{F(x + dx) - F(x)}{dx} dx \\
        \int_a^b F(x + dx) - \int_a^b F(x) &= F(b + dx) - F(a)
    \end{aligned}
$$


### Integration strategies

**u-substitution**

**Integration by parts** is the last trick up our sleave when all other strategies haven't helped. Consider the integral 

$$ \int x e^x \diff{x} $$

We can rewrite this integral as 

$$ \int u \diff{v} $$

where $u = x$ and $\diff{v} = e^x \diff{x}$. In general, you always want to pick $u$ in such a way that $u$ gets simpler after being differentiated.
$x$ does get a lot simpler after differentiation, whereas $e^x$ doesn't, so the choice is clear. 

We then use the following: 

$$ \int u \diff{v} = uv - \int v \diff{u} $$\footnote{The proof goes like this: Starting with the product rule of differentiation: $(ab)' = a'b + ba'$ we get $(ab)' - a'b = ba'$ and  $ab - \int a'b \diff{x} = \int ba' \diff{x} $}

Since we chose $u = x$ we have $\diff{u} = \diff{x}$, and from $\diff{v} = e^x \diff{x}$ we get $v = e^x$. This yields us: 

$$ xe^x - \int e^x \diff{x} $$
$$ e^x ( x - 1) $$

as the solution. 

## Vector calculus

Integration over a vector, integration along a vector, integration along a surface. 

You can find a nice introduction (mostly in the second part of) this pdf: \inlinecode{http://www.maths.gla.ac.uk/~cc/2A/2A_notes/2A_chap4.pdf} and here `http://geocalc.clas.asu.edu/pdf-preAdobe8/SIMP_CAL.pdf`


### Constraint optimization using Lagrange multipliers

We want to maximize $f(x, y)$ subject to the constraint $g(x, y) = 0$.
At the optimal point $x_0, y_0$ it must hold that:
$$
  \nabla f = \lambda \nabla g
$$
for some scalar $\lambda$ (the so-called Lagrange-multiplier).

Example:
$$ f(x, y) = x^2 y $$
$$ g(x, y) = x^2 + y^2 = 1 $$

Now using $\nabla f = \lambda \nabla g$ we get the system of equations:
$$
    \begin{aligned}
        2xy &= 2x\lambda \\
        x^2 &= 2y\lambda \\
        x^2 + y^2 &= 1
    \end{aligned}
$$

Which yields $x = \sqrt{2/3}$, $y = \sqrt{1/3}$ and $\lambda = \sqrt{1/3}$.
