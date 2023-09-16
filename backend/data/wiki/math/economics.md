# Economics

Terminology:
- Price $p$
- Each firm has a production function $q(L, K)$
    - where $L$ is *labor*, coming at a cost $w$(ages)
    - and $K$ is *capital*, costing $r$(ent)
    - thus the firms cost is $c(L, K) = wL + rK$
    - labor can be adjusted in the short term, capital only in the long term
- Each firm tries to maximize profit $\pi = pq(L, K) - c(L, K)$

# The steps of the game

1. **Short term**:
    - Givens:
        - There are *n* firms and *m* consumers
        - Each firm has some fixed capital $K_0$
    - Derived:
        - Consumers:
            - ...
        - Producers:
            - Each firm calculates their costs $c(q | K_0)$
            - Each firm decides how much they would produce for a price using profit-optimization, yielding $MC = p$, yielding $q_{opt}(p |K_0)$
                - Additionally, each firm might decide not to produce anything in this round (shutdown-condition) if the price falls below a certain threshold.
            - The market-supply is just the sum of the individual supplies: $q_{sup}(p) = \sum q_i(p)$
        - Market:
            - The market-price $p_0: q_{sup}(p) = q_{dmd}(p)$
2. **Long term**:
    - Each firm is given the opportunity to exit the market 
    - Each firm is given the opportunity to pick a number of capital $K$ to use for the next short term
        - For this they will minimize cost $c(q, K, L)$, which requires them to have $\frac{\partial q}{\partial L} \frac{1}{w} = \frac{\partial q}{\partial K} \frac{1}{r}$
    - If the average profit is positive, a new firm may enter the market.






# Producer theory

## Short term

The firm observes the market price $p$. In a perfectly competitive market, the firm has no influence on $p$.

The firm produces a quantity $q$ to maximize profit  $\pi$.
They have a fixed amount of capital, so they can only change labor to get the maximizing quantity.

$$ \pi(q|K_0) = pq(L|K_0) - c(L|K_0)$$
$$ \frac{\partial \pi}{\partial q} = 0 \to p = \frac{\partial c(L|K_0)}{\partial q}$$
$$ c(L|K_0) = rK_0 + w L^{req}(q|K_0)$$
$$ p = w \frac{\partial L^{req}(q|K_0)}{\partial q} $$

This equation is solved for $q$, yielding $q(p|K_0)$, the short run supply.

$\frac{\partial c(L|K_0)}{\partial q}$ is called the *marginal cost* (MC). We see here that the marginal cost is the inverse of the short term supply.

>**Example calculation with Cobb-Douglas**:
>
> $q = L^a K_0^{1-a}$
>
> $L^{req}(q|K_0) = q^\frac{1}{a} K_0^\frac{a-1}{a}$
> 
> $p = w \frac{\partial L^{req}(q|K_0)}{\partial q} = \frac{w}{a} q^\frac{1-a}{a} K_0^\frac{a-1}{a}$
>
> Solving for $q$:
>
> $ q(p|K_0) = (\frac{p a}{w})^\frac{a}{1-a} K_0 $


#### Shutdown condition
Independent of the marginal cost, a firm might chose not to produce anything at all in a round. That would be the case when their income would not even cover ...
...

## Long term

Again the firm observes the market price $p$. In a perfectly competitive market, the firm has no influence on $p$.


In the long term, the firm can set both $L^{opt}$ and $K^{opt}$ to the optimal values given $p$ (not just to the short-term *required*, but long-term sub-optimal $L^{req}$).

Assuming that the firm wants to produce $q_0$ goods, the firm will want to minimize $c(L, K)$ subject to $q(L, K) = q_0$. This is solved with constrained optimization:

$$ \nabla c(L, K) = \lambda \nabla (q(K, L) - q_0) $$
$$ q(K, L) = q_0 $$

Written out, this gives us the three equations:
$$ \frac{\partial c}{\partial L} = \lambda \frac{\partial q(L, K)}{\partial L} $$ 
$$ \frac{\partial c}{\partial K} = \lambda \frac{\partial q(L, K)}{\partial K} $$ 
$$ q(K, L) = q_0 $$

And equating $\lambda$:
$$ \frac{\partial q(L, K)}{\partial L} \frac{1}{w} = \frac{\partial q(L, K)}{\partial K} \frac{1}{r} $$


