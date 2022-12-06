# Generating functions

<small>Theoretically we can get closed form expressions for recursive functions using generating functions.
Often, however, those recursive functions are just too complicated. </small>


- Convert series $a_0, a_1, a_2, ...$ to generating function $g(x) = a_0 + a_1 x + a_2 x^2 + ...$
- Find an explicit expression fo $g(x)$ (i.e. one that does not contain any $a_i$)
    - Usually that is done by converting $g(x) = expr(a_n)$ to $g(x) = expr(g(x))$
        - using: polynomal addition,
        - ... mulitplication/convolution,
        - ... shift,
        - ... derivatives
- $a_n = \frac{(d/dx)^n g | 0}{n!}$

## Example: 

Fibonacci. $a_0 = 0, a_1 = 1$ and recurrence-relation $a_n = a_{n-1} + a_{n-2}$.

Generating function $g(x) = \sum_i a_i x^i = \sum_i (a_{i-i} + a_{i-2})x^i$

Making $g(x)$ independent of $a_i$:

$$
\begin{aligned}
g(x) &= \sum_i a_i x^i  &&                                                 &&                              \\
     &= a_0 + a_1 x     && +   \sum_{i=2..\infty} a_i x^i                  &&                              \\
     &= 0   + x         && +   \sum_{i=2..\infty} (a_{i-1} + a_{i-2}) x^i  &&                               \\
     &= x               && +   \sum_{i=2..\infty} a_{i-1} x^i              && +     \sum_{i=2..\infty} a_{i-2} x^i     \\
     &= x               && + x \sum_{i=2..\infty} a_{i-1} x^{i-1}          && + x^2 \sum_{i=2..\infty} a_{i-2} x^{i-2} \\
     &= x               && + x \sum_{i=1..\infty} a_{i} x^{i}              && + x^2 \sum_{i=0..\infty} a_{i} x^{i}     \\
     &= x               && + x g(x)                                        && + x^2 g(x)
\end{aligned}
$$

Solving $ g(x) = x + x g(x) + x^2 g(x)$ for $g$ yields 
$$g(x) = \frac{-x}{-1 + x + x^2}$$

Then $a_n = \frac{(d/dx)^n \frac{-x}{-1 + x + x^2} | 0}{n!} $


## Addition

## Multiplication

## Shift

## Derivative

## When it doesn't apply:

## When it's just too complicated: