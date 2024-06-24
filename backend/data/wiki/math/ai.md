$
\gdef\partDiff#1#2{\frac{\mathop{d#1}}{\mathop{d#2}}}
$

# Thoughts on AI

- LLMs understand how to arrange words
  - surprisingly, they have some internal understanding of logic and math
  - but it doesn't have a dedicated mechanism for creativity,
    - even though combining different domains together with constraints can yield quite creative answers.
- You can't beat centralized AI with more centralized AI:
  - AI that operates robots which interact with a complex environment is likely to evolve fast
  - maybe faster and in a different direction than centralized prompt-AI
- Even if current AI doesn't get much smarter, it can still penetrate much deeper:
  - games
  - apps
  - mobile os
  - excel
  -

# Human cognition

- lizard brain
  - gives will to live
  - gives aesthetic feeling
  - machines don't have that
- behavioral brain
  - learnt behavior
  - like sports-movements, riding a bike, ...
  - makes frustrated if response to action is not as expected
  - that's what backprop-deep-learning does.
- conscious brain
  - requires memory
  - gives step-by-step, slow, logic reasoning
  - gives thinking back to past events and analyzing them
  - machines don't have that
  - Humans without memory have trouble learning new things through reasoning, but can learn through much repetition on the _behavioral brain_ level

# Machine learning

## Neural networks

### Back-propagation

The analytical way of deriving the back-propagation algorithm consist of just a few steps.
A few definitions:

- A layers output-vector $\vec{y}^l$ is obtained by the activation function $\vec{y}^l = f(\vec{x}^l)$
- The layers input-vector is obtained as a weighted sum of previous outputs: $\vec{x}^l = \mathbf{W}^l \vec{y}^{l-1}$. We can express a single $x_t^l = \sum_f W_{t,f}^l y_f^{l-1}$
- We strive to minimize the error-function. Assuming only one single training item we get $e = \frac{1}{2} \sum_t (\vec{y}^*_t - \vec{y}^L_t)^2 = \frac{1}{2} (\vec{y}^* - \vec{y}^L) \odot (\vec{y}^* - \vec{y}^L)$

Let's first consider only the top layer.

$$
\begin{aligned}
    \frac{\mathop{d}e}{\mathop{d}x_{t_0}^L} &= \frac{1}{2} \sum_t \frac{\mathop{d}}{\mathop{d}x_{t_0}^L} (\vec{y}^*_t - \vec{y}^L_t)^2  \\
                            &= (y_{t_0}^* - y_{t_0}^L) f'(x_{t_0})
\end{aligned}
$$

Or, in vector form:

$$
\frac{\mathop{d}e}{\mathop{d}\vec{x}^L} = (\vec{y}^* - \vec{y}^L)^T \odot f'(\vec{x}^L)
$$

That part was easy. But how do we obtain the same differential for _any_ layer $l$?

$$
\begin{aligned}
\frac{\mathop{d}e}{\mathop{d}x_{f_0}^l} &= \sum_t \frac{\mathop{d}e}{\mathop{d}x_t^{l+1}} \frac{\mathop{d}x_t^{l+1}}{\mathop{d}x_{f_0}^l}  \\
                        &= \sum_t \partDiff{e}{x_t^{l+1}} \partDiff{}{x_{f_0}^l} ( \sum_f W_{t,f}^{l+1} y_f^l ) \\
                        &= \sum_t \partDiff{e}{x_t^{l+1}} W_{t,f_0}^{l+1} f'(x_{f_0}^l)
\end{aligned}
$$

Or, in vector form:

$$\partDiff{e}{\vec{x}^l} = ( \partDiff{e}{\vec{x}^{l+1}} \mathbf{W}^{l+1} ) \odot f'(\vec{x}^l)$$

The smart part here was to not derive $ \partDiff{e}{\vec{x}^l} $ by going through $\vec{y}^L$, $\vec{x}^L$, $\mathbf{W}^L$, $\vec{y}^{L-1}$, $\vec{x}^{L-1}$, $\mathbf{W}^{L-1}$, ..., but by instead creating a recurrence relation by differentiating by $\vec{x}^{l+1}$.

Finally, we can obtain the gradient at our weights as:

$$
\begin{aligned}
    \partDiff{e}{W_{t_0, f_0}^l} &= \partDiff{e}{x_{t_0}^l} \partDiff{x_{t_0}^l}{W_{t_0, f_0}^l} \\
                                 &= \partDiff{e}{x_{t_0}^l} \partDiff{}{W_{t_0, f_0}^l} ( \sum_f W_{t_0, f}^l y_f^{l-1} ) \\
                                 &= \partDiff{e}{x_{t_0}^l} y_{f_0}^{l-1}
\end{aligned}
$$

Or, in vector form:

$$\partDiff{e}{\mathbf{W}^l} = \left( \partDiff{e}{\vec{x}^l} \right)^T \left( \vec{y}^{l-1} \right)^T$$

So we should change the weights by:

$$
\begin{aligned}
    \Delta \mathbf{W}^l &= - \alpha \partDiff{e}{\mathbf{W}^l} \\
                      &= - \alpha \partDiff{e}{\vec{x}^l} \vec{y}^{l-1}
\end{aligned}
$$

It makes sense to reiterate the whole process in matrix-form.

First, we get $\delta^L$:
$$\partDiff{e}{\vec{y}^L} = (\vec{y}^\* - \vec{y}^L)^T := \delta^L$$

Then we go through the highest layer:
$$\partDiff{e}{\vec{x}^L} = \delta^L \odot f'(\vec{x}^L)$$
$$\partDiff{e}{\mathbf{W}^L} = \left( \partDiff{e}{\vec{x}^L} \right)^T \left( \vec{y}^{L-1} \right)^T$$
$$\delta^{L-1} = \partDiff{e}{\vec{x}^L} \mathbf{W}^L$$

