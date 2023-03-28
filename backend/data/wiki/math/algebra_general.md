$$
\def\diff{\mathop{d}}
\def\samplespace{\Omega}
\def\outerprod{\wedge}
\def\innerprodbr{< #1 , #2 >}
$$



# General algebra
In the following sections, we will take care to differentiate between the definition of a concept (like of an inner product) and its implementation. The definition of an inner product is based on properties that a thing has to fulfill, whereas the implementation begins with a definition and is then followed by a proof that the properties hold under that definition.

We will mention the following implementations: the vector-space of coordinate free oriented lengths, the vector-space $\reals^n$, which is the same as oriented length but put inside of a coordinate system(euclidean or angular), the vector-space of matrices, and $C_{[a,b]}$, the vector-space of continuous functions.

# Vector spaces
 

> **Definition** [Vector space] A **vector space** $V$ is a set closed over two operations: scalar multiplication and vector addition. These two operations must fulfill the following properties:

- $V$ is closed under scalar multiplication and vector-addition: $a\vec{v} \in V, \vec{v} + \vec{w} \in V$
- vector-addition is commutative: $\vec{v} + \vec{w} = \vec{w} + \vec{v}$
- vector-addition is associative: $(\vec{u} + \vec{v}) + \vec{w} = \vec{u} + (\vec{v} + \vec{w})$
- $\vec{0}$ is the additive identity: $\vec{v} + \vec{0} = \vec{v}$
    
- $a(b\vec{v}) = (ab)\vec{v}$
- Vector-addition and scalar-multiplication are distributive (part 1): $a(\vec{v} + \vec{w}) = a\vec{v} + a\vec{w}$
- Vector-addition and scalar-multiplication are distributive (part 2): $(a+b)\vec{v} = a\vec{v} + b\vec{v}$



The most common vector-spaces are certainly $\reals^n$ and function-spaces.
The implementations of the above defined scalar product and vector addition are trivial.


```typescript

export abstract class VectorSpace<Vector> {
    abstract create(data: any): Vector
    abstract add(a: Vector, b: Vector): Vector
    abstract isElement(u: any): u is Vector
    abstract equals(a: Vector, b: Vector): Boolean
    abstract zero(): Vector
    /** scalar product */
    abstract sp(scalar: number, v: Vector): Vector
    abstract random(): Vector
}


describe(`Testing if ${name} is a proper vector-space`, () => {

    // Part zero: closedness
    
    test('closed under vector addition', () => {
        const v1 = a.random();
        const v2 = a.random();
        const v3 = a.add(v1, v2);
        expect(a.isElement(v3));
    })

    test('closed under scalar product', () => {
        let v = a.random();
        let alpha = 0.5;
        let u = a.sp(alpha, v);
        expect(a.isElement(u));
    })

    // Part one: vector addition properties

    test('vector addition is associative: (v + u) + w = v + (u + w)', () => {
        const v = a.random();
        const u = a.random();
        const w = a.random();
        const s1 = a.add(a.add(v, u), w)
        const s2 = a.add(v, a.add(u, w))
        expect(a.equals(s1, s2));
    })

    test('vector addition is commutative: v + u = u + v', () => {
        const v = a.random();
        const u = a.random();
        const s1 = a.add(v, u);
        const s2 = a.add(u, v);
        expect(a.equals(s1, s2));
    })

    test('additive identity: v + 0 = v', () => {
        const zero = a.zero();
        const v = a.random();
        const s = a.add(v, zero);
        expect(a.equals(v, s));
    })

    // Part two: scalar-product and vector-addition are distributive

    test('scalar-product and vector-addition are distributive: a(v + u) = av + au', () => {
        const v = a.random();
        const u = a.random();
        const alpha = 0.1;
        const beta = 2.4;

        const r1 = a.sp(alpha, a.add(v, u));
        const r2 = a.add(a.sp(alpha, v), a.sp(alpha, u));
        expect(a.equals(r1, r2));

        const r3 = a.sp((alpha + beta), v)
        const r4 = a.add(a.sp(alpha, v), a.sp(beta, v));
        expect(a.equals(r3, r4));
    })
})

```




## Subspaces of vector-spaces
A set $U$ is a subspace of a vector-space $V$, iff $U \subset V$ and $U$ is a vector-space.








## linear independence
The elements in $A$, a subset of a vector-space, are linearly independent iff $\forall \alpha_1, ...,\alpha_n: [( \sum \alpha_i \vec{a}_i = 0 ) \iff ( \alpha_1 = \alpha_2 = ... = 0 )]$. Note that this reduces automatically to $\forall \alpha_1, ...,\alpha_n: [\sum_i^n \alpha_i b_i = 0 \to (\alpha_1 = ... = \alpha_n = 0)]$, because the $\leftarrow$ case is always true. 

Consequently, linear dependence is defined as $B:ld \equiv \exists\alpha_1, ..., \alpha_2: [(\alpha_1 \neq 0 \lor ... \lor \alpha_n \neq 0) \land ( \sum_i^n \alpha_i b_i = 0 )]$.



> Prove that iff $B:ld$, then one of the elements of $B$ is a linear combination of the others. 

Consider the span of two integers (like in the die-hard water-jug problem). They are always linearly dependent. For example a base $B = [2, 3]$ is linearly dependent because $\frac{-3}{2}2 + 1\cdot3 = 0$.





## Bases
A set $B$ is a base to a vector-space $V$ iff $ B \subseteq V \land  \forall v \in V: \exists! \alpha_1, ..., \alpha_n : v = \sum_i \alpha_i b_i $. It is easy to prove that this means that
$ B:baseV \iff ( B:li \land B:spanV ) $. 


> **Definition** [The dimension of a vector-space $S$]
    is defined as the size of its base $B_S$: $dim_S = |B_S|$. 

That means to get a base for $\reals^2$, we never need more than two vectors. We'll prove this for the example of $S = \reals^2$:

> <a id="proofBaseSizeEqualsSpaceDimension"></a>
> For any three vectors chosen from $\reals^2$, at least one must be a linear combination of the others.
>> Assume that $\vec{a}, \vec{b}, \vec{c} \in \reals^2$ Proof that $\vec{a}:ld(\vec{b}, \vec{c}) \lor \vec{b}:ld(\vec{a}, \vec{c}) \lor \vec{c}:ld(\vec{a}, \vec{b})$ 
>>>
>>> Without loss of generality, assume $ \vec{a}:li(\vec{b}, \vec{c}) $ and $\vec{b}:li(\vec{a}, \vec{c})$. Proof that $\vec{c}:ld(\vec{a}, \vec{b})$
>>>   
>>>> $\vec{a}$ and $\vec{b}$ form a base for $\reals^2$. That means any $\vec{x} \in \reals^2$ is a linear combination of these two ... including $\vec{c}$.


> **Theorem**
>    [Every vector-space has a basis]


> **Theorem**
>    [All bases of a vector-space $S$ have the same size]










# Inner product spaces
Vector spaces don't define anything about lengths, angles or projections. This lack is alleviated by adding a inner product. 

> **Definition** [Inner product space] The inner product is defined as any operation that has the following properties:

 - $(a\vec{u}) \cdot \vec{v} = a (\vec{u} \cdot \vec{v}) $
 - $(\vec{u} + \vec{v}) \cdot \vec{w} = \vec{u} \cdot \vec{w} + \vec{v} \cdot \vec{w}$
 - $\vec{u} \cdot \vec{v} = \vec{v} \cdot \vec{u}$
 - $\vec{v} \neq \vec{0} \to \vec{v} \cdot \vec{v} > 0$



In inner product spaces, we can define norms, orthogonality, and angles. 

As for norms:

$$ |\vec{v}|^2 = \vec{n} \cdot \vec{n} $$

And orthogonality:

$$ \vec{v} \perp \vec{u} \iff \vec{v} \cdot \vec{u} = 0$$

And finally angles: 

$$ cos\theta = \frac{\vec{v} \cdot \vec{u}}{|\vec{v}||\vec{u}|}$$


```typescript
export abstract class InnerProductSpace<Vector> extends VectorSpace<Vector> {
    /** inner product */
    abstract ipr(a: Vector, b: Vector): number;

    /** |v| */
    norm(v: Vector): number {
        return this.ipr(v, v);
    }

    orthogonal(u: Vector, v: Vector): Boolean {
        return this.ipr(u, v) === 0;
    }

    angle(u: Vector, v: Vector): number {
        const enumerator = this.ipr(u, v);
        const denominator = this.norm(u) * this.norm(v);
        const cosTheta = enumerator / denominator;
        const theta = Math.acos(cosTheta);
        return theta;
    }
}

describe(`Testing if ${name} is a proper inner product space`, () => {

    test("Inner-product and scalar-product are associative: (au).v = a(u.v)", () => {
        const u = i.random();
        const v = i.random();
        const alpha = Math.random();
        const p1 = i.ipr( i.sp(alpha, u), v);
        const p2 = alpha * i.ipr(u, v);
        expect(p1 === p2);
    })

    test("Inner-product and vector-addition are distributive: (u + v).w = u.w + v.w", () => {
        const u = i.random();
        const v = i.random();
        const w = i.random();
        const p1 = i.ipr( i.add(u, v), w )
        const p2 = i.ipr(u, w) + i.ipr(v, w);
        expect(p1 === p2);
    })

    test("Inner-product is commutative: u.v = v.u", () => {
        const u = i.random();
        const v = i.random();
        const p1 = i.ipr(u, v);
        const p2 = i.ipr(v, u);
        expect(p1 === p2);
    })

    test("Inner-product > 0", () => {
        const u = i.random()
        const z = i.zero();
        if (!i.equals(u, z)) {
            const p = i.ipr(u, u);
            expect(p > 0.0);
        }
    })
});

```




As one nice little application, consider this statement. 
> Suppose $|\vec{u}| = |\vec{v}|$. Prove that $\vec{u} + \vec{v} \perp \vec{u} - \vec{v}$
>> This is to prove that $(\vec{u} + \vec{v}) \cdot (\vec{u} - \vec{v}) = 0$
>>
>> The above can be rewritten to $ \vec{u} \cdot \vec{u} - \vec{u} \cdot \vec{v} + \vec{v} \cdot \vec{u} - \vec{v} \cdot \vec{v} $
>>
>> The two middle terms cancel out, and the two outer terms equal $ |\vec{u}|^2$ and $|\vec{v}|^2 $, respectively.
>>
>> Usign the given, these terms are equal.


Other properties of the norm are also easily proved:


 - $|a\vec{v}| = |a||\vec{v}|$
 - $|\vec{v} + \vec{w}| = |\vec{v}| + |\vec{w}|$
 - $|\vec{v}| \geq 0$
 - $|\vec{v}| = 0 \iff \vec{v} = \vec{0}$


Two more important statements that can be proven for the general inner product spaces are the pythagorean theorem and the Cauchy-Schwartz inequality. 


> **Pythagorean theorem**
>
> Suppose $\vec{u} \perp \vec{v}$. Prove that $|\vec{u}|^2 + |\vec{v}|^2 = |\vec{u} + \vec{v}|^2 $.  ...


> **Cauchy-Schwartz inequality**
> Prove that $|\vec{u}||\vec{v}| \geq |\vec{u} \cdot \vec{v}| $



An implementation of this inner product in dimension-free oriented length-space would be:

$$\vec{v} \cdot \vec{w} = |\vec{v}||\vec{w}|cos\theta$$

Based on this definition, the projection of $\vec{v}$ onto $\vec{u}$ is defined as: 

$$ P_{\vec{u}}(\vec{v}) = |\vec{v}| cos\theta \frac{\vec{u}}{|\vec{u}|} = \frac{\vec{u} \cdot \vec{v}}{|\vec{u}|^2} \vec{u} $$

The direct equivalent of this inner product from oriented length space to $\reals^n$ would be:

$$ \vec{v} \cdot \vec{w} = \sum_n v_n w_n $$

The following is a proof that the two implementations of inner product are equivalent. 


>Suppose $\vec{u} = u_1 \vec{e_1} + u_2 \vec{e_2} + u_3 \vec{e_3} $ and $\vec{v} = v_1 \vec{e_1} + v_2 \vec{e_2} + v_3 \vec{e_3} $. Proof that $\vec{u} \cdot \vec{v} = \sum_n v_n u_n$
>
>> $ \vec{u} \cdot \vec{v} = (u_1 \vec{e_1} + u_2 \vec{e_2} + u_3 \vec{e_3}) \cdot (v_1 \vec{e_1} + v_2 \vec{e_2} + v_3 \vec{e_3}) $ 
>>     
>> This is written out as $u_1 v_1 (\vec{e_1}\cdot \vec{e_1}) + u_1 v_2 (\vec{e_1}\cdot \vec{e_2}) + ...$     
>> Of this, almost all terms cancel out, leaving $ u_1 v_1 + u_2 v_2 + u_3 v_3 $


Note that if we were to chose a *non*orthonormal basis, the inner product would not be reduced so nicely.



**Important implementations of vector spaces, inner product spaces and algebras**
|                     | Vector space                     | Inner product space                     | Algebra                        |                       |                                                      |
|---------------------|----------------------------------|-----------------------------------------|--------------------------------|-----------------------|------------------------------------------------------|
|                     | scalar prod                      | addition                                | inner prod                     | norm                  | outer prod                                           |
| $\reals^n$          |                                  |                                         | $\sum_n u_i v_i$               | $\sqrt{\sum_i v_i^2}$ |                                                      |
| $\reals^n$ in polar |                                  |                                         |                                |                       |                                                      |
| $C_{[a,b]}$         |                                  |                                         | $\int_a^b u(t) v(t) \diff{t} $ |                       |                                                      |
| $X$ on $\samplespace$ |                                  |                                         | E[XY]                          | E[X]                  |                                                      |
| matrices            |                                  |                                         |                                |                       | $(\sum_x \sum_y a_x b_y)_{i,j}$ (aka.linear algebra) |
| $G^3$               |                                  |                                         | $\vec{v} \cdot \vec{u}$   |                       | $\vec{v} \outerprod \vec{u}$ (aka.geometric algebra) |
| $\reals$            |                                  |                                         |                                |                       | (aka. ordinary algebra)                              |
| Booleans            |                                  |                                         |                                |                       | (aka. boolean algebra)                               |


A few comments to the different spaces shown here. $X$ on $\samplespace$ is a inner product space very similar to $C_{[a,b]}$, but note that $\samplespace$ itself is not necessarily even a vector-space.


Here is one more example of an inner product. Consider the vector-space $L^2(\reals^2 \to \reals^3)$, that is, the space of square-integrable functions that take two input arguments $\vec{x}$ and return a 3-vector $\vec{y}$. How would you define an inner product to turn this into an inner-product-space? Well, the choice is up to you, but most often one choses: 

$$ <f, g> := \int_{\reals^2} <f(\vec{x}), g(\vec{x})>_i \diff{\vec{x}} $$

, where $ <\vec{a}, \vec{b}>_i$ is defined as $\sum_{i=0}^3 a_i b_i$. You can prove for yourself that this is indeed an inner product! 














## Excursion: More on orthogonality and preview of function decompositions

Orthogonality turns out to be an important concept for statistics and signal analysis, so we'll look at it in a little more detail here. Why is orthogonality so important though? Linear independence allows us to take a complex signal and decompose it into simpler, independent parts. Orthogonality ensures that these parts are easy to calculate. 

Although conceptually similar, orthogonality is a stricter concept than linear independence. It requires an inner product space instead of just a vector space. Also, two vectors may be linearly independent, but not orthogonal (although we can use Gram-Schmidt orthogonalization to make any li vectors orthogonal).

> If a set of vectors is orthogonal, then it is linearly independent: $B:orth \to B:li$.
>> Suppose that $\forall b_i, b_j \in B: b_i \cdot b_j = 0$. Proof that $\forall \alpha_1, ..., \alpha_n: \sum \alpha_i b_i = 0 \to \alpha_1 = ... = \alpha_n = 0$
>>    
>>> Let $\alpha_1^0, ..., \alpha_n^0$ be chosen. Suppose $\sum \alpha_i^0 b_i = 0$. Proof that $\alpha_1 = ... = \alpha_n = 0$
>>>
>>>> Proof that $\alpha_j^0 = 0$ for any $j \in [1, n]$
>>>>            
>>>> $$ \sum \alpha_i^0 b_i = 0 $$
>>>> Multiplied by $b_j$:
>>>> $$ \sum \alpha_i^0 b_i \cdot b_j = 0 \cdot b_j $$
>>>> With $B:orth$:
>>>> $$ \alpha_j^0 = 0 $$

This is profound. For example, the cos-sin-Fourier-basis is hard to prove to be linearly independent. But we can use the *stricter* property of orthogonality to prove that it must also be linearly independent. 

> It is good to know that although orthogonality helps us to prove linear independence, it doesn't help us to prove that a set is a base, because for that we also need the set to span the whole space. 
>> In the infinite dimensional case, a orthogonal set $B \subseteq V$ does not have to be a base of $V$. A good example would be a set of linear functions in $V = C_{[a,b]}$ - they can never span quadratic functions. 


### Fourier decomposition <a id="fourierDecomposition"></a>
In every vector-space a vector can be expressed as a sum of the basevectors like this: $v = \alpha_1 b_1 + \alpha_2 b_2 + ...$ If the base is orthonormal, we additionally get the benefit that the coefficients $\alpha$ are very easy to calculate: $\alpha_i = v \cdot b_i$. This way of calculating the coefficients is called the Fourier decomposition. 

> Let $B$ be an orthonormal base of $V$. Then for any $\vec{v} \in V$ the $n$th coefficient $\alpha_n$ can be easily calculated as $<\vec{v}, \vec{b_n}>$
>
>> For any vector-space it holds that $\forall \vec{v} \in V: \exists\alpha_1, ..., \alpha_N: \sum \alpha_k \vec{b_k} = \vec{v}$.
>> Suppose $B$ to be orthonormal.
>> Proof that $ \alpha_n = <\vec{v}, \vec{b_n}> $ 
>>
>>> $ <\vec{v}, \vec{b_n}> = <\sum \alpha_k \vec{b_k}, \vec{b_n}> $
>>>
>>> $ = \alpha_0 <\vec{b_0}, \vec{b_n}> + \alpha_1 <\vec{b_1}, \vec{b_n}> + ... + \alpha_n <\vec{b_n}, \vec{b_n}> + ... + \alpha_N <\vec{b_N}, \vec{b_n}>$
>>>
>>> $ = \alpha_0 0 + \alpha_1 0 + ... \alpha_n 1 + ... \alpha_N 0$

This is much easier than the case where the base is *not* orthonormal. If that is the case, we have to calulate the coefficients $\alpha_n$ by using the projections: 

$$ \vec{v} = \sum \alpha_k \vec{b_k} \text{, with } \alpha_k = \gamma_k P_{\vec{b_k}}(\vec{v}) =  \gamma_k \frac{\vec{b_n} \cdot \vec{v}}{|\vec{b_n}|^2}\vec{b_n} \text{, with  $\gamma_k$ to be determined.}$$

An alternative, but equally expensive method would be to use linear algebra:

$$ \vec{v} = [\vec{b_1}, \vec{b_2}, ..., \vec{b_N}  ] \vec{\alpha} $$

Calling the matrix $[\vec{b_1}, \vec{b_2}, ..., \vec{b_N}  ]$ the basematrix $B$, we get: 

$$ \vec{v} = B \vec{\alpha} $$
$$ B^{-1} \vec{v} = \vec{\alpha} $$

This looks simple enough, but unfortunately, inverting a matrix is a \BigTheta{N^3} operation, and matrix multiplication is still a \BigTheta{N^{>2.3}} operation. Contrary to that, the evaluation of a polynomial is a \BigTheta{N} operation when using Horners method. 

### Gram-Schmidt orthogonalization For every set of li vectors we can find a set of orthogonal vectors like this: 

 - $b_1 = v_1$
 - $b_2 = v_2 - prj(v_2, b_1) = v_2 - \frac{v_2 \cdot b_1}{b_1 \cdot b_1}b_1$
 - $b_3 = v_3 - prj(v_3, b_2) - prj(v_3, b_1)$
 - ...


**Orthogonal complement**


# Linear maps and how they yield matrices
A linear map is a function $f$ from vector-space $A$ to vector-space $B$ that:
 - ... preserves vector-addition: $f(u+v) = f(u) + f(v)$
 - ... preserves scalar-product: $f(\alpha v) = \alpha f(v)$

```typescript
export type LinearMap<VectorA, VectorB> = (a: VectorA) => VectorB;

type LinMapStruct<S, D> = {
    sourceVectorSpace: VectorSpace<S>,
    destinationVectorSpace: VectorSpace<D>,
    linMap: LinearMap<S, D>
}

for (const key in lmps) {
    const {sourceVectorSpace: s, destinationVectorSpace: d, linMap} = lmps[key];

    describe(`Testing that ${key} is a linear map`, () => {
        
        it(`Preserves addition`, () => {
            const a = s.random();
            const b = s.random();
            const f_ab = linMap(s.add(a, b));
            const fa_fb = d.add(linMap(a), linMap(b));
            expect(d.equals(f_ab, fa_fb));
        });

        it(`Preserves scalar-product`, () => {
            const a = s.random();
            const alpha = Math.random();
            const f_alpha_a = linMap(s.sp(alpha, a));
            const alpha_fa = d.sp(alpha, linMap(a));
            expect(d.equals(f_alpha_a, alpha_fa));
        });
    }); 
}
```

## Constructing matrices
Assume that the vector-space $V$ is of finite dimension and has a basis $B_V = (b_{v1}, b_{v2}, ...)$.
So does the vector-space $W$ with basis $B_W = (b_{w1}, b_{w2}, ...)$.
Let $f$ be a linear map $V \to W$.

Then: 
$$\forall v \in V: v = \alpha_1 b_{v1} + \alpha_2 b_{v2} + ...$$
$$f(v) = \alpha_1 f(b_{v1}) + \alpha_2 f(b_{v2}) + ...$$
$f(b_{vj}) \in W$. As such: 
$$f(b_{vj}) = \beta_{1j} b_{w1} + \beta_{2j} b_{w2} + ...$$
Define the matrix $F$ as 
$$
F = \begin{bmatrix}
    \beta_{11} & \beta_{12} & ... \\
    \beta_{21} & \beta_{22} & ... \\
    ... 
\end{bmatrix}
$$


## Matrices are a vector-space by themselves

## Matrix multiplication is a chain of linear maps



# Multilinear maps and how they yield tensors
A linear map is a mapping $V \to W$.
A multi-linear map is a mapping $V_1 \times V_2 \times ... V_n \to W$.
The *linear* part is fulfilled if 