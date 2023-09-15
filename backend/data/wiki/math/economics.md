# Economics

# Value, consumer-surplus and demand

- $v(q)$: **marginal value**, i.e. $\frac{\partial \text{happyness}}{\partial q}$
- $cs(q) | p$: **consumer surplus**, defined as $cs(q) | p = \int^{q}v d q - pq$
- $\frac{\partial cs}{\partial q_0} = 0 \to v(q_0) = p$
- $q_0 = v^{-1}(p)$, we call $v^{-1}(p)$ the **demand** $q^{demand}(p)$.


Corollaries
- Increase in usefulness of any one unit: curve moves up
- More units demanded: curve moves right


Special cases:
- *Normal* goods: higher income leads to higher demand
- *Inferior* goods: higher income doesn't lead to higher demand
- *Complementary* goods: higher consumption of *A* leads to higher demand for *B*
    - Example: use of computers increases demand for printers.
- *Substitute* goods
    - Example: cola and pepsi

# Cost, producer-surplus (aka. profit) and supply

- $c(q)$: **marginal costs**, i.e. $\frac{\partial \text{total production costs}}{\partial q}$
- $ps(q) | p$: **producer surplus**, aka. profit, defined as $ps(q) | p = pq - \int^{q}c d q$
- $\frac{\partial ps}{\partial q_0} = 0 \to  p = c(q_0)$
- $c^{-1}(p) = q_0$, we call $c^{-1}$ the **supply** $q^{supply}(p)$.


# Markets

**Theorem 1**: In a free market, we have $p: q^{supply}(p) = q^{demand}(p)$
>
> *Proof*: By contradiction
>
>> *Case 1*: assume that $p: q^{supply}(p) < q^{demand}(p)$
>>
>> This is a market of shortage. $q$ is determined by the producers: producers will be able to produce a quantity such that their producer-surplus is maximal ... whereas the consumer-surplus might not be.
>>

>
>> *Case 2*: assume that $p: q^{supply}(p) > q^{demand}(p)$
>>



**Theorem 2**: In a free market, the market-equilibrium is where *social welfare* (consumer- plus producer-surplus) is maximized.
>
> *Proof*: 
>





# Producer theory

## 1: Production functions

- $bgt$: budget
- $p_L$: price of labor (wages), $p_K$: price of capital (rent)
- $K$: quantity of capital
- $L$: quantity of labor
- $q(K, L)$: quantity of product
- profit $\pi(K, L) = pq(K, L) - Lp_L - Kp_K$


**Perfectly substitutable production**:
$$q(L, K) = L + K$$
Example: tractors and farmhands.

**Perfectly non-substitutable production (aka. perfect complements, aka. Leontief)**:
$$q(L, K) = min(L, K)$$
Example: computers and programmers.

- $L_{opt} = K_{opt} = \frac{bgt}{p_L + p_K}$
- $\frac{\partial L_{opt}}{\partial p_L} = - \frac{bgt}{(p_L + p_K)^2}$


**Somewhere in between: Cobb-Douglas production**
$$ q(L, K) = L^aK^{1-a} $$
Maximizing this utility function $u'$ subject to the budget-constraint (using constrained optimization) we get:
- optimize $q(K, L) = L^aK^{1-a}$ subject to $w$, being $w := Lp_L + Kp_K - bgt = 0$
- We find $K \frac{a}{1-a} \frac{p_K}{p_L} = L$
- $ L_{opt} = \frac{bgt \cdot a}{p_L} $
- $ K_{opt} = \frac{bgt \cdot (1 - a)}{p_K} $
- $ q(L_{opt}, K_{opt}) = bgt (\frac{a}{p_L})^a (\frac{1-a}{p_K})^{1-a}$


More generally:
$$ \forall i: x_i^{opt} = \frac{bgt \cdot \alpha_i}{p_i} $$


## 2. Concepts:
- Marginal utility of labor: $\frac{\partial q}{\partial L}$
- Complements: $\frac{\partial^2 q}{\partial K \partial L} > 0$
    - Interpretation: $\frac{\partial^2 q}{\partial K \partial L} = \frac{\partial}{\partial K}$ marginal utility of labor
    - That means: increasing capital makes also labor more valuable
    - If that is the case, labor and capital are compliments.

## 3. Theorems:

**Theorem 3**: In a free market, a firm produces an output where $\frac{\partial c}{\partial q} = p$
>
> *Proof*: 
>
> $\pi(q) = pq - c(q)$
>
> $\frac{\partial \pi}{\partial q} = 0 \to p = \frac{\partial c(q)}{\partial q}$



