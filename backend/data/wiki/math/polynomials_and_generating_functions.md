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

Getting an explicit form of that derivative:
$a_n = \frac{2^{-n-1} [2(1 + \sqrt{5})^n - 2(1-\sqrt{5})^n] }{\sqrt(5)}$

In code: 
```python
import math as m

def fib(n):
    a = 2**(-n-1)
    b = (1 + m.sqrt(5))**n
    c = (1 - m.sqrt(5))**n
    d = m.sqrt(5)
    return a * (2*b - 2*c) / d
```


## Addition

## Multiplication
$$\sum_{i=0}^\infty a_i \sum_{i=0}^\infty b_i = \sum_{m=0}^\infty x^m \sum_{i=0}^m a_i b_{m-i}$$

## Shift

## Derivative

## When it doesn't apply:

## When it's just too complicated:


## Applications

- Programming: finding closed-form expressions for recurrence-relations
- Statistics: finding closed-form expressions for recurrent combinations
- From [stackexchange](https://math.stackexchange.com/questions/25430/why-are-generating-functions-useful): Closed form formulas are overrated. When they exist, generating function techniques can often help you find them; when they don't, the generating function is the next best thing, and it turns out to be much more powerful than it looks at first glance. For example, most generating functions are actually meromorphic functions, and this means that one can deduce asymptotic information about a sequence from the locations of the poles of its generating function. This is, for example, how one deduces the asymptotic of the partition numbers.