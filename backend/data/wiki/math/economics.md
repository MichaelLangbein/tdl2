# Economics

Terminology:

- Price $p$
- Each firm has a production function $q(L, K)$
  - where $L$ is _labor_, coming at a cost $w$(ages)
  - and $K$ is _capital_, costing $r$(ent)
  - thus the firms cost is $c(L, K) = wL + rK$
  - labor can be adjusted in the short term, capital only in the long term
- We assume that firms don't buy work or capital, they just rent it. Makes cost-calculations easier.
- Each firm tries to maximize profit $\pi = pq(L, K) - c(L, K)$

# The steps of the game

1. **Short term**:
   - Givens:
     - There are _n_ firms and _m_ consumers
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

The firm produces a quantity $q$ to maximize profit $\pi$.
They have a fixed amount of capital, so they can only change labor to get the maximizing quantity.

$$ \pi(q|K_0) = pq(L|K_0) - c(L|K_0)$$
$$ \frac{\partial \pi}{\partial q} = 0 \to p = \frac{\partial c(L|K_0)}{\partial q}$$
$$ c(L|K_0) = rK_0 + w L^{req}(q|K_0)$$
$$ p = w \frac{\partial L^{req}(q|K_0)}{\partial q} $$

This equation is solved for $q$, yielding $q(p|K_0)$, the short run supply.

$\frac{\partial c(L|K_0)}{\partial q}$ is called the _marginal cost_ (MC). We see here that the marginal cost is the inverse of the short term supply.

> **Example calculation with Cobb-Douglas**:
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

Independent of the marginal cost, a firm might chose not to produce anything at all in a round. That would be the case when profit would be less than the costs of producing nothing:
$$ pq -c(q | K_0) \leq - c(0 | K_0) $$
This is equivalent to 
$$ p \leq \frac{c(q|K_0) - c(0|K_0)}{q} = AVC$$
where $AVC$ stands for average variable cost.

## Long term

Again the firm observes the market price $p$. In a perfectly competitive market, the firm has no influence on $p$.

In the long term, the firm can set both $L^{opt}$ and $K^{opt}$ to the optimal values given $p$ (not just to the short-term _required_, but long-term sub-optimal $L^{req}$).

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
>
> Plugging this back into $q(K, L)$, we get $K^{opt}(q)$ and $L^{opt}(q)$:
>
> $ K^{opt}(q) = \frac{q}{(\frac{a}{1-a} \frac{r}{w})^a} $
>
> $ L^{opt}(q) = \frac{q}{(\frac{a}{1-a} \frac{r}{w})^{a-1}} $
>
> $c(q) = w\frac{q}{(\frac{a}{1-a} \frac{r}{w})^{a-1}} + r\frac{q}{(\frac{a}{1-a} \frac{r}{w})^a}$

Now something interesting is happening here: $c$ is now a linear function of $q$ and we can therefore not solve for $q$ in $p=\frac{\partial c}{\partial q}$. This means that we can't simply derive $q(p)$!

This is where game-theory comes into play: it is now up to the firm's managers to decide if they'll want to expand or contract. Probably they'll account in their decision for $\frac{K}{L}$, the average profit in the market, and how much money they have. In the following code we'll plug in a strategy that just expands $K$ by one unit if there is still profit in the market.

# Implementation

