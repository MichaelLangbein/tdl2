# General calculus

# Derivative and differential
Let $X$ and $Y$ be normed vector-spaces.
If $f$ is a function $f: X \to Y$ then its derivative $f'$ is a function $f': X \to Y$ such that: 

$$ \lim_{\delta \to 0} \frac{| f(x + \delta) - f(x) - f'(\delta) |}{|\delta|} = 0 $$

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


