$
\newcommand\mtrx[1]{\mathbf{#1}}
\newcommand\nullspace[1]{\mathcal N_{#1}}
\newcommand\colspace[1]{\mathcal C_{#1}}
\newcommand\rowspace[1]{\mathcal R_{#1}}
\newcommand\solspace[1]{\mathcal S_{#1}}
\newcommand\dimension[1]{\text{dim}(#1)}
\newcommand\rank[1]{\text{rank}_#1}
\gdef\symm{\text{sym}}
\gdef\rops{\text{rops}}
\gdef\cops{\text{cops}}
\gdef\myarray#1{
    \begin{bmatrix}
        #1 \\
    \end{bmatrix}
}
$


# Linear algebra

In the previous section on general algebra we dealt with vector spaces (subspaces, linear independence, bases) and inner product spaces (norms, orthogonality). 
Here we'll mostly deal with the inner-product space of vectors and occasionally with the vector-space of matrices (but really, almost exclusively with the former ... ).




## Spaces

We'll work a lot with a few vector-spaces and transformations from and to those spaces. 

> **Definition** 
> Let $W$ be a space. Then $V \subseteq W$ is a subspace, if:   
> - $\forall v_1, v_2 \in V: v_1 + v_2 \in W$
> - $\forall v \in V: \forall r \in R: rv \in V$
    
> **Definition**: Nullspace
>
> $\nullspace{A}$ is the nullspace of $A$. It is defined as $\nullspace{A} = \{ x | Ax = 0 \}$

> **Definition**: Columnspace
>
> $\colspace{A}$ is the columnspace of $A$. It is defined as $\colspace{A} = \{ y | Ax = y \}$

> **Definition**: Rowspace
>
> $\rowspace{A}$ is the rowspace of $A$. It is defined as $\rowspace{A} = \{ y | A^Tx = y \}$

> **Definition**: Rank
>
> $r_A$ is the rank of $A$. It is defined as the dimension of $\colspace{A}$, $\dimension{\colspace{A}}$


> **Definition**: Nullity
>
> $n_A$ is the nullity of $A$. It is defined as the dimension of $\nullspace{A}$, $\dimension{\nullspace{A}}$



**rops and cops as matrix multiplication**

$$\rops(A) = \rops(I) A = R A$$

$$\cops(A) = A \cops(I) = A C$$


### rops don't change $\nullspace{A}$
Row- and column-operations (rops and cops) seem somewhat trivial at first and not worth any proof writing efforts. However, many theorems of linear algebra are much easier proved if we first reduce the matrices to their RRLE (reduced row linear echelon) form.

> **Theorem**
> Row-operations on $A$ don't change \nullspace{A}. 
>
> Let $A' = \rops(A) = RA$ Proof that $\nullspace{A} = \nullspace{A'}$
>> Let $x_0: Ax_0 = 0$. Proof that $\exists y_0: A'y_0 = 0$
>>> Try $y_0 = x_0$. Proof that $A'y_0 = 0$
>>>> $RAy_0 = 0$
>> Let $y_0: A'y_0 = 0$. Proof that $\exists x_0: Ax_0 = 0$
>>> This is equivalent to stating that $\exists x_0: R^{-1} A' x_0 = 0$
>>>
>>> Try $x_0 = y_0$. Proof that $R^{-1} A' x_0 = 0$
>>>> $R^{-1} A' x_0 = 0$


Therefore, when searching for the special solutions to a problem $Ab = 0$, we can use Gauss-Elemination and RREF without any problems.

### cops don't change C(A) ...

### rops don't change C(A) if A is invertible ...

We can now print an overview of the different spaces that are associated with a matrix $A$ of dimension $m \cdot n$ and rank $r$.

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/four_spaces.png">

The row-space of $A$ can be visualized using the line-intersection view of matrix-equations: it contains all the points that lie in the intersection of all the lines that make up the matrix. The column-space of A can be visualized using the vector-image of A: it contains all the points that are spanned by A. 
Notice how we included the previous theorem: any combination $x$ of a particular solution $x_r$ and any vector in the nullspace $x_n$ is also a solution.


We should look in more detail at this graphic. Note, for example, that \nullspace{A} and \colspace{A^T} seem to be orthogonal. Indeed:
> **Theorem**
> $\forall v \in \nullspace{A}, w \in \colspace{A^T}: v \perp w$
>
>>    $$
>>        \begin{aligned}
>>            w^T v &= 0  & \text{ with } \exists u: \mtrx{A}^T u = w \\
>>            u^T \mtrx{A} v &= 0 & \text{ with } \mtrx{A}v = 0 \\
>>            u^T 0 &= 0 & \text{ which is trivially true.}
>>        \end{aligned}
>>    $$
>> Thus, \nullspace{A} and \colspace{A^T} only intersect in $\vec{0}$.


However, note that $\reals^n \geq \nullspace{A} \cup \colspace{A^T}$. As an example, consider $\mtrx{A} = \begin{bmatrix}
    1 & 0 \\
    0 & 0
\end{bmatrix}$. We get $\nullspace{A} = \begin{bmatrix}
    0 \\ x
\end{bmatrix}$ and $\colspace{A^T} = \begin{bmatrix}
    x \\ 0
\end{bmatrix}$. Now consider $\vec{v} = \begin{bmatrix}
    1 \\ 1
\end{bmatrix}$, which is neither in $\nullspace{A}$ nor in $\colspace{A^T}$. As illustration, look at [fig.](nullspace_rowspace_lowrank).

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/nullspace_rowspace_lowrank.png">
    
    
**When $A$ is not full rank, there are infinitely many vectors $v$ that are neither in \rowspace{A} nor in \nullspace{A}. When it comes to spatial dimensions, $1 + 1 \neq 2$!**
        
<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/nullspace_rowspace_lowrank.png">






## Change of basis<a id="changeOfBasis"></a>

Let $V$ be a vector space. Let $0$ be the canonical basis for that vector space. Let $A = \{\vec{a}_1, ..., \vec{a}_N \}$ and $B = \{\vec{b}_1, ..., \vec{b}_N\}$ be two other basis for that vectorspace. Let $\mtrx{A}$ be the matrix $[\vec{a}_1  ...  \vec{a}_N]$ and $\mtrx{B} = [\vec{b}_1 ... \vec{b}_N]$

Every vector $\vec{v}$ can be expressed as a linear sum of the basisvectors in $A$, that is $\vec{v} = \sum_n \alpha_n \vec{a}_n$. That same thing in matrix notation: $\vec{v} = \mtrx{A}(\vec{v})_A$, where $(\vec{v})_A$ is the coordinates $\alpha$ of $\vec{v}$ with respect to the basis $A$. Correspondingly, for $B$ we have $\vec{v} = \sum_n \beta_n \vec{b}_n = \mtrx{B}(\vec{v})_B$.

Note that within $A$ and $B$, we express the basevectors with respect to the canonical basis $0$, that is, we should really write $\mtrx{A} = [(\vec{a}_1)_0  ...  (\vec{a}_N)_0]$. Note also that $[(\vec{a}_1)_A  ...  (\vec{a}_N)_A] = \mtrx{I}$, the identity matrix. 

We can use this to obtain a simple formula for the change of basis. 
$$ \vec{v} = \mtrx{A} (\vec{v})_A $$
$$ \vec{v} = \mtrx{B} (\vec{v})_B $$
$$ (\vec{v})_B = \mtrx{B}^{-1} \mtrx{A} (\vec{v})_A $$

But inverses are notoriously hard to calculate. Fortunately, there is another approach. Call $\mtrx{T}_{BA} = [(\vec{a}_1)_B ... (\vec{a}_N)_B]$ the *transition matrix*. We can prove that $\mtrx{B}^{-1} \mtrx{A} = \mtrx{T}_{BA}$:

$$
\begin{aligned}
\mtrx{B}^{-1} \mtrx{A} (\vec{v})_A &= \mtrx{T}_{BA}  (\vec{v})_A \\
                                   &= \sum_n (v_n)_A (\vec{a}_n)_B \\
                                   &= \sum_n (v_n)_A \mtrx{B}^{-1} \mtrx{A} (\vec{a}_n)_A \\
                                   &= \mtrx{B}^{-1} \mtrx{A} \sum_n (v_n)_A (\vec{a}_n)_A \\
                                   &= \mtrx{B}^{-1} \mtrx{A} \text{  } \mtrx{I} (\vec{v})_A \\
                    (\vec{v})_A &=  (\vec{v})_A         
\end{aligned}
$$

Using $\mtrx{T}_{BA} = \mtrx{B}^{-1}\mtrx{A}$, a lot of statements are trivial to prove:

- $\mtrx{T}_{BA} = \mtrx{T}_{AB}^{-1}$
- $\mtrx{T}_{CA} = \mtrx{T}_{CB} \mtrx{T}_{BA}$














## Linear transformations

> **Definition** 
> Let $U$ and $V$ be two vector spaces and $f:U \to V$. Then $f$ is a *linear transform* if
> - $f$ preserves scalar multiplication: $f(\alpha \vec{u}) = \alpha f(\vec{u})$
> - $f$ preserves vector addition: $f(\vec{u}_1 + \vec{u}_2) = f(\vec{u}_1) + f(\vec{u}_2)$

There are a bunch of properties to linear transformations that can be useful to us. 

There is a unique linear transform from the basis of $U$ to any set of vectors in $V$ that we want.
In other words, any linear transform $f$ is completely determined by the matrix $[ f(\vec{b}_1) ... f(\vec{b}_N) ] = [\vec{v}_1 ... \vec{v}_N]$. That means if we don't know the transform, but we do know the results of the transform on a basis, then we can reconstruct the transform with certainty.

> Let $B = \{ \vec{b}_1, ..., \vec{b}_N \}$ be a basis for $U$. Let $\{ \vec{v}_1, ..., \vec{v}_N \}$ be any vectors in $V$ that we may chose. Proof that there is a unique function $f:U \to V$ such that $f(\vec{b}_i) = \vec{v}_i$ 

>> Try $f(\vec{x}) = \mtrx{V} (\vec{x})_B$. Proof that $f(\vec{b}_i) = \vec{v}_i$ and $f$ is a linear transform.
>>
>>> Part 1:
>>>
>>>$f(\vec{b}_i) = \vec{v}_i$. Proof that $ f(\vec{b}_i) = \mtrx{V} (\vec{b}_i)_B = \mtrx{V} \vec{e}_i = \vec{v}_i $
>>>
>>> Part 2:
>>>
>>> $f$ is unique
>>>> We could not have obtained any other form of $f$ than $f(\vec{x}) = \mtrx{V} (\vec{x})_B$. This is because for *any* linear transform from $U \to V$ we have: 
>>>>
>>>> $ f(\vec{x}) = f(\mtrx{B}(\vec{x})_B) = f(\sum_n (x_n)_B \vec{b}_n) = \sum_n (x_n)_B f(\vec{b}_n)  $
>>>>
>>>> Using the result from part 1, this cannot be any other function than: 
>>>>
>>>> $ \sum_n (x_n)_B f(\vec{b}_n) = \sum_n (x_n)_B \vec{v}_n = \mtrx{V} (\vec{x})_B $ 
>>>
>>> Part 3:
>>>
>>> $f$ is a linear tansform


A whole bunch of other properties are now easily proved. Let $f$ and $g$ be linear transforms from $U$ to $V$. The following are also linear transforms: 
- $\alpha f$
- $f + g$
- $f^{-1}$ ( if it exists )
- $fg$ ( here $g: V \to W$ )


Let $f: U \to V$ be a linear transform. Then the following are equivalent: 
- If $f(\vec{u}) = \vec{0}$, then $\vec{u} = \vec{0}$
- $f$ is one-to-one
- $f$ maps linearly independent vectors to linearly independent vectors. 



Prove that a transform can be split up into multiple transforms on the basis vectors. 
As an example, consider the case of a rotation. A diagonal rotation can be reproduced by a rotation first around one, then around another axis. 


**A linear transformation can also be a change of basis** when it is on a vector-space and invertible.














## Linear independence


> **Definition** 
> $B$ is linearly independent if $\forall b \in B: b \neq \sum r_n b_n$, with $b_n \in B/b$. 


> **Theorem** <a id="lin_indep_if_no_bx0"></a>
> A better definition could be stated as such: $B$ is linearly independent, if the only solution to $Bx = 0$ is the zero-vector.
>
> Suppose $\forall \vec{b} \in \mtrx{B}: \vec{b} \neq \sum_{B/b} \alpha_i \vec{b}_i$. Proof that $\mtrx{B}\vec{x} = \vec{0} \to \vec{x} = \vec{0}$
>
>> Suppose $\mtrx{B} \vec{x} = \vec{0}$. Proof that $\vec{x} = \vec{0}$
>>
>>> By contradiction. Assume $\vec{x} \neq \vec{0}$. Proof that there is a contradiction.
>>>
>>>> We have $\mtrx{B}\vec{x} = \vec{0}$
>>>> 
>>>> Consider the vector $\vec{b}_3$.
>>>> 
>>>> Thus: $\sum_{B/b_3} x_i \vec{b}_i = -x_3 \vec{b}_3$
>>>> 
>>>> Or: $\sum_{B/b_3} \frac{- x_i}{x_3} \vec{b}_i = -x_3 \vec{b}_3$
>>>> 
>>>> This contradicts the statement that $\forall \vec{b} \in \mtrx{B}: \vec{b} \neq \sum_{B/b} \alpha_i \vec{b}_i$
>>
>> Suppose $\mtrx{B}\vec{x} = \vec{0} \to \vec{x} = \vec{0}$. Proof that $\forall \vec{b} \in \mtrx{B}: \vec{b} \neq \sum_{B/b} \alpha_i \vec{b}_i$
>>
>>> Let $\vec{b_0} \in \mtrx{B}$. Proof that $\vec{b}_0 \neq \sum_{B/b_0} \alpha_i \vec{b}_i$
>>>
>>>> By contradiction. Assume $\vec{b}_0 = \sum_{B/b_0} \alpha_i \vec{b}_i$. Proof that there is a contradiction.
>>>>> Since $\vec{b}_0 = \sum_{B/b_0} \alpha_i \vec{b}_i$
>>>>>
>>>>> we get $\vec{0} = \sum_B \alpha_i \vec{b}_i$, where $\alpha_0 = -1$
>>>>>
>>>>> In matrix notation: $\vec{0} = \mtrx{B} \vec{\alpha}$, with a non-zero $\vec{\alpha}$.
>>>>>
>>>>> This contradicts our assumption that $\mtrx{B}\vec{x} = \vec{0} \to \vec{x} = \vec{0}$


> **Definition** 
> Let $V$ be a subspace. $B \subseteq V$ is a basis for $V$ if $B$ is linearly independent and $\forall v \in V: v = \sum r_n b_n$, with $b_n \in B$











## Determinant

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/determinant.png">


> **Definition** Consider a $2 \times 2$ matrix $\mtrx{A}$ 
> $$
> \mtrx{A} = 
> \begin{bmatrix}
>     a_{11} & a_{12} \\
>     a_{21} & a_{22}
> \end{bmatrix}
> $$
> $\det{\mtrx{A}}$ is defined as $a_{11}a_{22} - a_{12}a_{21}$. The definitions for higher order matrix-determinants are similar, but so extremely tedious that we just ignore them here. 
> 

> **Theorem**  <a id="det_0"></a>
> Let $ \mtrx{A} \vec{x} = 0 $ and $ \vec{x} \neq \vec{0}$. Then it must hold that $\det{\mtrx{A}} = 0$.
>
> In fact, this holds in two directions:
> $$ \exists \vec{x} \neq \vec{0}: \mtrx{A} \vec{x} = 0  \iff \det{\mtrx{A}} = 0 $$
>
 > We can prove this making use of [theorem](lin_indep_if_no_bx0). From the given it follows that $\mtrx{A}$ is linearly dependent.
 >
 > Thus $\exists \vec{a} \in \mtrx{A}: \vec{a} = \sum_{A/a} \alpha_i \vec{a}_i$. In the case of a $2 \times 2$ matrix this expression becomes very simple: $\vec{a}_1 = \alpha \vec{a}_2$. 
>
> Breaking $\vec{a}_1$ into its components  
> - $a_{11} = \alpha a_{12}$
> - $a_{21} = \alpha a_{22}$
>
> Putting this into the definition of a determinant we get:
> $$
>     \begin{aligned}
>         \det{\mtrx{A}}  &= a_{11}a_{22} - a_{12}a_{21} \\
>                         &= \alpha a_{12} a_{22} - \alpha a_{12} a_{22} \\
>                         &= 0
>     \end{aligned}
> $$
> For higher order matrices, the proof follows from induction or something like that.



**Interpretation** The size of the determinant can be seen as the scaling-factor of the transformation described by the matrix $A$.
It is also a measure of how much linearly independent the rows/cols of $A$ are. The size of the determinant equals the size of the (hyper-)parallelogram spanned by the columns. If two vectors are almost linearly dependent, they will be almost parallel, leading to a very small area of the parallelogram. So if you have a small determinant, your columns are almost dependent. If you have a large one, your columns are very orthogonal. 
If your determinant is zero, that means that your matrix $A$ is a transformation $Ax$ that squishes (at least) one of the dimensions of $x$ into nothing.


**Properties**

- $\det{\mtrx{A} \mtrx{B}} = \det{\mtrx{A}}\det{\mtrx{B}}$
- $\det{\mtrx{A} + \mtrx{B}} \neq \det{\mtrx{A}} + \det{\mtrx{B}}$
- $\det{\mtrx{A}} = \prod{\lambda_i}$ (see eivenvalues, later)










## Rank nullity Theorem


> **Theorem**
> $ \nullspace{A} = \{ 0 \} \to \det{A} \neq 0 $
>
> This is almost self-proving. 
>>  $\nullspace{A} = \{ 0 \}$ is equivalent to writing $\mtrx{A} \vec{x} = \vec{0} \to \vec{x} = \vec{0}$.
>>
>>  By [theorem](lin_indep_if_no_bx0) this means that $\mtrx{A}$ is linearly independent.
>>
>>  And by [theorem](det_0) this means that $ \det{A} \neq 0 $.



> **Theorem**
> Let $A: X \to Y$. Then:
> $$ \nullspace{A} = \{ 0 \} \to \colspace{A} = Y $$


<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/A_from_X_to_Y.png">

> **Theorem**
> Rank nullity: this is a fundamental theorem of linear algebra.
>
> Let $A$ be of dimension $r \times c$ and full rank.
> Then: 
> $$ r_A + n_A = c $$



> **Theorem**
> $$ r_A = \dimension{\colspace{A}} = \dimension{\rowspace{A}} $$


> **Theorem**
> $$ A:basis_{\colspace{A}} \to r_A = n $$







## Special matrices

> **Symmetric matrices** are simple but very useful.
> **Definition** 
> A matrix $\mtrx{A}$ is symmetric iff $\mtrx{A} = \mtrx{A}^T$



Positive (semi-)definite matrix are a special case of symmetric matrices.
> **Definition** 
> $$\mtrx{A}: \text{PSD} \iff \mtrx{A}: \symm \land \forall z: z^T \mtrx{A} z \geq 0$$
> From the first condition, $\mtrx{A}: \symm$, it follows that the eigenvectors are orthogonal (see [eq.](symm_then_orth)), 
> from the second one, $\forall z: z^T \mtrx{A} z \geq 0$, it follows that the eigenvalues are all greater or equal than $0$ (see eq. \dots).



**Gram matrices** appear often in important theorems. They turn out to be PSD.
> **Definition** 
> A Gram matrix is a matrix $\mtrx{A} = \mtrx{B}^T \mtrx{B}$


> **Theorem**
> $\rank{A} = \rank{A^T A}$


> **Theorem**
> $A^T A: \text{PSD}$



**Orthogonal matrices** make tons of calculations simpler.
> **Definition** [A matrix $\mtrx{A}$ is orthogonal] iff $\forall x_1, x_2 \in \mtrx{A}, x_1 \neq x_2: x_1 \perp x_2$


> **Theorem**
> If $A$ is orthogonal, than $A^{-1} = A^T$.
> This is trivially proven. By the definition of orthogonality we have $\mtrx{A}^T \mtrx{A} = \mtrx{I}$









## Eigenvalues and eigenvectors

$$
    \begin{aligned}
        A e &= \lambda e \\
        ( A - \lambda I ) e &= 0 \\
        \det{A - \lambda I} &= 0 \text{ using theorem det0}
    \end{aligned}
$$

Any *square* matrix can be eigenvector (aka. spectrally) decomposed: $\mtrx{A} = \mtrx{E} \mtrx{\Lambda}\mtrx{E}^{-1}$.



Once at a sprint-discussion I wondered why principal components (see about those later) were all orthogonal. Here's the proof why. (Note that the proof only holds for symmetric matrices - which, in PCA, $C_A$ is indeed symmetric.)
> **Theorem** <a id="symm_then_orth"></a>
> $\mtrx{A}: \symm \to \mtrx{E}_A: \perp$
>
> For any matrix $A$, symmetric or not, and for any vectors $x$ and $y$, eigenvectors or not, it holds:
> $$\forall A, \forall x, y: <Ax, y> = <x, A^Ty>$$
> This is true because 
>    $$
>        \begin{aligned}
>            <x, y>      &= x^T y \\
>            <Ax, y>     &= (Ax)^T y \\
>                        &= x^T A^T y \\
>            <x, A^Ty>   &= x^T A^T y
>        \end{aligned}
>    $$
> Then we can use that finding as follows for $\mtrx{A}: \symm$ and $x, y \in \mtrx{E}_A$:
>    $$
>        \begin{aligned}
>                                                                & <Ax, y>           &= <x, A^Ty> \\
>            \text{Since } A:\symm:                              & <Ax, y>           &= <x, Ay> \\
>            \text{Since } x, y \text{ are eigenvalues of } A:   & <\lambda_x x, y>  &= <x, \lambda_y y> \\
>                                                                & \lambda_x <x, y>  &= \lambda_y <x, y>
>        \end{aligned}
>    $$
> Thus, either $\lambda_x = \lambda_y$ or $x \perp y$ 


> **Theorem**
  >As a corollary, the eigenvalue decomposition can be simplified: $\mtrx{A}: \symm \to \mtrx{A} = \mtrx{X} \mtrx{\Lambda} \mtrx{X}^{-1} = \mtrx{X} \mtrx{\Lambda} \mtrx{X}^T$


**Interpretation of eigenvalues**

- $\lambda$ is complex: $\mtrx{A}$ contains a rotation
- $\lambda$ is negative: $\mtrx{A}$ contains some mirroring
- $\lambda$ is 0: $\det{\mtrx{A}} = 0$, i.e. $\mtrx{A}$ squishes a dimension





## Singular value decomposition
Let $\mtrx{A}$ be of size $m \times n$. We will prove that also such non-square matrices can be decomposed, too, namely into:
$$
    \mtrx{A} = \mtrx{U} \mtrx{\Sigma} \mtrx{V}^T
$$
where:
- $\mtrx{U}$ and $\mtrx{V}$ are orthonormals of sizes $m \times m$ and $n \times n$, respectively
- $\mtrx{\Sigma}$ is a diagonal matrix of size $m \times n$

In other words: 
$$
    \mtrx{A} \mtrx{V} = \mtrx{U} \mtrx{\Sigma}
$$
We'll find an orthonormal basis $\mtrx{V} \subset R_A$ which is transformed into an orthonormal basis $\mtrx{U} \subset C_A$.


We'll work with a practical example alongside the proof. Let $\mtrx{A} = \begin{bmatrix}
  2 & 0 \\
  0 & 1 \\
  0 & 2   
\end{bmatrix}$.

Consider $\mtrx{A}^T \mtrx{A}$. Contrary to $\mtrx{A}$, this is a psd matrix. It has eigenvectors $[\vec{e}_1, \vec{e}_2, ...] = \mtrx{E}_{A^TA} = \begin{bmatrix}
    1 & 0 \\
    0 & 1
\end{bmatrix}$ and eigenvalues 4 and 5.

Now consider the vector $\vec{y}_i = \mtrx{A} \vec{e}_i$. Multiplying both sides with $\lambda_i$ we observe that:
$$
    \begin{aligned}
        \lambda_i \vec{y}_i &= \lambda_i \mtrx{A} \vec{e}_i \\
                            &= \mtrx{A} \lambda_i \vec{e}_i \\
                            &= \mtrx{A} \mtrx{A}^T \mtrx{A} \vec{e}_i \\
                            &= \mtrx{A} \mtrx{A}^T \vec{y}_i
    \end{aligned}
$$
In other words: $\vec{y}_i$ is an eigenvector of $\mtrx{A} \mtrx{A}^T$ with eigenvalue $\lambda_i$.

Indeed: $\mtrx{A} \mtrx{A}^T = \begin{bmatrix}
    4 & 0 & 0 \\
    0 & 1 & 2 \\
    0 & 2 & 4
\end{bmatrix}$ and $\mtrx{A} \mtrx{A}^T \myarray{0 \\ 1 \\ 2} = 5 \myarray{0 \\ 1 \\ 2}$.

A note on the size of $\vec{y}_i$: $|\vec{y}_i| = |\mtrx{A} \vec{e}_i| = \sqrt{|\mtrx{A}\vec{e}_i|^2} = \sqrt{\vec{e}_i^T \mtrx{A}^T \mtrx{A} \vec{e}_i} = \sqrt{\lambda_i} |\vec{e}_i|$.
If we want $\vec{y}_i$ to have normalized size we redefine it as $ \vec{y}_i = \frac{1}{\sqrt{\lambda_i}} \mtrx{A} \vec{e}_i $

Also, if $\lambda_i = 0$ then $\vec{y}_i = \vec{0}$.


Now, let $k = \rank{\mtrx{A}}$ and define the following new matrices:
$$
    \begin{aligned}
        \hat{\mtrx{U}} &= [\vec{y}_i / \text{ where } \lambda_i = 0], \text{ size } m \times k  &= \begin{bmatrix}
                                                                                                        0 & 1 \\
                                                                                                        \frac{1}{\sqrt{5}} & 0 \\
                                                                                                        \frac{2}{\sqrt{5}} & 0
                                                                                                    \end{bmatrix}  \\
        \hat{\mtrx{V}} &= [\vec{e}_i / \text{ where } \lambda_i = 0], \text{ size } b \times k &= \begin{bmatrix}
                                                                                                        1 & 0 \\
                                                                                                        0 & 1
                                                                                                    \end{bmatrix}
    \end{aligned}
$$

Consider $\hat{\mtrx{U}}^T \mtrx{A} \hat{\mtrx{V}} \vec{b}_i$, where $\vec{b}_1 = \myarray{1 \\ 0}, \vec{b}_2 = \myarray{0 \\ 1}$:
$$
    \begin{aligned}
        \hat{\mtrx{U}}^T \mtrx{A} \hat{\mtrx{V}} \vec{b}_i  &= \hat{\mtrx{U}}^T \mtrx{A} \vec{e}_i \\
                                                            &= \frac{1}{\lambda_i} \hat{\mtrx{U}}^T \mtrx{A} \lambda_i \vec{e}_i \\
                                                            &= \frac{1}{\lambda_i} \hat{\mtrx{U}}^T \mtrx{A} \mtrx{A}^T \mtrx{A} \vec{e}_i \\
                                                            &= \frac{1}{\lambda_i} \hat{\mtrx{U}}^T \mtrx{A} \mtrx{A}^T \vec{y}_i \sqrt{\lambda_i} \\
                                                            &= \frac{1}{\sqrt{\lambda_i}} \hat{\mtrx{U}}^T \mtrx{A} \mtrx{A}^T \vec{y}_i \\
                                                            &= \frac{1}{\sqrt{\lambda_i}} \hat{\mtrx{U}}^T \lambda_i \vec{y}_i \\
                                                            &= \sqrt{\lambda_i} \hat{\mtrx{U}}^T \vec{y}_i \text{, now, making use of } \hat{\mtrx{U}} \vec{b}_i = \vec{y}_i \\
                                                            &= \sqrt{\lambda_i} \vec{b}_i
    \end{aligned}
$$
Generally:
$$
    \begin{aligned}
        \hat{\mtrx{U}}^T \mtrx{A} \hat{\mtrx{V}} \mtrx{I} &= \sqrt{\lambda_i} I \\
        \hat{\mtrx{U}}^T \mtrx{A} \hat{\mtrx{V}}   &= \mtrx{\Sigma}
    \end{aligned}
$$
where in our case $\mtrx{\Sigma} = \begin{bmatrix}
    0 & \sqrt{5} \\
    \sqrt{4} & 0 
\end{bmatrix}$

We'll now expand
- $k \times m$ matrix $\hat{\mtrx{U}}$ to $m \times m$ matrix $\mtrx{U} = [\vec{y}_i]$, even where $\lambda_i = 0$
- $k \times n$ matrix $\hat{\mtrx{V}}$ to $n \times n$ matrix $\mtrx{V} = [\vec{e}_i]$, even where $\lambda_i = 0$
- $k \times k$ matrix $\mtrx{\Sigma}$ to $m \times n$ matrix $\mtrx{\Sigma} = \begin{cases}
        \text{if } i = j \land i < k: \sqrt{\lambda_i} \\
        \text{else } 0
    \end{cases}$

With that we obtain
$$
    \mtrx{A} = \mtrx{U} \mtrx{\Sigma} \mtrx{V}^T
$$
In our example case we have 
$$
    \mtrx{\Sigma} = \begin{bmatrix}
        \sqrt{5} & 0 \\
        0        & 0 \\
        0        & \sqrt{4}
    \end{bmatrix}
$$




### Example for a shear-matrix: SVD means that any matrix-transformation can be rewritten as a rotation, scale and another rotation. Even a shear-matrix!
```
M = [
    [1, .5],
    [0, 1]
]

U, S, VT = np.linalg.svd(M)

U @ (np.eye(2) * S) @ VT
```
SVD is often used for image compression, too. Just leave out some lower $\sigma_i$'s, then you can also leave out equally many columns / rows of $U$ and $V^T$, respectively.


### Principal component analysis
Consider a $m \times n$ matrix $\mtrx{A}$. Let $\mtrx{X} = \mtrx{A} - \mtrx{\mu}$, the matrix with its column-mean subtracted.
Then we can express the covariance of $\mtrx{X}$ as $\mtrx{C}_X = \mtrx{X}^T \mtrx{X}$.

We want to find a transformation $\mtrx{P}$ such that $\mtrx{Y} = \mtrx{X} \mtrx{P}$ is uncorrelated. We'll prove that such a matrix does exist.
$$
    \exists \mtrx{P}: \mtrx{Y} = \mtrx{X} \mtrx{P} \land \mtrx{C}_Y: \text{diag}
$$

Try $\mtrx{P} = \mtrx{E}_{C_X}$. Then:
$$
    \begin{aligned}
        \mtrx{C}_Y  &= \mtrx{Y}^T \mtrx{Y} \\
                    &= (\mtrx{X} \mtrx{P})^T \mtrx{X} \mtrx{P} \\
                    &= \mtrx{P}^T \mtrx{X}^T \mtrx{X} \mtrx{P} \\
                    &= \mtrx{P}^T C_\mtrx{X} \mtrx{P} \\
                    &= \mtrx{E}_{C_X}^T C_X \mtrx{E}_{C_X}
    \end{aligned}
$$
Thus $C_Y = \Lambda_{C_X}$, which is diagonal, as required.


Note: Sometimes we care not about $cov(n_1, n_2)$ but about $cov(m_1, m_2)$. Then we use: $\mtrx{X} = \mtrx{A} - \mtrx{\mu}$, the matrix with its *row*-mean subtracted. With that $C_X = \mtrx{X} \mtrx{X}^T$ and $\exists \mtrx{P}: Y = \mtrx{P}\mtrx{X}$. Try $\mtrx{E}_{C_X}$

### Example: Eigenfaces are a very fun example of PCA.

```python
    import numpy as np
    import matplotlib.pyplot as plt
    import imageio
    import os
    
    
    (X, Y, S) = (119, 95, 50)
    P = X * Y
    
    allFaces = np.zeros((P, S))
    for s, path in enumerate(paths[:S]):
        image = imageio.imread(path)
        allFaces[: , s] = image.reshape((P))
    
    meanFace = np.mean(allFaces, axis=1, keepdims=True)
    allFacesNorm = allFaces - meanFace
    cov = allFacesNorm @ allFacesNorm.transpose()
    evals, evecs = np.linalg.eigh(cov, k=cutoff)
    plt.imshow(np.abs(evecs[:, 0].reshape((X, Y))))
    
    cutoff = 100
    evecsC = evecs[:, -cutoff:]


    face = allFaces[:, 45]
    faceEncoded = face @ evecsC
    faceReconstr = meanFace[0, :] + (evecsC @ faceEncoded)
```

**First eigenfaces**
        <img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/eigenface1.png">


**Reconstructing a faces from its percentages of the eigenfaces**
        <img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/eigenface_reconstructed.png">








## Inverse

If $A$ has dimensions $n \times n$, then the inverse $A^{-1}$ such that
$$ A A^{-1} = A^{-1} A = I $$
exists iff $det_A \neq 0$.

**Nonsqare** matrices do not have an inverse, but they might have a right- or left-inverse.
Consider $C = A A^T$. This is a square matrix, so it might have an inverse:
$$ A A^T (A A^T)^{-1} = I $$
Calling $A^T (A A^T)^{-1} = A^{RI}$ the right inverse:
$$ A A^{RI} = I $$
For $C^{-1}$ to exist, we require $C$ to be full-rank, which means that $A$ must be full row rank. This  requires $r \leq c$, in other words, $A$ being a broad matrix.


> If $A^{RI}$ exists, then $A^{LI}$ does not


> $A^{RI}$ is not unique.
>
> Let $A$ be of dimension $r \times c$ and full rank, with $r < c$. By rank nullity we have
>
> $$ n_A = c - r > 0 $$
>
> That is, the nullspace is nonempty. Thus $\exists x : Ax = 0$
>
> Now try $B' = B + x$
>
> We get 
>
> $$ AB' = AB + Ax = I + 0$$
>



















## Applications


### Systems of linear equations
If there are more variables than equations, the system is underdetermined. If there are more eqations than variables, the system is overdetermined. A potentially solveable system is one where there are equally many variables as equations. But even then we must distinguish two cases. 

**Solving well determined systems**
There are two cases: a system is either consistent or inconsistent. The follwing statements are all equivalent, meaning that any one of them is related to any other one in an if-and-only-if way. 

- the system is consistent
- the matrix is invertible
- the determinant is nonzero
- there is exactly one sollution


We proof a few of those equivalences just for the hell of it. 

> There is exactly one solution if and only if the determinant is nonzero.
>> Proof that $|A| = 0 \iff \exists ! \vec{x} : A \vec{x} = \vec{b} $


On the other hand, in the inconsistent case, the follwing statements are equivalent:
- the system is inconsistent
- the matrix is singular (aka. noninvertible)
- the determinant equals zero
- one (or more) row (or column) is lineraly dependent of the others


### Solving overdetermined systems: least squares


### Solving underdetermined systems: geometric bodies
I like to think of underdetermined systems as (linear) geometric bodies, written in their parameterized form. A line in $\reals^3$ is described by a $3 \times 1$ matrix (or rather, it's column space), a plane in $\reals^3$ by a $3 \times 2$ matrix. However, it is important to note one distinction: geometric objects don't need to go through the origin, a matrix system however does. A line that does not go through the origin needs a base vector, like so: 

$$\vec{x} = \begin{bmatrix} \vec{d} \end{bmatrix} \begin{bmatrix} \alpha \end{bmatrix} + \vec{b}$$ 

A plane that does not go through the origin also needs a base vector $\vec{b}$, like so: 

$$\vec{x} = \begin{bmatrix} \vec{p}_1 && \vec{p}_2 \end{bmatrix} \begin{bmatrix} \alpha  \\ \beta \end{bmatrix} + \vec{b}  $$



Here is a problem that bothered me for a while: a line needs one parameter, a plane two. An ellipsoid, too, needs two parameters. Are there any linear geometric objects in $\reals^3$ that require more than three parameters? The answer is: no. Here is the proof. 

> For any $3 \times 4$ matrix, there is a $3 \times 3$ matrix that has the same column space, that is, that describes the same geometrical body. 
>> Proof that $\forall A(3 \times 4) \exists A'(3 \times 3): \colspace{A} = \colspace{A'}$
>>> Let $A_0(3 \times4)$. Proof that $\exists A': \colspace{A_0} = \colspace{A'}$
>>>> We know [from](proofBaseSizeEqualsSpaceDimension) that $\exists \vec{a}_0 \in A_0: \vec{a}_0:ld$. So Try $A' = A_0/\vec{a_0}$.
>>>>
>>>> Indeed, now $A_0$ and $A'$ both form a base of the same space. So they must have the same column space. 


However, there are *non*linear objects in $\reals^3$ that require more than three parameters! Many curves in 3d require many parameters. *But* those curves don't form a vector-space, while lines and planes do (as long as they go through the origin). 


**Summary**
Influence of rank on solutions

|                               | m < n                                     |  m = n  | m > n                                             |
|-------------------------------|-------------------------------------------|---------|---------------------------------------------------|
|                               | n - m free variables                      |         |                                                   |
| r<m                           | m – r conditions on $b \in \colspace{A}$ |         |                                                   |
|                               | 1 pivot per row                           |         |                                                   |
|                               | n – r = n – m free variables              |         |                                                   |
| r = m (full row rank)         | 0 conditions on $b \in \colspace{A}$     |         | X                                                 |
|                               |                                           |         | m – r conditions on $b \in \colspace{A}$         |
| r<n                           |                                           |         | n – r free variables                              |
|                               | X                                         |         | 1 pivot per column                                |
|                               |                                           |         | m – r = m – n conditions on $b \in \colspace{A}$ |
| r = n \\ (full column rank)   |                                           |         | 0 free variables, thus $\nullspace{A} = \{0\}$    |





### Ax = b reduces to A'x' = 0

> **Theorem**
> A problem of the form $Ax = b$ can be re-expressed as $A'x' = 0$, where $A' = [A, -b]$ 
>
> Proof that $A x = b$ can be re-expressed as $A'x' = 0$
>> $A x = b$
>>
>> $A x -b = 0$
>>
>> $A_1 x_1 + A_2 x_2 + ... -b = 0$
>>
>> Let $A' = [A, b]$ and $x_{n+1} = -1$. Then:
>>
>> $A' x' = 0 $
>>
>> Now we can use the nullspace of $A'$ to find the solutionspace of $A$.
>>
>> $\nullspace{[A b]} = \{x' | [A b]x' = 0\}$
>>
>> $ = \{x' | A x'_{1:m} = -b x'_{m+1}\}$
>>
>> A subset of that nullspace equals the solutionset for $A x = b$:
>>
>> $ \nullspace{[A b]} \text{ where } [x'_{m+1} = -1] = \{x'| A x'_{1:m} = b \}$



### Solving Ax = b

> **Theorem**
> If we can only find any one particular solution $x_p$ such that $A x_p = b$, then we get the whole solutionspace as $\nullspace{A} + x_p$.
>
> Let $x_p: A x_p = b$. Proof that $\solspace{A x = b} = \nullspace{A} + x_p$
>> We'll make use of the fact that $\nullspace{A} + x_p = \{ x + x_p | A x = 0 \} = \{ x | A x = A x_p \}$
>>
>> Let $x_0 \in \nullspace{A} + x_p$. Proof that $x_0 \in \solspace{A x = b}$, i.o.w. $A x_0 = b$
>>> $x_0 \in \nullspace{A} + x_p$
>>>
>>> $x_0 \in \{ x + x_p | A x = 0 \}$
>>>
>>> $x_0 \in \{ x | A (x - x_p) = 0 \}$
>>>
>>> Thus $A x_0 = A x_p$
>>>
>>> Since $A x_p = b$, it must be that $ A x_0 = b $.
>>>
>>> Let $x_0 \in \solspace{A x = b}$. Proof that $x_0 \in \nullspace{A} + x_p$, i.o.w. $A x_0 = A x_p$
>>>> Because $x_0 \in \solspace{A x = b}$, we have $A x_0 = b$.
>>>>
>>>> Also, it was given that $A x_p = b$.






### Matrix factorisation

**Eigenvalue decomposition**
$$ A = V \Lambda V^{-1} $$

**Singular value decomposition** is eigenvalue decomposition, generalized to non-square matrices.
$$ A = U \Sigma V^T $$

**Nonnegative matrix factorisation**: Consider a dataset $A$, mapping people (rows) to properties (columns). You are looking for some hidden, small set of features, that groups of people have in common. 
In neural networks we can reconstruct images from a minimal amount of hidden features by funnelling the image through a very small hidden layer out to a large output layer. We can do the very same thing here!
$$ A = U V $$
Where $A$ has dimension $r \times c$, $U$ associates people with their hidden features/groups $r \times f$ and $V$ associates features/groups with the properties $f \times c$.