Then we pass $\delta^{L-1}$ to the next layer.
$$\partDiff{e}{\vec{x}^l} = \delta^l \odot f'(\vec{x}^l)$$
$$\partDiff{e}{\mathbf{W}^l} = \left( \partDiff{e}{\vec{x}^l} \right)^T \left( \vec{y}^{l-1} \right)^T$$
$$\delta^{l-1} = \partDiff{e}{\vec{x}^l} \mathbf{W}^l$$

### Universal approximation

Let $f$ be a function mapping images to labels. $f$ stems from a vector space of functions $\mathscr{F}$. Let $B$ be a basis for $\mathscr{F}$, meaning that
$$\forall f \in \mathscr{F}: \exists \vec{\alpha}: \sum \alpha_n b_n = f$$
So far, so simple. This holds for any basis of any vector space. Let's just propose that sigmoid functions do constitute a basis for these image-to-label functions. We cannot prove this, since we don't know what the image-to-label functions look like, but notice the potential:
$ \sum \alpha_n b_n $ is then just the output of one layer of a neural net!

It turns out that sigmoid functions do indeed form a basis for any continuous function on $[0,1]^n$ (Note also that, while sigmoids do form a basis, they do not constitute an _orthogonal_ basis, meaning that we cannot obtain weights with the inner-product-trick. We couldn't have obtained them anyway, because for that trick we need the analytical form of $f$, which is generally not known to us.).

There is an important point that the universal approximation theorem does not cover, however. The UAT only deals with a single layer net. We know from practice, however, that a multilayer net can approximate functions with far less nodes than what a single-layer net would need. There is some strength to having multiple layers.

### Some data in n dimensions requires more than n neurons in a layer

The backpropagation algorithm requires a networks layers to transform its input data in a continuous fashion, i.e. distort the input surface without cutting it at any point. In topology, such a transformation is known as a homomorphism.

### Some functions can be better approximated with a deep net than with a shallow one

Consider the case of a hierarchical function.
$$f(x_1, x_2) = h_2( h_11(x_1), h_12(x_2))$$
We will prove that a deep net needs less neurons than a shallow one to approximate this function.

## Autodiff

Writing an autodiffer comes with a few tricks of the trade, without which such an implementation becomes very tricky.

1.  **Chain rule first**:
    The chain rule protects your nodes from having to calculate deep derivatives.
2.  **Pass $\nabla_{node}s$ = `grad_s_node` to `op.grad_s_v(v, at, grad_s_node)`**:
    So you can do the matrix-diff-trick
3.  **Only allow derivatives of scalar-valued functions**:
    On one hand this helps with the matrix trick; on the other this makes it simple to check the dimensions of gradients.

In detail.

#### 0. **The matrix trick**

It's hard to calculate
$$\frac{\partial MN}{\partial M}$$
For one, this requires tensor-calculus, and also this is an object of dimension $|MN| \times |M|$.

Not only is this hard, but such higher-dimensional matrices easily exceed even modern computers RAM.
But there is a trick: if there's a scalar-valued function $s$ _on top_ of $MN$, that complicated $\frac{\partial MN}{\partial M}$ reduces to $N^T$ - which is just two dimensional.

$$\frac{\partial s(MN)}{\partial M} = \frac{\partial s(MN)}{\partial MN} \frac{\partial MN}{\partial M} = \frac{\partial s(MN)}{\partial MN} N^T$$
$$\frac{\partial s(MN)}{\partial N} = \frac{\partial s(MN)}{\partial MN} \frac{\partial MN}{\partial N} = M^T \frac{\partial s(MN)}{\partial MN}$$
We don't need to bother with the case where $M$ or $N$ are functions of $x$, either, since we'll use the chain rule in which protects us from having to think about $M$ or $N$ being functions of other variables.

#### 1. **Chain rule first**

Calculating deep derivatives is hard. But the chain rule protects us from that:
$$\frac{\partial f(g(x))}{\partial x} = \frac{\partial f(g)}{\partial g} \frac{\partial g(x)}{\partial x}$$
Only the part $\frac{\partial f(g)}{\partial g}$ will be calculated by our nodes. And this expression is evaluated under the assumption, that $g$ is not function of any deeper variables.

#### 2. **Pass $\nabla_{node}s$ = `grad_s_node` to `op.grad_s_v(v, at, grad_s_node)`**

The matrix trick (0) only works if there is a scalar-valued function on top of the expressoin $MN$. That scalar-valued function's gradient $\nabla_{NM}s$ must be passed to $NM$`.grad_s_v` so that the expression $M^T \frac{\partial s}{\partial MN}$ can be evaluated at all.

#### 3. **Only allow derivatives of scalar-valued functions**

For one, that is a requirement for the matrix-trick. But also this makes checking the dimensions of our gradients trivial:

- we can be sure that $\nabla_{node}s$ = `grad_s_node` has the dimensions of `node.eval(at)`
- we can be sure that $\nabla_{v}s$ = `grad_s_v = node.grad_s_v(v, at, grad_s_node)` has the dimensions of `v.eval(at)`.

#### **Pseudocode**

```python
class Node:
    def grad_s_v(self, v, at, grad_s_node):
        if v in self.variables:
            grad_node_v = .... # shallow derivative
            grad_s_v = grad_s_node @ grad_node_v # chain-rule up to v
            return grad_s_v

# The idea here is to push grad_s_node further and further down the graph
def grad(node, x, at, grad_s_node):
    total = 0
    for v in node.variables:
        grad_s_v = op.grad_s_v(v, at, grad_s_node)   # chain-rule up to v, shallow part
        grad_s_x_partialv = grad(v, x, at, grad_s_v) # chain-rule deeper
        total += grad_s_x_partialv
    return total
```

#### **Implementation**

```python
import numpy as np
from helpers import eye, matMul, memoized


class Node():
    def eval(self, at):
        pass
    def grad_s_v(self, v, at, grad_s_node):
        """
            returns grad_s_v
            by calculating grad_s_node @ grad_node_v
            v must be a variable of the node;
            i.e. grad_node_v must be a shallow gradient.
            otherwise returns None
        """
        pass
    def getVariables(self):
        pass
    def __str__(self):
        pass
    def __repr__(self):
        return self.__str__()


class Constant(Node):
    def __init__(self, value):
        if not type(value) is np.ndarray:
            value = np.array(value)
        self.value = value

    def eval(self, at):
        return self.value

    def grad_s_v(self, v, at, grad_s_node):
        return np.zeros(grad_s_node.shape)

    def getVariables(self):
        return []

    def __str__(self):
        return f"{self.value}"


class Variable(Node):
    def __init__(self, name):
        self.name = name

    def eval(self, at):
        if self.name in at:
            return at[self.name]

    def grad_s_v(self, v, at, grad_s_node):
        if self == x:
            return grad_s_node

    def getVariables(self):
        return []

    def __str__(self):
        return f"{self.name}"


class Plus(Node):
    def __init__(self, a, b):
        self.a = a
        self.b = b

    def eval(self, at):
        return  eval(self.a, at) +  eval(self.b, at)

    def grad_s_v(self, v, at, grad_s_node):
        if v == self.a or v == self.b:
            return grad_s_node

    def getVariables(self):
        return [self.a, self.b]

    def __str__(self):
        return f"({self.a} + {self.b})"


class Minus(Node):
    def __init__(self, a, b):
        self.a = a
        self.b = b

    def eval(self, at):
        return eval(self.a, at) - eval(self.b, at)

    def grad_s_v(self, v, at, grad_s_node):
        if v == self.a:
            return grad_s_node
        if v == self.b:
            return -grad_s_node

    def getVariables(self):
        return [self.a, self.b]

    def __str__(self):
        return f"({self.a} - {self.b})"


class Mult(Node):
    def __init__(self, a, b):
        self.a = a
        self.b = b

    def eval(self, at):
        return eval(self.a, at) * eval(self.b, at)

    def grad_s_v(self, v, at, grad_s_node):
        if v == self.a:
            return grad_s_node @ eval(self.b, at)
        if v == self.b:
            return grad_s_node @ eval(self.a, at)

    def getVariables(self):
        return [self.a, self.b]

    def __str__(self):
        return f"({self.a} * {self.b})"


class Exp(Node):
    def __init__(self, a):
        self.a = a

    def eval(self, at):
        aV = eval(self.a, at)
        return np.exp(aV)

    def grad_s_v(self, v, at, grad_s_node):
        if v == self.a:
            aV = eval(self.a, at)
            grad_node_v = np.eye(len(aV)) * (aV * np.exp(aV))
            return grad_s_node @ grad_node_v

    def getVariables(self):
        return [self.a]

    def __str__(self):
        return f"exp({self.a})"


class MatMul(Node):
    def __init__(self, a, b):
        self.a = a
        self.b = b

    def eval(self, at):
        aV = eval(self.a, at)
        bV = eval(self.b, at)
        return aV @ bV

    def grad_s_v(self, v, at, grad_s_node):
        """
          Important:
          ----------

          this assumes that  this expression ` Node=A@B `
          is part of a larger expression ` f(Node) `, which is scalar valued.
          If that's the case, then

          `` df/dA = df/dNode * dNode/dA = df/dNode * B^T ``

          and

          `` df/dB = df/dNode * dNode/dB = A^T * df/dNode``

          https://mostafa-samir.github.io/auto-diff-pt2/
        """

        vVal = eval(v, at)
        if v == self.a:
            bV =  eval(self.b, at)
            (a, b, nrDims) = self.__reshape(vVal, grad_s_node, bV.T)
            return matMul(a, b, nrDims)
        if v == self.b:
            aV =  eval(self.a, at)
            (a, b, nrDims) = self.__reshape(vVal, aV.T, grad_s_node)
            return matMul(a, b, nrDims)

    def __reshape(self, target, a, b):
        resultShape = a.shape[:-1] + b.shape[1:]
        if resultShape == target.shape:
            return (a, b, 1)
        if len(resultShape) < len(target.shape):
            a = np.reshape(a, a.shape + (1,))
            b = np.reshape(b, (1,) + b.shape)
            return self.__reshape(target, a, b)


    def getVariables(self):
        return [self.a, self.b]

    def __str__(self):
        return f"({self.a} @ {self.b})"


class InnerSum(Node):
    def __init__(self, v):
        self.v = v

    def eval(self, at):
        vVal =  eval(self.v, at)
        return np.sum(vVal)

    def grad_s_v(self, v, at, grad_s_node):
        if v == self.v:
            vVal =  eval(self.v, at)
            grad_node_v = np.ones(vVal.shape)
            return grad_s_node * grad_node_v

    def getVariables(self):
        return [self.v]

    def __str__(self):
        return f"sum({self.v})"


class ScalarProd(Node):
    def __init__(self, scalar, a):
        self.a = a
        self.scalar = scalar

    def eval(self, at):
        aVal =  eval(self.a, at)
        aTimesS = aVal * self.scalar
        return aTimesS

    def grad_s_v(self, v, at, grad_s_node):
        if v == self.a:
            return self.scalar * grad_s_node

    def getVariables(self):
        return [self.a]

    def __str__(self):
        return f"({self.scalar} * {self.a})"


class ScalarPower(Node):
    def __init__(self, a, scalar):
        self.a = a
        self.scalar = scalar

    def eval(self, at):
        aVal =  eval(self.a, at)
        aPowS = np.power(aVal, self.scalar)
        return aPowS

    def grad_s_v(self, v, at, grad_s_node):
        if v == self.a:
            aVal =  eval(self.a, at)
            singleValues = self.scalar * np.power(aVal, self.scalar - 1)
            grad_node_x = np.eye(len(singleValues)) * singleValues
            return grad_s_node @ grad_node_x

    def getVariables(self):
        return [self.a]

    def __str__(self):
        return f"{self.a}^{self.scalar}"


def Sigmoid(x):
    minX = ScalarProd(-1, x)
    ex = Exp(minX)
    one = Constant(1)
    body = Plus(one, ex)
    sigm = ScalarPower(body, -1)
    return sigm

def Sse(observation, simulation):
    errors = Minus(observation, simulation)
    squaredErrors = ScalarPower(errors, 2)
    sse = InnerSum(squaredErrors)
    return sse


@memoized
def eval(op, at):
    return op.eval(at)


@memoized
def grad_s_x_through_op(op, x, at, grad_s_op):
    if op == x:
        return grad_s_op
    grad_s_x_total = 0
    for v in op.getVariables():
        grad_s_v = op.grad_s_v(v, at, grad_s_op)
        grad_s_x_total += grad_s_x_through_op(v, x, at, grad_s_v)
    return grad_s_x_total



def gradient(op, x, at):
    opV = op.eval(at)
    if opV.shape != ():
        raise Exception(f"Can only do gradients on scalar-valued expressions. This expression has shape {opV.shape}: {opV}")
    grad_op_x_Val = grad_s_x_through_op(op, x, at, np.array(1.0))
    return grad_op_x_Val

```

## Convolutional networks

These are the networks most commonly found employed in image-classification. Really, they are just a simplified version of our backpropagation-networks (they are even trained using an only slightly altered algorithm). Instead of connecting every node from layer $l$ to every node of layer $l+1$, they impose some restrictions on the connection-matrix:

- Nodes are connected in a pyramid scheme. A node on layer $l+1$ is connected to 9 nodes directly beneath it. Instead of a $n_l \times n_{l+1}$ connection matrix, we thus have several $9 \times 1$ matrices.
- The connection-strengths of these $9 \times 1$ matrices are all the same - so really there is only just one $9 \times 1$ matrix.

These restrictions are inspired by the physiology of the visual cortex. They have the nice effect that a network is trained much faster, since they massively reduce the amount of weights that need to be learned.

In practice, such networks have a few convolutional layers to reduce the dimension of the input-images, followed by a few conventional, fully connected layers that learn some logic based on the reduced images.

We give the backpropagation-steps for convolutional layers and pooling layers.

In convolutional layers, the forward step goes:

$$\vec{x}^l = \vec{y}^{l-1} \circledast \vec{w}^l$$
$$\vec{y}^l = f(\vec{x}^l)$$

Where the convolution is defined (in our simplified case) as:
$$(\vec{y} \circledast \vec{w})_n = \sum_{m=-1}^1 \vec{y}\_{n+m} \vec{w}\_m$$

Differentiating a convolution is unfamiliar, but not too hard:

$$
\partDiff{(\vec{y} \circledast \vec{w})}{\vec{w}} = \begin{bmatrix}
	0   && y_0 && y_1 \\
	y_0 && y_1 && y_2 \\
	y_1 && y_2 && y_3 \\
	... \\
	y_{l-1} && y_l && 0 \\
\end{bmatrix} := tr(\vec{y})
$$

$$
\partDiff{(\vec{y} \circledast \vec{w})}{\vec{y}} = \begin{bmatrix}
	w_0    && w_1    && 0   && ... \\
	w_{-1} && w_0    && w_1 && ... \\
	0      && w_{-1} && w_0 && ... \\
	...    \\
	0      && ...    && w_{-1} && w_0 \\
\end{bmatrix} := br(\vec{w})
$$

Accordingly, the backwards step goes:

$$\partDiff{e}{\vec{x}^l} = \delta^l \odot f'(\vec{x}^l)$$
$$\partDiff{e}{\vec{w}^l} = \partDiff{e}{\vec{x}^l} tr(\vec{y}) = (\sum_{n=1}^l e'_{x*n} y_{n+1}, \sum_{n=0}^l e'_{x*n} y_n, \sum_{n=0}^{l-1} e'_{x_n} y_{n+1})$$
$$\delta^{l-1} = \partDiff{e}{\vec{x}^l} br(\vec{w}) = \partDiff{e}{\vec{x}^l} \circledast \vec{w}$$

In pooling layers, the forward step goes:

$$x*t^l = \frac{1}{4} \sum_f y_{4t + f}^{l-1}$$
$$y_t^l = x_t^l$$

And the backwards step:

$$\partDiff{e}{\vec{x}^l} = \partDiff{e}{\vec{y}^l} \partDiff{\vec{y}^l}{\vec{x}^l} = \delta^l$$
$$\partDiff{e}{\vec{w}^l} = 0$$
$$\delta^{l-1} = \frac{1}{4} \partDiff{e}{\vec{x}^l}$$

## Self-attention

```python
class SelfAttentionLayer(Layer):
    def __init__(self, name, input):
        """
        https://www.youtube.com/watch?v=KmAISyVvE1Y
        sequence-to-sequence layer.
        simply creates more meaningful embeddings.
        no parameters.

        Example:
        Sentence: "Restaurant was not terrible"
        Usually, the presence of the word "terrible" means a negative sentiment
        But "terrible" and "not" together can interact and yield a positive sentiment

        Nice analogy:
        Word:                                person
        Word's embedding:        (input[i])  person, expressed by their interests
        Interests^T * Interests: (W)         how much do different interests relate (example: 'arts' and 'music')  - like in recommender systems
        W * Interests^T:         (output[i]) person's interests corrected for how the interests bleed over into other interests
                                             = word embedding corrected by how every dim of embedding relates to other dims
        """
        self.name = name

        WPrime = MatMul(Transpose(input), input)
        W = Softmax(WPrime)
        outputT = MatMul(W, Transpose(input))

        self.input = input
        self.output = Transpose(outputT)

    def getParaValues(self):
        return {}

    def update(self, error, at):
        return

```

Interpretation: self attention takes in data and exaggerates it: it stretches big differences out even more and shrinks down already small differences.

Proof:
This becomes visible when we realize that $X^T X$ is a covariance-matrix (since $X$ will likely be centered around 0).
$$Cov = X^T X$$
$$Y^T = Cov X^T$$
Through eigenvalue-decomposition:
$$Cov = E*c \Lambda_C E_c^{-1}$$
Because $Cov$ is symmetric we have $E_C^{-1} = E_C^T$:
$$Cov = E_c \Lambda_C E_c^T$$
$$Cov X^T = \underbrace{E_c \underbrace{\Lambda_C \underbrace{E_c^T X^T}_{\text{Projects $X^T$ into eigenvector space}}}_{\text{Scales projected data by $\lambda$s}}}_{\text{Projects back}}$$

- $E_c^T X^T$ projects $X^T$ into eigenvector space. That is exactly the same thing that PCA does, by the way!
- $\Lambda_C E_c^T X^T$ scales the projected data. Where there is already lot of variance, the data gets streched even more, where there is little, it gets compressed.
- $E_c \Lambda_C E_c^T X^T$ converts the stretched data back.

For comparison, in PCA we have $Y = X E_c$. Thus $Y^T = E_c^T X^T$. Because $C$ is symmetric, this equals $E_c^{-1} X^T$ ... and that is the projection of $X^T$ into eigenvector space.

<img width="50%" src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/X_PCA_CovX.png" />

A somewhat advanced setup allows the attention-layer to modify $X$ in different ways.
Instead of calculating `softmax(X.T @ X) @ X.T` it multiplies $X$ with three different weight-matrixes:

```python
Q = X * Wq
K = X * Wk
V = X * Wv
A = softmax(Q.T @ K) @ V.T
```

## Stable diffusion

<img width="100%" src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/stable_diffusion.jpg" />

- GAN's used to be the dominant way of making images.
- But they tend to get stuck: once a generator finds one convincing face, it keeps making only that one.
- SD works by trying to remove noise from what it thinks is an image - but actually is just random noise.
- Training on SD is still hard, so instead of training a big UNet, one compresses the input-image with a GAN-encoder and expands the UNet's output again with a GAN's decoder. One then trains the UNet on the compressed image. This reduces parameters and training-time.

### Self organizing maps

Self organizing maps are another, fundamentally different type of neural network. Where feedforward nets employ supervised learning with backpropagation, SOM's do unsupervised learning with a competitive algorithm.

## Computer vision

**Feature detection and pose estimation**

Say you want to locate the position of the nose in a portrait.

# Feature extraction and dimensionality reduction

The art of preprocessing input has developed in a branch of machine learning itself. Classifiers like SVM's and nnets work better when they get cleaned up and encoded input instead of raw data.

# Symbolic AI

Contrary to the before mentioned approaches, symbolic AI uses logical deduction instead of numerical processing to arrive at decisions. If neural nets and decision-trees learning from data can be called building _experience_, then an inference engine deducting from rules can be called building _expertise_. A good tutorial can be found here: [codeproject.com](codeproject.com/Articles/179375/Man-Marriage-and-Machine-Adventures-in-Artificia).

## Inference engine

A inference engine can do the following:

- Learning:
  - Gather if-then statements (usually in the form of Horn-clauses).
  - Create a graph of dependencies between statements (a so called and-or-tree).
- Applying the learned things: Given a question:
  - Possible answers: find all potential answers to the problem
  - Backward pass: go through the graph to see what data is required
  - Data acquisition: ask user to provide the data
  - Forward pass: trace the graph forward again to arrive at a single one of the possible answers

Depending on how much effort you put into the expressions that the engine can understand, we differentiate between different levels of logic:

- 0th order logic: understands simple facts and chains them using modus ponens
- 1st order logic: understands variables: all of naive math can be written in 1st order logic.
- higher order logic: is better at inference; can create new if-then-statements as a result of inference or even explore

Popular expert-system-libraries are Prolog, CLIPS and Pyke.

There are many variants to how you can write an expert system.
The most important variables are

- How are rules parsed? Do we allow for other logical connectives than 'AND'? See [this example](https://medium.com/a-42-journey/expert-systems-how-to-implement-a-backward-chaining-resolver-in-python-bf7d8924f72f).
- How is inference done? Forward pass on `addFact` or backward pass on `eval`, or a mixture?
- How is pattern-matching done? The Rete-algorithm is very popular for this.
- Are meta-heuristics used?
  - Does the engine try to infer more general rules while idle?
  - Does the engine keep track if a search down one branch takes very long (needs a watching strategy-module)?

```python

class Object:
    def __init__(self, description):
        self.description = description

    def __repr__(self):
        return self.description


class Relation(Object):
    def __init__(self, description):
        super(Relation, self).__init__(description)



class Variable:
    def __init__(self, description, cls=Object):
        self.description = description
        self.cls = cls

    def __repr__(self):
        return self.description


class Rule:
    def __init__(self, condition, consequence):
        self.condition = condition
        self.consequence = consequence

    def __eq__(self, other):
        if isinstance(other, Rule):
            if other.condition == self.condition and other.consequence == self.consequence:
                return True
        return False

    def __repr__(self):
        return f"if {self.condition} => {self.consequence}"


def getVariables(query):
    vrbls = []
    isSingleWord = False if isinstance(query, tuple) else True
    if isSingleWord:
        query = (query,)
    for word in query:
        if isinstance(word, Variable):
            vrbls.append(word)
        elif isinstance(word, tuple):
            subVrbls = getVariables(word)
            vrbls += subVrbls
    return vrbls


def substitute(query, tDict):
    # sanity check
    variablesInQuery = getVariables(query)
    newVrblValuesInDict = getVariables(tDict.values())
    for v in variablesInQuery:
        if v in newVrblValuesInDict:
            raise Exception(f"The phrase {query} already has a variable named '{v}'. Please rename this variable.")

    substituted = []
    for word in query:
        if isinstance(word, Variable):
            if word in tDict:
                substituted.append(tDict[word])
            else:
                substituted.append(word)
        elif isinstance(word, tuple):
            subSubstituted = substitute(word, tDict)
            substituted.append(subSubstituted)
        else:
            substituted.append(word)
    return tuple(substituted)


def matches(vQuery, fact):
    if len(vQuery) != len(fact):
        return False
    tDict = {}
    for vw, fw in zip(vQuery, fact):
        if isinstance(vw, Variable):
            if vw in tDict and fw != tDict[vw]:  # a variable must not be set with two different values.
                return False
            tDict[vw] = fw
        elif vw != fw:
            return False
    return tDict


class InferenceEngine:
    def __init__(self):
        self.facts = []
        self.rules = []
        self.learned = []
        self.ongoingRules = []

    def addFact(self, *fact):
        if fact not in self.facts:
            self.facts.append(fact)

    def addRule(self, condition, consequence):
        rule = Rule(condition, consequence)
        if rule not in self.rules:
            self.rules.append(rule)

    def addLearned(self, *query):
        if len(getVariables(query)) == 0:
            if query not in self.learned:
                self.learned.append(query)

    def matchInFacts(self, *query):
        for fact in self.facts + self.learned:
            tDict = matches(query, fact)
            if tDict is not False:
                yield tDict

    def matchInRules(self, *query):
        if query not in self.learned:
            for rule in self.rules:
                tDict = matches(rule.consequence, query)
                if tDict:
                    substRule = Rule(substitute(rule.condition, tDict), query)
                    self.addLearned(*query)
                    yield substRule

    def eval(self, *query):
        print(f"now evaluating: {query}")
        operator = query[0]
        operands = query[1:]
        if operator in ['and', 'or', 'calc', 'unequal', 'not']:  # special forms
            if operator == 'and':
                for tDict in self.And(*operands):
                    yield tDict
            elif operator == 'or':
                for tDict in self.Or(*operands):
                    yield tDict
            elif operator == 'calc':
                function = operands[0]
                args = operands[1:]
                for tDict in function(args):
                    yield tDict
            elif operator == 'not':
                for tDict in self.Not(*operands):
                    yield tDict
            elif operator == 'unequal':
                if operands[0] != operands[1]:
                    yield {}
        else:
            for tDict in self.matchInFacts(*query):
                yield tDict
            for rule in self.matchInRules(*query):
                if rule not in self.ongoingRules:
                    self.ongoingRules.append(rule)
                    for tDict in self.eval(*(rule.condition)):
                        yield tDict
                    self.ongoingRules.remove(rule)
                else:
                    print("break because rule already going on.")


    def evalAndSubstitute(self, *query):
        for tDict in self.eval(*query):
            yield substitute(query, tDict)

    def __repr__(self):
        return 'IE'

    def And(self, firstArg, *restArgs):
        """
            The first conjunct creates a stream of tDicts.
            Every subsequent conjunct filters that stream.
            Cancels early when the stream has become empty.
        """
        for tDict in self.eval(*firstArg):
            if len(restArgs) == 0:
                yield tDict
            else:
                restArgs = [substitute(arg, tDict) for arg in restArgs]
                for subTDict in self.And(*restArgs):
                    tDict.update(subTDict)
                    yield tDict

    def Or(self, *args):
        yield

    def Not(self, *args):
        yield

    def allCombinations(self, listOfGenerators):
        firstGen = listOfGenerators[0]
        restGen = listOfGenerators[1:]
        if len(restGen) == 0:
            for result in firstGen:
                yield [result]
        else:
            for result in firstGen:
                for subresults in self.allCombinations(restGen):  # TODO: performance? 'self.allCombinations' is called repeatedly!
                    yield [result] + subresults




ie = InferenceEngine()
michael = Object('Michael')
andreas = Object('Andreas')
volker = Object('Volker')
bruder = Relation('Bruder')
vater = Relation('Vater')
X = Variable('jemand')
Y = Variable('noch jemand')
V = Variable('vater')

ie.addFact(michael)
ie.addFact(andreas)
ie.addFact(volker)
ie.addFact(bruder, michael, andreas)
ie.addFact(vater, michael, volker)
ie.addRule(('and', (vater, X, V),
                    (bruder, X, Y)),
            (vater, Y, V))

jemands = ie.matchInFacts(X)
self.assertTrue( len(toList(jemands)) == 3 )

vaterWenn = ie.matchInRules(vater, A, B)
self.assertTrue( toList(vaterWenn)[0].condition == ('and', (vater, X, B),
                                                (bruder, X, A)) )

volkerIstMeinesBrudersVater = ie.eval('and', (bruder, michael, A),
                                            (vater, A, volker))
print(toList(volkerIstMeinesBrudersVater, 1))
```

## Constraint satisfaction

This is actually a somewhat simpler form of logic machine.

```python
#%%
# https://www.youtube.com/watch?v=Yo-xat4cn8M


class Var:
    def __init__(self, name, range):
        self.name = name
        self.range = range

    def decided(self):
        return len(self.range) == 1

    def decide(self, val):
        return Var(self.name, [val])

    def __repr__(self) -> str:
        if self.decided():
            return f"Var({self.name} - {self.range[0]})"
        return f"Var({self.name} - {self.range})"


class Fac:
    def __init__(self, inputNames, func):
        self.inputNames = inputNames
        self.func = func

    def applicable(self, vars):
        for inputName in self.inputNames:
            inputVar = first(vars, lambda v: v.name == inputName)
            if not inputVar:
                return False
            if not inputVar.decided():
                return False
        return True

    def apply(self, vars):
        inputs = []
        for inputName in self.inputNames:
            inputVar = first(vars, lambda v: v.name == inputName)
            inputs.append(inputVar)
        return self.func(*inputs)

    def __repr__(self) -> str:
        return f"Fac({self.vars.join(', ')})"


#%%

# user may overwrite this
def orderVars(vars, facs):
    # return most constrained var first
    def sortFunc(var):
        if var.decided():
            return 999999
        else:
            return len(var.range)
    vars.sort(key = sortFunc)
    return vars

# user may overwrite this
def orderVals(var, vars, facs):
    # return least constraining values first
    return var.range

# user may overwrite this
def updateDomain(var, vars, facs):
    # restrict domain of var
    return var


bestRating = 0
@memoize
def solve(vars, facs, rating = 1):
    if all(vars, lambda var: var.decided()):
        if rating > bestRating:
            bestRating = rating
        yield (rating, vars)

    else:
        for var in orderVars(vars, facs):
            for val in orderVals(var, vars, facs):

                # Step 1: new variable set with decided value
                varDecided = var.decide(val)
                otherVars = allExcept(vars, var)
                newVars = [*otherVars, varDecided]
                # print(f"Trying {newVars} ...")

                # Step 2: evaluate set.
                subRating = 1
                for fac in facs:
                    if fac.applicable(newVars):
                        subRating *= fac.apply(newVars)
                # If inconsistent, stop here.
                if subRating == 0:
                    continue
                # If another combination was already better
                # than anything we can get from here, stop, too.
                if bestRating > rating * subRating:
                    continue

                # Step 3: adjust domains of other variables through lookahead
                # This step is optional because if we don't do it, inconsistent values
                # will be filtered out in the next recursion ...
                # ... but here we have a chance to do something smart
                # that removes multiple values at once.
                updatedVars = [
                    updateDomain(var, newVars, facs)
                    for var in newVars
                ]

                for result in solve(updatedVars, facs, rating * subRating):
                    yield result



#%%

colors = ['R', 'G', 'B']

def differentColor(state1, state2):
    if state1.decided() and state2.decided():
        if state1.range[0] == state2.range[0]:
            return 0
    return 1

wa = Var('WA', colors)
nt = Var('NT', colors)
wa_nt = Fac(['WA', 'NT'], differentColor)
sa = Var('SA', colors)
wa_sa = Fac(['WA', 'SA'], differentColor)
nt_sa = Fac(['NT', 'SA'], differentColor)
qu = Var('QU', colors)
nt_qu = Fac(['NT', 'QU'], differentColor)
sa_qu = Fac(['SA', 'QU'], differentColor)
nw = Var('NW', colors)
qu_nw = Fac(['QU', 'NW'], differentColor)
sa_nw = Fac(['SA', 'NW'], differentColor)
vc = Var('VC', colors)
sa_vc = Fac(['SA', 'VC'], differentColor)
nw_vc = Fac(['NW', 'VC'], differentColor)
ta = Var('TA', colors)


vars = [wa, nt, sa, qu, nw, vc, ta]
facs = [wa_nt, wa_sa, nt_sa, nt_qu, sa_qu, qu_nw, sa_nw, sa_vc, nw_vc]

for i, result in enumerate(solve(vars, facs)):
    print(i, result)

# %%

```

## Markov decision processes

We move from _state_ to state through *action*s.
Actions applied to a state yield another state *probabilistic*ally.
Arriving at a new state yields some _reward_.
We try to find a _policy_ which maximizes our _cumulative_ reward, aka. the _value_.

- $s$: **State**.
- $a$: **Action**. Probabilistic - might result in $s' = s_1$ or $s' = s_2$ or ...
- $P_a(s, s') = P(s_{t+1} = s' | s_t = s, a_t = a)$: **Transition probabilities**
- $R_a(s, s')$: Immediate **reward** for getting to state $s'$ from $s$ through $a$
- $\pi(s) = a$: **Policy**: decides on which action to take given a state.

Once a policy $\pi$ has been decided on, this process reduces to a Markov-chain.
$P(s' | s, a)$ reduces to $P(s' | s)$.

The objective is to chose a $\pi$ that will maximize my cumulative reward:

$$E[ \Sigma_{t=0..\infty} \gamma^t R_{a_t}(s_{t}, s_{t+1}) ]$$
Where $\gamma$ is some discount value $0 \leq \gamma \leq 1$ which accounts for the fact that I'd rather have my earnings today than tomorrow.

The value $V = E[U]$ is defined as the expected reward. This expands to:

$$
\begin{aligned}
U    &= R(s_1 | s_0) + \gamma R(s_2 | s_1) + ...  \\
E[U] &= E[R(s_1 | s_0)] + \gamma E[R(s_2 | s_1)] + ... \\
     &= \Sigma_{s_1} P(s_1) R(s_1 | s_0) + \gamma \Sigma_{s_1} P(s_1) E | s_1[R(s_2 | s_1)]   + ... \\
     &= \Sigma_{s_1} P(s_1) R(s_1 | s_0) + \gamma \Sigma_{s_1} \Sigma_{s_2} P(s_1) P(s_2 | s_1) R(s_2 | s_1) + ...
\end{aligned}
$$

This is a recursive calculation. So, given a policy we can calculate our value per state:
$$V(s) | \pi = \Sigma_{s'} P_{\pi(s)}(s, s') [ R_{\pi(s)}(s, s') + \gamma V(s')]$$

And we can chose $\pi(s)$ like so:

$$
\begin{aligned}
    &\forall s \in S: \\
    &\pi(s) | V = \text{argmax}_a \{ \Sigma_{s'} P_a(s, s')[R_a(s, s') + \gamma V(s')] \}
\end{aligned}
$$

This requires a lot of recursion, but will eventually yield a correct solution.

```python
def evalPolicy(policy, s):
    if isEndState(s):
        return 0
    a = policy[s]
    v = 0
    for sNext in S:
        vNow = reward(sNext, s, a)
        vFut = evalPolicy(policy, sNext)
        v += prob(sNext, s, a) * (vNow + gamma * vFut)
    return v

```

### Better performance for MDPs

A policies value is calculated recursively:
$$V(s) | \pi = \Sigma_{s'} P_{\pi(s)}(s, s') [ R_{\pi(s)}(s, s') + \gamma V(s')]$$
But in practice, that $V(s')$ is problematic: this keeps recursing down until at some point `isEndState(s) == true`.

We can get a better performance by employing **contraction mapping** aka. **fixed-point iteration**:

$$
\begin{aligned}
  V^{new}, & V^{old}: \text{dictionaries} \\
  \text{while } & V^{new} - V^{old} > \epsilon: \\
                & V^{old} = V^{new} \\
                & V^{new}[s] | \pi = \Sigma_{s'} P_{\pi(s)}(s, s') [ R_{\pi(s)}(s, s') + \gamma V^{old}[s']]
\end{aligned}
$$

Note how $V^{old}[s']$ is now no longer a recursive call, but evaluates immediately.

```python
def qValue(state, action, Vold):
    if isEndState(state):
        return 0
    v = 0
    for sNext in S:
        vNow = reward(sNext, state, action)
        vFut = Vold[sNext]
        p = prob(sNext, state, action)
        v += p * (vNow + gamma * vFut)
    return v


def evalStrategy(strategy):
    Vnew = {s: 0 for s in S}
    error = 99999
    while error > 0.05:
        Vold = Vnew
        Vnew = {}
        for s in S:
            action = strategy[s]
            Vnew[s] = qValue(s, action, Vold)
        error = errorFunc(Vnew, Vold)
    return Vnew



def optimalStrategy():
    strategy = {}
    Vnew = {s: 0 for s in S}
    error = 99999
    while error > 0.05:
        Vold = Vnew
        Vnew = {}
        for s in S:
            maxQs = -99999
            for a in A:
                qs = qValue(s, a, Vold)
                if qs > maxQs:
                    maxQs = qs
                    strategy[s] = a
            Vnew[s] = maxQs
        error = errorFunc(Vnew, Vold)
    return strategy

```

It is important to note that other strategies than contraction-mapping might be better - like Simplex-Gradient-Descent.
Contraction-mapping only converges in certain cases (see below), and if it does, it does so not very fast.

### **Contraction mapping: background information**

Imagine we want to find an $x$ such that
$$x = f(x)$$
We first try candidate $x_0$.

$$
    f(x_0) \to x_1, x_1 \neq x_0 \\
    f(x_1) \to x_2, x_2 \neq x_1 \\
    f(x_2) \to x_3, x_3 \approx x_2
$$

How did that work? It's because $f$ is a **contraction**, and this algorithm is called **fixed point iteration**.

> A **fixed point** $x_{fix}$ for a function $f: X \to X$ is one where:
> $$f(x_{fix}) = x_{fix}$$

> A **contraction** is a function $f: X \to X$ for which:
> $$\forall x_1, x_2: |f(x_1) - f(x_2)| \leq \alpha |x_1 - x_2|$$
> for some fixed $\alpha < 1$.
>
> In words: if we apply $f$ to $x_1$ and $x_2$, then the results will be closer to each other than $x_1$ and $x_2$ were. If we apply $f$ _again_ to $f(x_1)$ and $f(x_2)$, the results will be closer yet.

That is: a function is a contraction if its slope $\frac{f(x + \delta) - f(x)}{\delta}$ is less than one for any $x$ and any $\delta$. Notice that e.g. a linear function is not a contraction if it's slope is too large. $\sin(x)$ isn't a contraction, either. _But_: even if a function is not a contraction, a [slight variant of that function might be one](https://math.stackexchange.com/questions/2389656/iterative-method-to-solve-fx-x).

Contractions have useful properties:

> - If a function is a contraction, it has at most one fixed point $x_{fix}$.
> - $\forall x \in X: \text{ the series } x, f(x), f(f(x)), f(f(f(x))), ... $ converges to the fixed point $x_{fix}$

Applied to programming, we can replace a recursive calculation ...

```python
def calcA(i):
    return something(calcA(j)) # recursive

A[i] = calcA(i)
```

... with a non-recursive easing-code:

```python
def calcA(Aold):
    return something(Aold) # non-recursive

Anew = [0, 0, 0]
while |Anew - Aold| > e:
    Aold = Anew
    Anew = calcA(Aold)
```

Applying this to our MDP:

- $x = f(x)$ maps to `V = evalPolicy() # recursive`
- $x_1$ maps to `vOld`
- $x_{fix} = f(f(f(x_1)))$ maps to `vNew = qVal(qVal(qVal(vOld)))`

By the way: Contraction-mapping [is a slightly more general form of Newton's method](https://schoolbag.info/mathematics/advanced/18.html).
