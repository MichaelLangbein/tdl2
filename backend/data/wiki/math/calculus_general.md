# General calculus

All of this as layed out in [calculus on manifolds by Michael Spivak](http://www.strangebeautiful.com/other-texts/spivak-calc-manifolds.pdf).
I think one of the best applied books on my level may be [d2l.ai](http://www.d2l.ai/chapter_appendix-mathematics-for-deep-learning/multivariable-calculus.html#multivariate-chain-rule)




## Notation
- $f$: a function
- $f: U \to V$: a function's signature
- $f(x, y) = x^2 - 3y$ a functions body.
- $f(x)$ a function handle, not applied to a concrete input yet.
- $f(x_0)$ a function applied to a concrete input. If $f: U \to V$, then $f(x_0) \in V$, *not* function valued. Spivak likes to use $a$ instead of $x_0$ for concrete values.
- $\lambda_x$ a function of $x$, $\lambda_{x_0}$ the return value of that function applied to a concrete value $x_0$.





# Derivative



## For scalar valued functions
$f: U \to \Reals$ is *differentiable* at $x_0 \in U$ iff there is a *number* $f'(x_0)$ such that:
$$\lim_{\Delta \to 0} \frac{f(x_0 + \Delta) - f(x_0)}{\Delta} = f'(x_0)$$
Note how $f'(x_0)$ is just a number. If such a number exists for every $x \in U$, then $f'$ is a function,
and we get the derivative at any $x$ by applying that function to $x$. Then it holds that 
$$f': U \to \Reals$$



## Generally 
$f: U \to V$ is *differentiable* at $x_0$ iff $\exists \lambda_{x_0} \in L(U, V)$ (that is, $\lambda_{x_0}$ is a linear map from $U \to V$) such that:
$$ \lim_{\Delta \to 0} \frac{|f(x_0 + \Delta) - f(x_0) - \lambda_{x_0}(\Delta)|}{|\Delta|} = 0 $$

We call $\lambda_{x_0}$ the **differential** $Df(x_0)$ at $x_0$.

If there is such a $\lambda_x$ for any $x \in U$, then 
$$ \lambda_x = Df(x) \text{ which has the signature } U \to L(U, V)$$

Note that we stated $\lambda_{x_0} \in L(U, V)$, i.e. that $\lambda$ at a particular $x_0$ is a linear map. However, that does *not* mean that $\lambda_x$ is linear ... only that $\lambda_{x_0}$ is. $\lambda_x$ is a higher level function that returns elements of $L(U, V)$, $\lambda_{x_0}$ *is* an element of $L(U,V)$, and $\lambda_{x_0}$ applied to some $\Delta \in U$ is an element of $V$: $\lambda_{x_0} (\Delta) = v \in V$.

For clarity, let's call the point $x_0 \in U$ where we have obtained $Df(x_0)$ the *derivation-point*, and the point $\Delta \in U$ which is fed into $Df(x_0)$ the *application-point*. $Df$ may be non-linear in the derivation-point, but once calculated for the derivation-point that result will be linear in the application-point.

### Example
Consider $f(x, y) = sin(x)$. Spivak proves that $Df(x_0, y_0) = cos(x_0) \cdot x$. 
Note how $Df(x, y)$ (a function) is non-linear in the derivation-point, but how $Df(x_0, y_0)$ (a function's output) is linear in the application-point.





## Theorems



### Matrix representation
If $U, V$ are both finite and have a basis, then $Df(x_0)$ can be expressed as a matrix with dimensions $|V| \times |U|$.



### $\lambda_x$ is unique



### Chain rule
If $f: \Reals^n \to \Reals^m$ is differentiable at $x_0$ and $g: \Reals^m \to \Reals^p$ is differentiable at $x_0$, then the composition $(g \circ f): \Reals^n \to \Reals^p$ with $(g \circ f)(x) := g(f(x))$ is differentiable at $x_0$ and 
$$ D(g \circ f)(x_0) = Dg(f(x_0)) \circ Df(x_0)$$ 



### Product rule
(from [math-overflow](https://math.stackexchange.com/questions/366922/product-rule-for-matrix-functions) ... but also [maybe there is no good solution](https://math.stackexchange.com/questions/3123856/derivative-w-r-t-x-of-matrix-product-axbx?rq=1))



## Partial derivatives
$f: \Reals^n \to \Reals$ then the partial derivative is defined as:
$$ D_if(x_0) := \lim_{\Delta \to 0}\frac{f(x_{0, 1}, x_{0, 2}, ...x_{0, i} + \Delta, ...) - f(x_{0, 1}, x_{0, 2}, ...x_{0, i}, ...)}{\Delta}$$
... that is, $D_if(x_0)$ is just an ordinary 1-d-derivative.




## Partial derivatives as a simple means to calculate the full derivative
If $f: \Reals^n \to \Reals^m$ is differentiable at $x_0$ (that is, if $Df(x_0)$ exists at $x_0$), then $D_if_j(x_0)$ exists for all $i, j$ and they relate like so:
$$ Df(x_0) = \begin{bmatrix}
    ... &             & ... \\
        & D_cf_r(x_0) &     \\
    ... &             & ... \\
\end{bmatrix} $$

The inverse is only true if all $D_if_j(x_0)$ are also continuous at $x_0$. Then:
If all $D_if_j(x_0)$ exist *and* are continuous at $x_0$, then $Df(x_0)$ exists and they relate as above.


## Gradients
\nabla f(x_0)
$$\nabla f(x_0) = [Df(x_0)]^T$$










<!-- # Derivative and differential
Let $X$ and $Y$ be normed vector-spaces.
If $f$ is a function $f: X \to Y$ then its derivative $f'$ is a function $f': X \to Y$ such that: 

$$ \lim_{\delta \to 0} \frac{| f(x + \delta) - f(x) - f'(\delta) |_Y}{|\delta|_X} = 0 $$

Where $||_X$ is the norm in the normed vector-space $X$.

This is the [Fréchet derivative](https://en.wikipedia.org/wiki/Fr%C3%A9chet_derivative), a somewhat more general definition of derivatives that works for objects of any dimension.

## Applied to matrices
Let $A$ be a matrix that depends on $X$: $A = f(X)$.

### Concrete implementation and dimensions
The derivative of a matrix $A$ by a matrix $X$ is implemented as follows:
- Take the matrix $A$
- Consider each element $a_{r, c}$ indivually
- Replace $a_{r, c}$ with the matrix $[ \frac{\partial a_{r, c}}{\partial x_{rx, cx}} ]_{cx, rx}$
- Note how the dimensions of $X$ are being flipped: $a_{r, c}$ is differentiated by $X^T$, not $X$.

This way, if $A$ has dimensions $l, m, n$ and $X$ has dimensions $u, v$, $A'$ has dimensions $l, m, n, v, u$.

Also note how $f'|_x =A'X$ has dimensions $l, m, n$ again.


# Product rule
Let $f: X \to Y$ and $g: X \to Z$.

Let $h: Y \times Z \to W$ and let $h$ be bi-linear.

Then for all $x \in X$:
$$ h'|_x = h(f'|_x, g) + h(f, g'|_x) $$


### Tangent: what the product rule is *not*
<font size="1">
Note how we're being careful to add the '$|_x$' notion here. The product rule does not generally hold in the form $h' = h(f', g) + h(f, g')$. A counter example would be matrices. Let $C = AB$:

$$ C' \neq A'B + AB' $$

This cannot hold because (as well see in the next section) $A'$ has dimensions $a, b, v, u$ and $B$ has $b, c$ ... so a matrix product between these two isn't even defined.
</font>

## Applied to scalar-valued functions and h=product
In the most common case, $h$ is a product function: $h(f, g) = f \times g$.
Then we get: 

$$ (fg)'|_x = f'|_xg + fg'|_x $$

## Applied to matrices
Let $C = AB$.

Let $A = FX$. Let $B = GX$.

$$ C'X = A'XB + AB'X $$

### Dimensions
In the above example, let's say $A$ has dimensions $(a, b)$, $B$ has dimensions $(b, c)$, and $X$ has dimensions $(u, v)$.

Then $f(X): \mathscr{X} \to \mathscr{A}$ can be represented as $F$ of dimensions $(a, b, v, u)$.
With that, since a derivative $f'$ is a function with the same dimensions as $f$, $A'$ has dimensions $(a, b, v, u)$, too.

$g(X): \mathscr{X} \to \mathscr{B}$ can be represented as $G$ of dimensions $(b, c, v, u)$.
$G'$ has dimensions $(b, c, v, u)$, just like $G$.


# Gradient
The gradient is something different than the derivative.
Usually, gradients are only defined on functions that map to $\Reals$.
- $ f: X \to \Reals $
- $ f': X \to \Reals $ must have the same signature as $f$ by the definition of Fréchet derivatives.
- $ \nabla f: X \to X $

The gradient is defined as:

$$ \nabla f |_{x_0} := \left[  \frac{\partial f}{\partial x_{r, c, ...}}|_{x_0}  \right]_{r, c, ...}$$

There is some generalization possible, though.
$$ f: \Reals^n \to \Reals^m $$
$$ \text{Derivative: } f': \Reals^n \to \Reals^m $$
$$ \text{Gradient: } \nabla f: \Reals^n \to \Reals^{n*m}$$

## Gradient descent

$$ x_1 = x_0 - \alpha \nabla f |_{x_0} $$

Gradient descent works with the gradient, not the derivative, because evaluating the derivative at $x_0$ would yield $y' \in Y \neq X$.

If $f: \Reals^2 \to \Reals$, where the input is the flat ground-plane in a 3d-coordinate system and the output is a surface's height, the gradient is a vector that strictly only lives on the ground-plane.



## Chain rule for gradients
$$ f: \Reals^3 \to \Reals $$
$$ f(x) = g(h(x)) $$
$$ g: \Reals^2 \to \Reals $$
$$ f: \Reals^3 \to \Reals^2 $$
$$ \underbrace{\nabla_x f}_3: (\underbrace{\nabla_h g}_{2}) @ (\underbrace{\nabla_x h}_{2 \times 3}) $$
Where @ symbolizes a matrix multiplication.

Here, $\nabla_x h$ is defined as: 

$$ \nabla_x h = 
\begin{bmatrix}
    \frac{\partial h_1}{\partial x_1} && \frac{\partial h_1}{\partial x_2} && \frac{\partial h_1}{\partial x_3} \\
    \frac{\partial h_2}{\partial x_1} && \frac{\partial h_2}{\partial x_2} && \frac{\partial h_2}{\partial x_3} \\
\end{bmatrix}
$$
That is, take the shape of $h$ (2) and for each element in there, put in a shape of $x$ (3).

Note how we've re-written $\nabla_x f$ as a matrix-expression. This is not to be confused with the fact that linear functions can be represented with matrices - this chain-rule also holds for non-linear functions.
In the same vein, applying $x$ to $\nabla_x h$ is **not** a matrix-multiplication, even though the dimensions would check out:

$$ 
\nabla_x h(x) = 
\begin{bmatrix}
    \frac{\partial h_1}{\partial x_1}(x) && \frac{\partial h_1}{\partial x_2}(x) && \frac{\partial h_1}{\partial x_3}(x) \\
    \frac{\partial h_2}{\partial x_1}(x) && \frac{\partial h_2}{\partial x_2}(x) && \frac{\partial h_2}{\partial x_3}(x) \\
\end{bmatrix}
\neq 
\nabla_x h @ x
$$

## Product rule for gradients -->