```python
#%%
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches



"""
    Things to do better:
        1. Firms: have them calculate their supply curves once, explicitly, and then make all functions just accessors to those pre-calculated data.
        2. Don't write firm code specific to Cobb-Douglas. Instead: pass into firm a production function, satisfying the same interface.
        3. Better `pickCapital` and `shouldExit` strategies.
        4. Add a `State` class which can raise taxes on both supply and demand (by being added to the cost-curve)
"""




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
    def __init__(self, name: str, a: float, capital: int, wages: int, rent: int, pickCapitalStrategy, shouldExitStrategy):
        self.name = name
        self.a = a
        self.capital = capital
        self.wages = wages
        self.rent = rent
        self.pickCapitalStrategy = pickCapitalStrategy
        self.shouldExitStrategy = shouldExitStrategy

    def pickCapital(self, market):
        self.capital = self.pickCapitalStrategy(self, market)

    def shouldExit(self, market):
        return self.shouldExitStrategy(self, market)

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

        # adjusting for stopping-condition:
        avc = self.averageVariableCost(q)
        qAdjusted = np.where(price >= avc, q, 0)

        return qAdjusted

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

    def __optimalKperL(self):
        return ((1 - self.a) / self.a) * (self.wages / self.rent)




def simplePickCapitalStrategy(firm: Firm, market):
    profit = market.averageProfit()
    if profit > 0.01:
        return firm.capital + 1
    elif profit < -0.1 and firm.capital >= 2:
        return firm.capital - 1
    return firm.capital


def simpleShouldExitStrategy(firm: Firm, market):
    marketPrice, _ = market.settledPriceAndQuantity()
    q = firm.supply(marketPrice)
    profit = firm.profit(q, marketPrice)
    if profit < -0.1:
        return True
    return False


class Market:
    def __init__(self, name, nrFirms=0, nrConsumers=0):
        self.name = name
        self.firms = []
        for _ in range(nrFirms):
            self.firms.append(self.spawnNewFirm())
        self.consumers = [Consumer() for i in range(nrConsumers)]


    def spawnNewFirm(self):
        name = f"Firm{len(self.firms)}"
        a = np.random.rand()
        capital = np.random.randint(1, 10)
        wages = np.random.randint(1, 5)
        rent = np.random.randint(1, 5)
        firm = Firm(name, a, capital, wages, rent, simplePickCapitalStrategy, simpleShouldExitStrategy)
        return firm


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
            firm.pickCapital(self)

        for firm in self.firms:
            exit = firm.shouldExit(self)
            if exit:
                self.firms.remove(firm)
                print(f"Exit firm {firm.name}")

        if allowEntry:
            averageProfit = self.averageProfit()
            if averageProfit > 0:
                newFirm = self.spawnNewFirm()
                self.firms.append(newFirm)
                print(f"New firm {newFirm.name}")


    def settledPriceAndQuantity(self):
        prices = np.linspace(0, 1000, 10000)
        supply = self.supply(prices)
        demand = self.demand(prices)
        indx = intersectionIndex(supply, demand)
        if not indx:
            print("Warning: no firms left in market!")
            return 0, 0
        pSettled = prices[indx]
        qSettled = supply[indx]
        return pSettled, qSettled


    def averageProfit(self):
        pMarket, _ = self.settledPriceAndQuantity()
        profits = []
        for firm in self.firms:
            qFirm = firm.supply(pMarket)
            profitFirm = firm.profit(qFirm, pMarket)
            profits.append(profitFirm)
        return np.average(profits)




class Plotter:
    def __init__(self, maxPrice, maxQuantity):
        self.demandStyle = 'r'
        self.supplyStyle = 'b'
        self.neutralStyle = 'gray'
        self.maxPrice = maxPrice
        self.maxQuantity = maxQuantity


    def plotMarketSupplyAndDemand(self, market: Market):
        prices = np.linspace(0, self.maxPrice, 100)
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
        ax.set_title(f"Market for {market.name} ({len(market.firms)} firms)")
        ax.set_ylim(0, self.maxPrice)
        ax.set_xlim(0, self.maxQuantity)
        return fig, ax


    def plotFirmCurves(self, firm: Firm, market: Market, maxPrice=10):
        prices = np.linspace(0, maxPrice, 100)
        pMarket, _ = market.settledPriceAndQuantity()
        supply = firm.supply(prices)
        qProduced = firm.supply(pMarket)

        averageCosts = firm.averageCost(supply)
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
        ax.hlines([pMarket], [0], [np.max(supply)], [self.neutralStyle], linestyles='dotted', label=f"market-price = {np.round(pMarket)}")
        ax.vlines([qProduced], [0], [pMarket], [self.neutralStyle], linestyles='dotted', label=f"production = {np.round(qProduced)}")
        ax.legend()
        ax.set_title(f"Firm {firm.name} in {market.name}-market")
        ax.set_ylim(0, self.maxPrice)
        ax.set_xlim(0, self.maxQuantity / len(market.firms))
        return fig, ax









plotter = Plotter(10, 1000)
market = Market('Burgers', 30, 100)

averageProfits = []
nrFirms = []

for t in range(70):
    market.longTermCycle()
    averageProfits.append(market.averageProfit())
    nrFirms.append(len(market.firms))

fig, axes = plotter.plotMarketSupplyAndDemand(market)
fig.show()
fig, axes = plotter.plotFirmCurves(market.firms[0], market)
fig.show()

#%%
fig, axes = plt.subplots(1, 1)
axes.plot(averageProfits)
axes.plot(nrFirms)
# %%


```

