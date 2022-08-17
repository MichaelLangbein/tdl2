# Probability


## Basic terms 

Basics
- Sample-space $\Omega$
- Outcome $\omega$
- $\forall \omega: Pr(\omega) \geq 0$
- $\Sigma_{\omega \in \Omega} Pr(\omega) = 1$

Events
- Event $A \subset \Omega$
- $P(A) = \Sigma_{\omega \in A} Pr(\omega)$

Random variables
- Random variable $X(\omega): \Omega \to \Reals$
  - Special event $X^{-1}(x_0)$: all $\omega$ where $X(\omega) = x_0$
- $P(X=x_0) = \Sigma_{X^{-1}(x_0)} Pr(\omega)$


<img src="../assets/programming/prob.png">


## Conditional probability

$P(B|A) = \frac{P(A \cap B)}{P(A)}$

From this we can derive:
- $P(B|A) \neq 1 - P(A|B)$
- $P(A, B) = P(A|B)P(B) = P(B|A)P(A)$
- $\Sigma_A \Sigma_B P(A, B) = 1$


Relating conditional probability for sets to conditional probability for random variables:
$$
P(X=x_0 | Y=y_0) \\
= \frac{P(X^{-1}(x_0) \cap Y^{-1}(y_0))}{P(Y^{-1}(y_0))} \\
= \frac{\Sigma_{\omega: X(\omega) = x_0 \land Y(\omega) = y_0} Pr(\omega)}{\Sigma_{\omega: X(\omega) = x_0 } Pr(\omega)}
$$



## Practical example: estimation using probability or regression
<img src="../assets/programming/prob_vs_reg.jpg">
