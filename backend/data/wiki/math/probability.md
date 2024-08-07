# Probability

# Basics

## Probability space

Probability works on some basic entities:

-   $\Omega$ is a nonempty set called the sample-space.
-   $\omega \in \Omega$ is called an outcome
-   $E \subseteq \Omega$ is called an event

> **Definition** [Probability]
> Probability is a measure on \Omega. It is a total function $\text{Pr}: \Omega \to \reals$ such that:
>
> -   $\forall \omega \in \Omega : \text{Pr}[\omega] \geq 0$
> -   $\sum\_{\omega \in \Omega} \text{Pr}[\omega] = 1$

A probability measure together with a sample-space is called a probability space.

We define the probability of an event as:
$$\text{Pr}[E] = \sum_{\omega \in E} \text{Pr}[\omega]$$

> **Definition** [Random variable]
> A random variable is a function mapping a $\omega$ from $\Omega$ to the reals.
> $$ X(\omega) : \Omega \to \reals$$

Note that a random variable strictly takes a single $\omega$ as argument, not a set of outcomes.

We then calculate the probability that a random variable $X$ has a certain value $x$ as such:

$$\text{Pr}[X=x] = \sum_{X^{-1}(x)} \text{Pr}[\omega]$$

**From sample-space to probability of a random variable**
<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/prob.png">

> **Definition** [Expectation]
> The expectation of a random variable is defined as
> $$ E[X] = \sum\_\Omega X(\omega)P(\omega)$$

> **Definition** [Conditional Probability]
> $$ \text{Pr}[A | B] = \frac{\text{Pr}[A \cap B]}{\text{Pr}[B]}$$

> As a nice little exercise, we prove the formula for the conditional probability of the _complement_ of $B$.
> $$ \text{Pr}[A | \overline{B}] = $$

As an illustrative example, consider the following probabilities. People can be _small_ (S) or _tall_ (T). They can be _good_ (G) or _bad_ (B) at basketball.
Here are the tables of probabilities:

|       |      |     |       | **S** | **T** |
| ----- | ---- | --- | ----- | ----- | ----- |
|       |      |     |       | 0.6   | 0.4   |
|       |      |     |       |       |       |
|       |      |     |       | **S** | **T** |
| **B** | 0.14 |     | **B** | 0.54  | 0.08  |
| **G** | 0.86 |     | **G** | 0.6   | 0.32  |

|           |     |           |     |
| --------- | --- | --------- | --- |
| $P(B\|S)$ | 0.9 | $P(B\|T)$ | 0.8 |
| $P(G\|S)$ | 0.1 | $P(G\|T)$ | 0.2 |

Notice the following facts:

-   notice how $P(G|T) \neq 1 - P(G|S)$
-   notice how $P(G|T) = 1 - P(B|T)$
-   $P(A, B) = P(A|B) P(B) = P(B|A) P(A)$
-   $ \Sigma_A \Sigma_B P(A, B) = 1.0 $

> As yet another exercise, here is the formula of the probability of a union of arbitrary events:
>
> $$\begin{aligned}\text{Pr} (\cup A_i) &= \sum_i \text{Pr}(A_i) \\ &- \sum_i \sum_{j>i} \text{Pr}(A_i \cap A_j) \\ &+ \sum_i \sum_{j>i} \sum_{k>j} \text{Pr}(A_i \cap A_j \cap A_k) \\ &- ... \end{aligned}$$
> This is proven by induction.
>
> > Base case:
> > $\text{Pr}(A_1 \cup A_2) = \text{Pr}(A_1) + \text{Pr}(A_2) - \text{Pr}(A_1 \cap A_2)$
> > This is trivially true when looking at a Venn diagram.
>
> > Induction step. Suppose that...

## A few lemmas on conditional probability <a id="condPropLemmas"></a>

In a "causal" chain of events $A, B, C$ we can integrate out the middle-event $B$.

$$

    \begin{aligned}
        p(A, B, C)  &= \frac{p(A, B, C)}{p(A, B)} \frac{p(A, B)}{p(A)} p(A) \\
                    &= p(C|AB) p(B|A) p(A) \\
    \end{aligned}


$$

$$

    p(A, C) = \Sigma_B p(A, B, C)


$$

$$

    \begin{aligned}
            p(C | A) &= \frac{p(A, C)}{p(A)} \\
                     &= \Sigma_B p(C|A, B) p(B|A)
    \end{aligned}


$$

We can take the expression for conditional probability and condition _every term_ on a third event.