> **Example calculation with Cobb-Douglas**:
>
> $q(L, K) = L^a K^{1-a}$
>
> Applying this in $\frac{\partial q(L, K)}{\partial L} \frac{1}{w} = \frac{\partial q(L, K)}{\partial K} \frac{1}{r}$ we get:
>
> $\frac{K}{L} = \frac{1-a}{a} \frac{w}{r}$



# Implementation
```python

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches



def intersectionIndex(arr1, arr2):
    distances = np.abs(arr1 - arr2)
    indx = np.argmin(distances)
    return indx


class Consumer:
    def __init__(self):
        pass

    def demand(self, price):
        # @TODO
        d = 10 - 0.8 * price
        return np.maximum(0, d)


class Firm:
    def __init__(self, name, a, capital, wages, rent):
        self.name = name
        self.a = a
        self.capital = capital
        self.wages = wages
        self.rent = rent

    def pickCapital(self, price):
        """ 
            $$ c(q) = r K^{opt}(q) + w L^{opt}(q) $$
            Minimize $c$ subject to $K, L \in isoq(q)$
            For this, we must have:
            $$ \frac{\partial q}{\partial L} \frac{1}{w} = \frac{\partial q}{\partial K} \frac{1}{r} $$
            For Cobb-Douglas, this yields:
            $$ K^{opt} = $$
            $$ $$
        """

    def supply(self, price):
        """
            Short term supply.
            Obtained by picking L to optimize profit.
            $$ 
                \pi(q|p) = qp - c(q)                                                                \\
                \frac{\partial \pi}{\partial q} = 0   \to    p = \frac{\partial c}{\partial q}      \\
                p = w \frac{\partial L^{req}(q|K) }{\partial q}                                     \\
            $$
            Using Cobb-Douglas:
            $$
                p = \frac{w}{a} q^\frac{1-a}{a} K^\frac{a-1}{a}         \\
                q = (\frac{pa}{w})^{\frac{a}{1-a}}  K
            $$
        """
        ppw = price * self.a / self.wages
        ppwc = ppw**(self.a / (1 - self.a))
        q = self.capital * ppwc
        return q
    
    def cost(self, quantity):
        return self.rent * self.capital + self.wages * self.__laborRequired(quantity)
    
    def marginalCost(self, quantity):
        """
        $$ \begin{align}
            MC(q) &= \frac{\partial c}{\partial q}                       \\
                  &= w \frac{\partial L^{req}(q|K)}{\partial q}          \\
        \end{align}  $$
        """
        return self.wages * self.__marginalLaborRequired(quantity)
    
    def averageCost(self, quantity):
        cost = self.cost(quantity)
        return cost / quantity
    
    def variableCost(self, quantity):
        cost = self.cost(quantity)
        return cost - self.rent * self.capital
    
    def averageVariableCost(self, quantity):
        variableCost = self.variableCost(quantity)
        return variableCost / quantity
    
    def profit(self, quantity, price):
        costs = self.cost(quantity)
        return price * quantity - costs

    def __laborRequired(self, quantity):
        """
            From Cobb-Douglas:
            $$
                q = L^a K^{1-a} \\
                L(q|K) = q^\frac{1}{a} K^\frac{a-1}{a}
            $$
        """
        return quantity**(1/self.a) * self.capital**((self.a-1)/self.a)

    def __marginalLaborRequired(self, quantity):
        return (1/self.a) * quantity**((1-self.a)/self.a) * self.capital**((self.a - 1)/self.a)



class Market:
    def __init__(self, name, nrFirms=0, nrConsumers=0):
        self.name = name
        self.firms = [Firm(f"Firm{i}", a=0.5, capital=10, wages=3, rent=2) for i in range(nrFirms)]
        self.consumers = [Consumer() for i in range(nrConsumers)]

    def supply(self, price):
        q = 0
        for firm in self.firms:
            q += firm.supply(price)
        return q

    def demand(self, price):
        q = 0
        for consumer in self.consumers:
            q += consumer.demand(price)
        return q


    def longTermCycle(self, allowEntry=True):
        pCurrent, _ = market.settledPriceAndQuantity()

        for firm in self.firms:
            firm.pickCapital(pCurrent)

        for firm in self.firms:
            exit = firm.shouldExit(pCurrent)
            if exit:
                self.firms.remove(firm)

        if allowEntry:
            averageProfit = self.averageProfit()
            if averageProfit > 0:
                self.firms.append(Firm(f"Firm{len(self.firms)}", a=0.5, capital=10, wages=3, rent=2))


    def settledPriceAndQuantity(self):
        prices = np.linspace(0, 1000, 10000)
        supply = self.supply(prices)
        demand = self.demand(prices)
        indx = intersectionIndex(supply, demand)
        pSettled = prices[indx]
        qSettled = supply[indx]
        return pSettled, qSettled



class Plotter:
    def __init__(self):
        self.demandStyle = 'r'
        self.supplyStyle = 'b'
        self.neutralStyle = 'gray'

    def plotMarketSupplyAndDemand(self, market: Market, maxPrice=10):
        prices = np.linspace(0, maxPrice, 100)
        supply = market.supply(prices)
        demand = market.demand(prices)
        pSettled, qSettled = market.settledPriceAndQuantity()

        fig, ax = plt.subplots(1, 1)
        ax.set_xlabel('quantity')
        ax.set_ylabel('price')
        ax.plot(supply, prices, self.supplyStyle, label='supply')
        ax.plot(demand, prices, self.demandStyle, label='demand')
        ax.hlines([pSettled], [0], [qSettled], [self.neutralStyle], linestyles='dotted', label=f"p = {np.round(pSettled)}")
        ax.vlines([qSettled], [0], [pSettled], [self.neutralStyle], linestyles='dotted', label=f"q = {np.round(qSettled)}")
        ax.legend()
        ax.set_title(f"Market for {market.name}")
        ax.set_ylim(0, maxPrice)
        return fig, ax
    
    def plotFirmCurves(self, firm: Firm, market: Market, maxPrice=10):
        prices = np.linspace(0, maxPrice, 100)
        pMarket, _ = market.settledPriceAndQuantity(prices)
        supply = firm.supply(prices)
        qProduced = firm.supply(pMarket)

        averageCosts = firm.averageCost(supply)
        averageVariableCosts = firm.averageVariableCost(supply)
        profit = firm.profit(qProduced, pMarket)
        profitPerUnit = profit / qProduced


        fig, ax = plt.subplots(1, 1)
        ax.set_xlabel('quantity')
        ax.set_ylabel('price')

        rect = patches.Rectangle((0, pMarket - profitPerUnit), qProduced, profitPerUnit, 
                                 facecolor='b', alpha=0.2)
        ax.add_patch(rect)
        ax.annotate(f"profit={np.round(profit)}", (0, pMarket), color='b', fontsize=12, ha='left', va='top')

        ax.plot(supply, prices, self.supplyStyle, label='supply=MC')
        ax.plot(supply, averageCosts, 'r.', label='AC')
        # ax.plot(supply, averageVariableCosts, 'r--', label='AVC')
        ax.hlines([pMarket], [0], [np.max(supply)], [self.neutralStyle], linestyles='dotted', label=f"market-price = {np.round(pMarket)}")
        ax.vlines([qProduced], [0], [pMarket], [self.neutralStyle], linestyles='dotted', label=f"production = {np.round(qProduced)}")
        ax.legend()
        ax.set_title(f"Firm {firm.name} in {market.name}-market")
        ax.set_ylim(0, maxPrice)
        return fig, ax



    


plotter = Plotter()
market = Market('Burgers', 30, 100)

fig, axes = plotter.plotMarketSupplyAndDemand(market)
fig.show()
fig, axes = plotter.plotFirmCurves(market.firms[0], market)
fig.show()

market.longTermCycle()

axes = Plotter.plotMarketSupplyAndDemand(market)
axes.show()
fig, axes = plotter.plotFirmCurves(market.firms[0], market)
fig.show()

```









# Preliminaries: utility functions


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
- optimize $q(K, L) = L^aK^{1-a}$ subject to $Lp_L + Kp_K - bgt = 0$
- We find $K \frac{a}{1-a} \frac{p_K}{p_L} = L$
- $ L_{opt} = \frac{bgt \cdot a}{p_L} $
- $ K_{opt} = \frac{bgt \cdot (1 - a)}{p_K} $
- $ q(L_{opt}, K_{opt}) = bgt (\frac{a}{p_L})^a (\frac{1-a}{p_K})^{1-a}$


More generally:
$$ \forall i: x_i^{opt} = \frac{bgt \cdot \alpha_i}{p_i} $$









<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>





# Economics (old notes)

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