# Producers to markets
https://ocw.mit.edu/courses/14-01-principles-of-microeconomics-fall-2018/resources/lec-6-costs/

How does the suply curve get its upwards slope?
We want to get the function $q_{supply}(p)$.

It's surprisingly hard to find that function!
1. First attempt: $q: \frac{\partial \pi}{\partial q} = 0$
    - leads to $p = 0$ ... which is of course not helpful.
2. Second attempt: maybe a bit more specific, with $q: \frac{\partial \pi}{\partial K} = 0 \land \frac{\partial \pi}{\partial L} = 0$ and using Cobb-Douglas:
    - $\pi(K, L)$ has no global maximum - is continously growing. 
3. Third attempt: maybe when accounting for the $bgt$ constraint?
    - $ q(L_{opt}, K_{opt}) = bgt (\frac{a}{p_L})^a (\frac{1-a}{p_K})^{1-a}$
    - But this is not a function of $p$!



Instead, a step-by-step derivation is required. 

Example with Cobb-Douglas:

**Step 1: optimal supply in the short term**

Optimizing profit $\pi$ with constant $K_0$ leaves only room to vary $L$: $\frac{\partial\pi}{\partial L} = 0$

- $p \frac{\partial q}{\partial L} = p_L$
- $L^{opt} |K_0 = (\frac{p_L}{pa})^{\frac{1}{a-1}}K_0$
- $q^{opt}(p)|K_0 = (\frac{p_L}{pa})^{\frac{a}{a-1}}K_0 = (\frac{pa}{p_L})^{\frac{1-a}{a}} K_0$

**Step 2: optimal supply in the long term**















<br/><br/><br/><br/><br/><br/><br/><br/>


# My own notes:

### Effect of wages on employment:
Example:
```python
def isoq(K, q, a):
    return np.power(q * np.power(K, a-1), 1/a)

def bdgt(b, pL, pK, K):
    return (b - K * pK) / pL

def Lopt(b, a, pL):
    return b * a / pL

def Kopt(b, a, pK):
    return b * (1 - a) / pK

def prod(L, K, a):
    return np.power(L, a) * np.power(K, 1-a)

bgt = 10
a = 2/3
pK = 2
pL1 = 3

L1 = Lopt(bgt, a, pL1)
K1 = Kopt(bgt, a, pK)
q1 = prod(L1, K1, a)

pL2 = pL1 + 1
L2 = Lopt(bgt, a, pL2)
K2 = Kopt(bgt, a, pK)
q2 = prod(L2, K2, a)

Kdomain = np.linspace(0.5, 5, 100)
budgetLine1 = bdgt(bgt, pL, pK, Kdomain)
isoquant1 = isoq(Kdomain, q1, a)
budgetLine2 = bdgt(bgt, pL2, pK, Kdomain)
isoquant2 = isoq(Kdomain, q2, a)

plt.plot(Kdomain, budgetLine1, color="r", label="budget line")
plt.plot(Kdomain, isoquant1, color="b", label="isoquant")
plt.plot(Kdomain, budgetLine2, color="r")
plt.plot(Kdomain, isoquant2, color="b")
plt.xlabel("K")
plt.ylabel("L")
plt.vlines([K1, K2], ymin=[0, 0], ymax=[L1, L2], linestyles='dotted', label="K_{opt}")
plt.hlines([L1, L2], xmin=[0, 0], xmax=[K1, K2], linestyles='dotted', label="L_{opt}")
plt.legend()
```



<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/economics_production_theory0.png" width="80%">





How does increase in wages affect employment?
- If labor and capital are substitutable (*example: workers or machine to build cars*):
    - if labor initially cheap, now a bit more expensive:
        - producers only use labor, not machines
        - producers will reduce employers proportionally to the wage-increase
    - if labor initially expensive, now a bit more expensive:
        - producers never had any workers in the first place, because capital was more efficient 
        - so no reduction in employment.
- If labor and capital are non-substitutable (*example: programmers and computers to build software*):
    - if labor initially cheap, now a bit more expensive:
        - producers use computers and programmers in equal amounts 
        - they also reduce them in equal amounts
        - one unit change in wages means much change in both employment and capital
    - if labor initially expensive, now a bit more expensive:
        - producers use computers and programmers in equal amounts
        - they also reduce them in equal amounts
        - one unit change in wages means little change in neither employment nor capital