$$

    \begin{aligned}
        p(B|A, C) &= \frac{p(A, B, C)}{p(A, C)} \\
        p(A|B, C) &= \frac{p(A, B, C)}{p(B, C)} \\
        p(A|B, C) &= \frac{p(B|A, C) p(A|C) p(C)}{p(B|C)p(C)} \\
                  &= \frac{p(B|A, C) p(A|C)}{p(B|C)} \\
    \end{aligned}


$$

## Decomposing variance - the road to sensitivity analysis

**Expressing variance as expectation** ...

$$

    \begin{aligned}
        V_X &= E_{ (X - E_X)^2 } \\
            &= E_{ X^2 - 2 X E_X + E_X^2 } \\
            &= E_{X^2} - E_X^2
    \end{aligned}


$$

**Conditional expectation and variance** ...

> **Definition** <a id="conditionalExpectation"></a>
> Conditional expectation:
> $$ E\_{Y|x} = \Sigma y P(y|x) $$

> **Definition** <a id="conditionalVariance"></a>
> Conditional variance:
> $$ V*{Y|x} = E*{(Y - E\_{Y|x})^2 | x} $$

**Law of total expectation** ... <a id="lawOfTotalExpectation"></a>

$$

    \begin{aligned}
        E_Y &= \Sigma_Y y P(y) \\
            &= \Sigma_Y y \Sigma_X P(y|x) P(x) \\
            &= \Sigma_X (\Sigma_Y y P(y|x)) P(x) \\
            &= \Sigma_X E_{Y|x} P(x) \\
            &= E_{E_{Y|x}}
    \end{aligned}


$$

**Law of total variance** ...<a id="lawOfTotalVariance"></a>

$$

    \begin{aligned}
        V_Y &= E_{Y^2} - E_Y^2 \\
            &= E_{E_{Y^2 | X}} - E^2_{E_{Y|X}} \\
            &= E_{  V_{Y|X} + E^2_{Y|X}  } - E^2_{E_{Y|X}} \\
            &= E_{V_{Y|X}} + E_{E^2_{Y|X}} - E^2_{E_{Y|X}} \\
            &= E_{V_{Y|X}} + V_{E_{Y|X}}
    \end{aligned}
$$

**Illustration of the law of total variance**
<img width="50%" src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/law_of_total_variance.jpg">

**Bias/variance tradeoff**:
https://en.wikipedia.org/wiki/Bias%E2%80%93variance_tradeoff

# Probability density functions

Up to now we have been dealing with probability mass functions on discrete variables.
That works just as well with discrete variables, but we need to accommodate some details.
For example, we can only define probability density in therms of cumulative probability functions.

Let $P(x) := Pr(X > x)$ be a cumulative probability function.
Then the probability density at $x$ is $\frac{d P}{d x}(x)$.

### As an exercise, consider $x \tilde Exp(x)$. We want to calculate $E(x | x > x_0)$.

We'll start with $P(x | x > x_0)$.
We have:

$$

    \begin{aligned}
        P(X | X > x_0) &= \left( \text{ using the fact that } P(B|A) = \frac{P(A \land B)}{P(A)} \right) \\
                          &= \frac{ P(X = x \land X > x_0) }{ P(X > x_0) } \\
                          &= \frac{ s_{x_0} P(X=x) }{ P(x > x_0) }  (\text{ with $s_{x_0}$ the step-function at $x_0$}) \\
                          &= \frac{ s_{x_0} P(X=x) }{ \int_{x_0}^\infty p(x) dx }
    \end{aligned}


$$

This leads us to the expectation:

$$

    \begin{aligned}
        E(X | X > x_0)  &= \int_{-\infty}^\infty x p(X | X > x_0) dx \\
                        &= \frac{ s_{x_0} \int_{-\infty}^\infty x p(x) dx }{ \int_{x_0}^\infty p(x) dx } \\
                        &= \frac{ \int_{x_0}^\infty x p(x) dx }{ \int_{x_0}^\infty p(x) dx } \\
                        &= \frac{ s_{x_0} E(X) }{ P(X > x_0) }
    \end{aligned}


$$

# Probability distributions

A probability distribution is a function from the domain of a random variable to its probability - in other words, a probability distribution yields the probability that a random variable will take on a certain value.

There is an abundance of ready made probability distributions to chose from, covering virtually all important situations. But care must be taken when deciding which distribution to apply to a certain problem.

**The Bernoulli family** based on modelling a series of coin-tosses.