# Long-run results

The above simulation depends on the `pickCapital` and `shouldExit` strategies that the functions use.
Therefore, we have little concrete mathematical proofs of their long-term behavior.
Running such a simulation for a long time however tends to yield a few useful results:

1. The market develops to a point where there is no profit left to be gained.
   - Then we have $\pi = 0$, and thus:
   - $p = \frac{c(q)}{q}$
2. ...

# Market interventions

## Effect of subsidies on market

Free market prices for two competing products.

- I, the buyer, need to order 10 meals. They could be pizza or burgers, I have no preference (=perfectly substitutable).
- The marginal price of the $b$th burger is $c(b) = 3b$
- The marginal prices of the $p$th pizza is $c(p) = 2p$
- So my total costs are $\int^pc(p)dp + \int^bc(b)db = \frac{3}{2}b^2 + p^2$
- I want to minimize my total costs, subject to the condition $b + p = 10$
- Minimizing with constrained optimization I get $\frac{p}{b} = \frac{3}{2}$, so I order 6 pizza's and 4 burgers.

The big-burger lobby sees this and convinces congress to subsidize each burger with one dollar.
This changes the marginal price of the $b$ th burger to $c(b) = 3b - 1$.

- Again optimizing, I would now buy $4.2$ burgers and only $5.8$ pizza's.

What does this do to the welfare in the system?

The first image shows the unimpeded market.
<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/burgers_pizzas_unimpeded.png" width="70%"/>

The second one shows the effect of the subsidies.
<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/burgers_pizzas_with_subsidies.png" width="70%"/>

Applications:

- Replace burgers with CO_2 saved in Germany with subsidies, and pizzas with CO_2 saved in other EU countries without subsidies.
- Replace burgers with solar panels built in EU and pizzas with solar panels from China.

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
- $L\_{opt} = \frac{bgt \cdot a}{p_L}$
- $K\_{opt} = \frac{bgt \cdot (1 - a)}{p_K}$
- $q(L*{opt}, K*{opt}) = bgt (\frac{a}{p_L})^a (\frac{1-a}{p_K})^{1-a}$

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

# Banking

## Lingo

- **mortgage** (Hypothek)
  - fixed rate
    - here, initially most of the fixed rate goes into paying accrued interest, but then exponentially more goes into principal.
  - **ARM**: adjustable rate mortgage
- **annuity** (Annuität, jähreliche Rate): a fixed, _yearly_ repayment rate
- **accrued interest**: interest on last years outstanding debt (assumes that interest on all years before has already been payed off)
- **capital recovery factor** = annuity / present-day-value
- **equity(t)**: value of asset at time $t_0$ - outstanding debt at current $t$
- **principal**: payment - accrued interest; i.e. amount of money going into paying the asset, as opposed to the amount going into paying interest.

## Calculating repayment-rate for fixed rate mortgages

- Interest is applied at each time-step to _outstanding_ debt of that time-step.
  - interest-rate $q$
  - $j = 1 + q$
  - $r$ = repayment-rate
- $t_0$: outstanding debt = $d_0$
- $t_1$: outstanding debt = $d_0 j - r$
- $t_2$: outstanding debt = $(d_0 j - r)j - r$
- $t_3$: outstanding debt = $((d_0 j - r)j - r)j - r$
- ...
- $t$: outstanding debt = $d_0 j^t - r \sum_{t=0}^{t-1}j^t$
- At $t=T$, the outstanding debt must be 0:
  - $d_0 j^T = r \sum_{t=0}^{T-1}j^t$
  - Using geometric series $\sum_{t=0}^{T-1}j^t = \frac{1-j^{T}}{1-j}$
  - $r = d_0 j^T \frac{1-j}{1-j^T}$

**Note** that inflation $i$ plays no role in this calculation, and neither does the _real_ interest rate $q_r$.

## Present day value of single payment in future

100 Euro

- $i$ = inflation
- if given today: 100 Euro
- if next year: $100 / (1-i)$
- if the year after: $100 / (1-i)^2$
- ...
- in year $t$: $100 / (1-i)^t $

## Present day value of mortgage payments

