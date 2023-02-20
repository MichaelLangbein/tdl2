# General calculus

# Derivative and differential
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

## Product rule for gradients