-   Bernoulli: heads or tails?
-   Binominal: k heads in n trials
-   Poisson: k heads in $\infty$ trials.

A remarkable feature of the Poisson-distribution is that it has only a parameter for the mean, but always the same variance.

**The geometric family** based on repeating an experiment until it succeeds.

## Probabilistic fallacies

-   T-Test interpretation: If $\text{Pr}[A|B] = x$, then this does _not_ mean that $\text{Pr}[A|\overline{B}] = 1 - x$.
-   Prosecutors fallacy aka. inverse fallacy: $P(A|B) \neq P(B|A)$

> $\text{Pr}[A|\overline{B}] \neq 1 - \text{Pr}[A | B]$
>
> By contradiction.
>
> >

$$

> >     \begin{aligned}
> >        \text{Pr}[A|B]                 &= 1 - \text{Pr}[A | \overline{B}] \\
> >                                        &= \frac{  \text{Pr}[B] - \text{Pr}[A \cap \overline{B}]  }{  \text{Pr}[B]  }  \\
> >        \text{Pr}[A|B] \text{Pr}[B]   &=         \text{Pr}[B] - \text{Pr}[A \cap \overline{B}] \\
> >        \text{Pr}[A \cap B]   &= \text{Pr}[B] - \text{Pr}[A \cap \overline{B}] \\
> >        \text{Pr}[A \cap B] + \text{Pr}[A \cap \overline{B}]  &= \text{Pr}[B] \\
> >        \text{Pr}[A] &= \text{Pr}[B]
> >     \end{aligned}
> >
> >
$$

> > Thus $\text{Pr}[A|\overline{B}] \neq 1 - \text{Pr}[A | B]$.
> > $$
>
> But not that it _does_ hold true that $\text{Pr}[\overline{A}|B] = 1 - \text{Pr}[A | B]$

# Relation between data-size and estimation-quality

## Cramer-Rao bound

https://en.wikipedia.org/wiki/Cram%C3%A9r%E2%80%93Rao_bound#Scalar_unbiased_case

-   Variable to estimate: $\theta$, a fixed scalar
-   Unbiased estimator $\hat{\theta}$
-   $n$ observations of $x$, which is a random variable distributed according to $f(x|\theta)$
    $$\var{\hat{\theta}} \geq \frac{1}{I(\theta)}$$
    With $I$ the Fisher information:
    $$I(\theta) = n   E  \left[ \left(\frac{\partial log(f(x|\theta))}{\partial \theta}   \right)^2 \right]$$

Thus to cut the estimation-error by $u$, you'll need $u^2$ as many data-points.
It has been claimed that [this causes diminishing returns in training LLM's](https://spectrum.ieee.org/deep-learning-computational-cost).

```python
import numpy as np
import matplotlib.pyplot as plt

theta = 2.0      # value to estimate
stddev = 1.0     # natural measurement error

experiments = 50
nrSamples = 1024
errors = np.zeros((experiments, nrSamples))

# we repeat our experiment a few times
for e in range(experiments):
    # estimate theta using 1, 2, 3, ... 1024 observations
    for i in range(nrSamples):
        samples = np.random.normal(loc=theta, scale=stddev, size=i)
        thetaEstimated = np.mean(samples)
        error = np.abs(thetaEstimated - theta)
        errors[e, i] = error
meanErrors = np.mean(errors, axis=0)
meanErrors.shape


sampleLocations = [1, 3, 7, 15, 31, 63, 127, 255, 511, 1023]
sampledData = meanErrors[sampleLocations]
plt.plot(sampleLocations, sampledData)
```

## Fermi estimate

https://math.stackexchange.com/questions/3267041/proof-of-fermi-estimation-variance

The statement is a consequence of a well-known theorem in statistics stating that if $𝑋$ and $Y$ are independent random variables with variances $\sigma^2_X$ and $\sigma^2_Y$ respectively, then the variance of $𝑋+𝑌$ is $\sigma^2_X+\sigma^2_Y$. Therefore if $X_1,X_2,X_3,…,X_n$ are independent random variables each of which has variance $\sigma^2$, then the variance of $X_1+X_2+X_3+⋯+X_𝑛$ is $n\sigma^2$, and the standard deviation of the sum is $\sqrt{n\sigma^2} = \sqrt{n} \sigma$.

## Bias/variance tradeoff

https://en.wikipedia.org/wiki/Bias%E2%80%93variance_tradeoff

### Double descent