- payment-rate: $r$
- inflation: $i$
- $t_0$: rate $r$ is worth $r$
- $t_1$: rate $r$ is worth $r / (1 + i)$
- $t_2$: rate $r$ is worth $r / (1 + i)^2$
- ...
- In sum, the payments from including $t_0$ up to including $T$ are worth:
  - $v = r \sum_{t=0}^T (\frac{1}{1+i})^t$
  - let $u = \frac{1}{1+i}$
  - Again using geometric series:
  - $v = r \frac{1-u^{T+1}}{1-u}$

**Note** that interest-rate $q$ plays no role in this calculation (as long as $r$ is given), and neither does the _real_ interest rate $q_r$.

## Choosing an interest rate for mortgage payments

Finally relating $i$ and $q$.
A bank will choose its interest rate such that they make a profit.

1. Given inflation $i$,
2. $v$ must be at least equal to the amount lent $d_0$
   1. $v \geq d_0$
   2. $r \frac{1-u^{T+1}}{1-u} \geq d_0$
   3. $r \geq d_0 \frac{1-u}{1-u^{T+1}}$
   4. $d_0 j^T \frac{1-j}{1-j^T} \geq d_0 \frac{1-u}{1-u^{T+1}}$
      1. $j = 1 + q$
      2. $u = \frac{1}{1+i}$
      3. solve for interest-rate $q$

**Note** that the real interest-rate $q_r$ plays no role in this calculation.

## Real interest rate

The nominal interest rate $q$ demanded of a customer is actually less harsh than it seems.
The real interest rate is less due to the effects of inflation:
$$ 1 + q_r = \frac{1 + q}{1 + i} $$

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

# Macroeconomics

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

- _Normal_ goods: higher income leads to higher demand
- _Inferior_ goods: higher income doesn't lead to higher demand
- _Complementary_ goods: higher consumption of _A_ leads to higher demand for _B_
  - Example: use of computers increases demand for printers.
- _Substitute_ goods
  - Example: cola and pepsi

# Cost, producer-surplus (aka. profit) and supply

- $c(q)$: **marginal costs**, i.e. $\frac{\partial \text{total production costs}}{\partial q}$
- $ps(q) | p$: **producer surplus**, aka. profit, defined as $ps(q) | p = pq - \int^{q}c d q$
- $\frac{\partial ps}{\partial q_0} = 0 \to  p = c(q_0)$
- $c^{-1}(p) = q_0$, we call $c^{-1}$ the **supply** $q^{supply}(p)$.

# Markets

**Theorem 1**: In a free market, we have $p: q^{supply}(p) = q^{demand}(p)$

> _Proof_: By contradiction
>
> > _Case 1_: assume that $p: q^{supply}(p) < q^{demand}(p)$
> >
> > This is a market of shortage. $q$ is determined by the producers: producers will be able to produce a quantity such that their producer-surplus is maximal ... whereas the consumer-surplus might not be.

> > _Case 2_: assume that $p: q^{supply}(p) > q^{demand}(p)$

**Theorem 2**: In a free market, the market-equilibrium is where _social welfare_ (consumer- plus producer-surplus) is maximized.

> _Proof_:

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
- $ L\_{opt} = \frac{bgt \cdot a}{p_L} $
- $ K\_{opt} = \frac{bgt \cdot (1 - a)}{p_K} $
- $ q(L*{opt}, K*{opt}) = bgt (\frac{a}{p_L})^a (\frac{1-a}{p_K})^{1-a}$

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

> _Proof_:
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
   - $ q(L*{opt}, K*{opt}) = bgt (\frac{a}{p_L})^a (\frac{1-a}{p_K})^{1-a}$
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

- If labor and capital are substitutable (_example: workers or machine to build cars_):
  - if labor initially cheap, now a bit more expensive:
    - producers only use labor, not machines
    - producers will reduce employers proportionally to the wage-increase
  - if labor initially expensive, now a bit more expensive:
    - producers never had any workers in the first place, because capital was more efficient
    - so no reduction in employment.
- If labor and capital are non-substitutable (_example: programmers and computers to build software_):
  - if labor initially cheap, now a bit more expensive:
    - producers use computers and programmers in equal amounts
    - they also reduce them in equal amounts
    - one unit change in wages means much change in both employment and capital
  - if labor initially expensive, now a bit more expensive:
    - producers use computers and programmers in equal amounts
    - they also reduce them in equal amounts
    - one unit change in wages means little change in neither employment nor capital
