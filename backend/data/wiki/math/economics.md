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
> $q(p|K_0) = (\frac{p a}{w})^\frac{a}{1-a} K_0$

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
> $K^{opt}(q) = \frac{q}{(\frac{a}{1-a} \frac{r}{w})^a}$
>
> $L^{opt}(q) = \frac{q}{(\frac{a}{1-a} \frac{r}{w})^{a-1}}$
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

# Macro economics: static neo-classical model

We will build an equilibrium model of macro-economics.
That means that when we calculate an optimal demand for something, this will in equilibrium equal the optimal supply for it, and vice versa.

## Firms

As before, firms aim to maximize profit:
$$ \pi = Y - w L - r K $$

- $Y$ is production, which replaces $q p$ in our micro-economic model
- $r$, the rent on capital, can now be assumed to equal the **real interest rate**.
- We use (a slightly different version of) the Cobb-Douglass production function: $q = A K^a L^{1-a}$
- We want to maximize $\pi$ by changing $L$ and $K$.
- $\frac{\partial \pi}{\partial L} = (1-a) A K^a N^{-a} - w = 0$
  - **Labor demand**: $L = (\frac{w}{(1-a) A K^a})^{-1/a}$
  - **wages**: $w = (1-a) A K^a N^{-a}$
- $\frac{\partial \pi}{\partial K} = a A K^{a-1}L^{1-a} - r = 0$
  - Capital, which equals **investment**: $K = I = (\frac{aAN^{1-a}}{r})^{1/(1-a)}$
  - **Real interest rate**: $r = \frac{I^{a-1}}{aAN^{1-a}}$

## Government

- $G = T + B$
  - $G$: government spending
  - $T$: taxes
  - $B$: government debt (=bonds)
- In future: $G_f = T_f + (1+r)B$
- Solving for B and equating:
  - $G - \frac{G_f}{1+r} = T - \frac{T_f}{1+r}$

## Households

Households want to maximize utility $U$, which comes from:

- consumption $C$
- future consumption $C_f$
- leisure $1-L$
- having money at hand (not in a bank) $M/P$
  - where $M$ is the money supply, $P$ is the price-level

We use a log-utility function:
$$ U = \ln{[C + b_1 \ln{(1-L)}]} + b_2 \ln{C_f} + b3 \ln{\frac{M}{P}}$$

This is subject to the household budget:
$$C = Y - T - S - \frac{M}{P}$$

- where $Y$ is production, which equals the households' wages
- $S$ is savings

There is also the future budget:
$$C_f = Y_f - T_f + (1+r)S + \frac{(1+r)M}{(1 + r_{nom})P}$$

Combining the two household-budgets with the government budget-equation, we obtain:

$$C_f = (Y - C - G)(1+r) + Y_f - G_f - \frac{(1+r)r_{nom}M}{(1 + r_{nom})P}$$

<small>
We've combined today's household-budget with the future household-budget, and with today's and the future government-budget. 
This implies that households account not only for current taxes, but also for future taxes, 
and even that households know that the government will raise taxes in the future if it has high spending today.
This is a strong assumption, known as the [Ricardo-Barro-effect](https://en.wikipedia.org/wiki/Ricardian_equivalence),
but if it does hold, that means that whether the government finances extra-spending by new taxes, new debt or money-printing has no effect on consumption.

Suppose that the government finances some extra spending through deficits; i.e. it chooses to tax later. According to the hypothesis, taxpayers will anticipate that they will have to pay higher taxes in future. As a result, they will save, rather than spend, the extra disposable income from the initial tax cut, leaving demand and output unchanged.

If Ricardo-Barro does hold, then governments' counter-cyclical policies must fail.
</small>

The task now is to maximize $U$ by varying $C, L, M$, subject to the above combined-household-equation. This is a lot of pencil-pushing, but with patience we get:

- **Labor supply**: $L = 1 - \frac{b_1}{w}$
- **Cash-money demand**: $M = \frac{b_3(1 + r_{nom})PC}{r_{nom}}$
- **Consumption**: $C = \frac{1}{1 + b2 + b3} [ Y - G + \frac{Y_f - G_f}{1+r} - b_1(b_2 + b_3) \ln{\frac{b_1}{w}} ]$

We calculate the cash-money demand as a function of households, not of firms, because in practice households hold more cash-money (M) than firms. Firms will largely invest (I) their money.

## Cash money market

With $M$ we mean cash-money and checking accounts - so called $M_1$ money. We don't mean wealth, which includes bonds, stocks, and other investments (these other forms are less liquid).

While the money-demand is downward-sloping as a function of the interest rate ($M = \frac{b_3(1 + r_{nom})PC}{r_{nom}}$), the money supply is set fixed by the central bank.

### Market for loanable funds

Crowding out: https://www.youtube.com/watch?v=J_-55Y1eU0s, https://www.youtube.com/watch?v=4lBmOfNtYLE&pp=ygUiY3Jvd2Rpbmcgb3V0IGVmZmVjdCBtYWNyb2Vjb25vbWljcw%3D%3D

Inflation: https://www.youtube.com/watch?v=FdtBj1juEQs

### Fiscal policy

Taxes and government spending.
Governments mostly try to keep inflation and unemployment low.

### Monetary (Fed) policy

- Expansionary monetary policy: fed increases money supply -> interest rate drops -> investment increases, demand increases
- Contractionary monetary policy: fed decreases money supply -> interest rate increases -> decreases investment, demand, but fights inflation

Fed has three ways of acting on money market:

- Open market operations = fed buys or sells bonds to private banks
  - buying bonds:
    - remove bonds
    - give money to banks -> increases money supply
      - (because bonds are not counted as money-supply: because banks cannot lend out bonds, only cash)
- Discount rate: interest rate the fed charges to private banks (different from $r$ as felt by consumers)
  - low discount rate -> more banks borrow from fed -> higher money supply
- Reserve ratio

## Equilibrium conditions

- **Goods market** equilibrium:
  - $Y = C + I + G$
  - In words: realOutput = consumption + investment + governmentExpenditure
- **GDP**:
  - expenditure approach: $GDP = C + I + G$
  - income approach: $GDP = Y$ = wages
- **Loanable funds**:
  - equilibrium between investment and saving is interpreted as loanable-funds-market

## Implementation

```python
#%%
import matplotlib.pyplot as plt
import numpy as np


def radioPlot(labels, stats1, stats2, label1, label2):
    angles = np.linspace(0, 2 * np.pi, len(labels) + 1, endpoint=False).tolist()
    _, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
    ax.fill(angles[:-1], stats1, color='red', alpha=0.25)
    ax.fill(angles[:-1], stats2, color='blue', alpha=0.25)
    ax.plot(angles[:-1], stats1, color='red', linewidth=2, label=label1)
    ax.plot(angles[:-1], stats2, color='blue', linewidth=2, label=label2)
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels)
    plt.legend()
    plt.show()

#%%
"""
The neoclassical model is the only macro economic model that still optimizes profit (for firms) and utility (for households)
It assumes households are very rational and know that today's government spending must be financed with tomorrow's taxes.
It implies Ricardo-Barro effect (demand is unchanged when government tries to stimulate the economy by debt-financed spending).
That seems quite unrealistic, but it describes an economy where everyone
is rational and budgets are (in the long term) balanced.
"""

def neoclassical(
        A = 2,       # productivity
        a = 0.3,     # Douglass-Cobb factor
        b1 = 0.4,    # household preference for leisure
        b2 = 0.9,    # discount rate
        b3 = 0.6,    # household preference for money
        G0 = 1,      # Government spending
        Gf = 1,      # future government spending
        Yf = 1,      # expected future productivity
        M0 = 5,      # money supply
        K = 5,       # capital (exogenous)
        pe = 0.02    # expected future profit
):

    # Initialise endogenous variables at arbitrary positive value
    w = C = I = Y = r = N = P = 1

    for _ in range(1000):

        # Cobb douglass production
        Y = A * K**a * N**(1-a)

        # Labor demand
        w = A * (1-a) * K**a * N**(-a)

        # Labor supply
        N = 1 - b1/w

        # Consumption demand
        C = (1/(1 + b2 + b3)) * (Y - G0 + (Yf - Gf)/(1+r)   - b1*(b2+b3) * np.log(b1/w))

        # Investment demand, solved for r
        r = I**(a-1) * a * A * N**(1-a)

        # Goods market equilibrium, solved for I
        I = Y - C - G0

        # Nominal interest rate
        rn = r + pe

        # Price level
        P = (M0 * rn) / ((1 + rn) * b3 * C)

    return w , C , I , Y , r , N , P


stats1 = neoclassical()
stats2 = neoclassical(G0=1.5)
radioPlot(["w" , "C" , "I" , "Y" , "r" , "N" , "P"], stats1, stats2, "baseline", "fiscal policy")

```

## Accounting for a central bank and for banks

```python


"""
Neo-classical synthesis model
- no longer optimizes for profit (firms) or utility (households)

- monetary policy:
    - fed spending
    - affects mostly investment?
- fiscal policy:
    - government spending
    - affects mostly consumption?
"""


def neoclassicalSynthesis(
    c0 = 2    ,  # autonomous consumption
    c1 = 0.6  ,  # sensitivity of consumption w.r.t. income
    i0 = 2    ,  # investment demand (aka. animal spirits)
    i1 = 0.1  ,  # sensitivity of investment w.r.t. interest rate
    A = 2     ,  # productivity
    Pe = 1    ,  # expected price level
    m0 = 6    ,  # liquidity preference
    m1 = 0.2  ,  # sensitivity of money demand w.r.t. income
    m2 = 0.4  ,  # sensitivity of money demand w.r.t. interest rate
    M0 = 5    ,  # money demand
    G0 = 1    ,  # government spending
    T0 = 1    ,  # taxes
    K0 = 1    ,  # capital stock (exogenous)
    Nf = 7    ,  # full employment
    a = 0.3   ,  # capital elasticity of output
    b = 0.4   ,  # household preference for leisure
):
    """
    https://macrosimulation.org/a_neoclassical_synthesis_model_is_lm_as_ad
    """

    # Endogenous variables
    Y = C = I = r = P = w = N = W = 1

    for _ in range(100):

        # Goods market equilibrium
        Y = C + I + G0

        # Consumption demand
        C = c0 + c1 * (Y - T0)

        # Investment demand
        I = i0 - i1 * r

        # Money market, solved for interest rate
        r = (m0 - (M0/P)) / m2  +  m1 * Y/m2

        # Unemployment rate
        U = 1 - N/Nf

        # Real wage
        w = A * (1-a) * K0**a * N**(-a)

        # Nominal wage
        W = Pe * b * C / U

        # Price level
        P = W / w

        # Employment
        N = (Y / (A * K0**a))**(1/(1-a))

    return Y, C, I, r, U, w, W, P, N


stats1 = neoclassicalSynthesis()
stats2 = neoclassicalSynthesis(G0=1.125)
radioPlot(["Y", "C", "I", "r", "U", "w", "W", "P", "N"], stats1, stats2, "baseline", "fiscal policy")


#%%


# Post keynesian with endogenous money
def postKeynesianWithMoney(
    b = 0.5,    # propensity to spend out of income
    c = 0.7,    # share of credit-demand that is accommodated
    d0 = 5,     # autonomous demand, debt-financed
    d1 = 0.8,   # sensitivity of demand w.r.t. interest rate
    i0 = 0.01,  # central bank rate, discretionary component
    i1 = 0.5,   # sensitivity of central bank rate w.r.t. price level
    m = 0.15,   # banks' interest rate markup
    k = 0.3,    # desired reserve ratio
    n = 0.15,   # price mark-up
    W0 = 2,     # nominal wage (exogenous)
    h = 0.8,    # sensitivity of nominal wage w.r.t. unemployment
    a = 0.8,    # productivity
    Nf = 12     # full employment
):
    """
    https://macrosimulation.org/a_post_keynesian_macro_model_with_endogenous_money#overview
    """

    for _ in range(1000):
        # Initialize endogenous variables at some arbitrary positive value
        Y = D = ND = r = N = U = P = w = W = i = dL = dR = dM = 1

        # Goods market
        Y = ND + c * D

        # Non-debt financed component of demand
        ND = b * Y

        # Debt financed component of demand
        D = d0 - d1 * r

        # Policy rate
        # Assumes that fed raises interest when prices increase
        i = i0 + i1 * P

        # Lending rate
        # Banks lend at policy rate plus markup
        r = (1 + m) * i

        # Change in loans
        dL = c * D

        # Change in deposits
        dM = dL

        # Change in reserves
        dR = k * dM

        # Price level
        # Firms charge at production cost plus markup
        P =  (1 + n) * a * W

        # Nominal wage
        # base wage, lower if high unemployment
        W = W0 - h * U

        # Real wage
        w = 1 / ((1+n) * a)

        # Employment
        N = a * Y

        # Unemployment
        U = (Nf - N) / Nf

    return Y, D, ND, r, N, U, P, w, W, i, dL, dR, dM


stats1 = postKeynesianWithMoney()
stats2 = postKeynesianWithMoney(c=0.9)


labels = ["Y", "D", "ND", "r", "N", "U", "P", "w", "W", "i", "dL", "dR", "dM" ]
radioPlot(labels, stats1, stats2, "baseline", "more lending")
# %%

```

# Macro economics - new Keynesian model

## Preliminaries: The circular flow model of macro-economics

### Capital through factor markets and through investment in goods-markets

From microeconomics, we're used to the Cobb-Douglas function, which relates production to labor and capital:

$$Q = L^a K^{1-a}$$
This is done to maximize profit:
$$\Pi = PQ - wL -rK$$

But we need to be careful with terminology here. In the _circular-flow_ model of macroeconomics, capital appears _twice_:

- in the factors market, firms rent labor and capital for the price $Y$
- in the goods market,
  - consumers, government and foreigners order products from firms ($C$, $G$, and $X-M$, respectively)
  - firms buy capital from themselves - this is called investment $I$.

In micro-economics, using Cobb-Douglas, we assumed that all capital was rented on the factor market. We can no longer make this assumption in macroeconomics and the long-run.

Also, when a firm buys capital on the goods-market, its expense is the income of another firm, meaning that overall the amount of money among firms has not changed. What has changed, however, is the capital stock, which has now increased. So there is a net-increase in value of firms equal to the value of the produced capital.
The purchased capital comes into the ownership of the owner of the firm - and as such $I$ flows back through $Y$ to the households.

<small>I think you could also think of it as such: when firm $A$, owned by household $h_A$ buys capital from firm $B$, owned by household $h_B$, that is consumption $C$ of $h_A$ and revenue $Y$ of $h_B$. But this view is rarely taken: in real economies, 60% of investment comes from firms.</small>

### Wages, rent, profits

From firms away flows $Y$ to households through the factor-market.
From microeconomics we're used to this being wages $w$ payed for labor, but $Y$ also includes rent $r$ for capital and profits for entrepreneurship. In other words, all of a firms money is making its way to households, much more than just wages.

## Basic equations

- Steady state: demand equals production equals $Y$
- Firms' equilibrium equation $Y = C + I + G + (X - M)$
  - where $I$ is non-zero because of the value of the produced capital, not because of paying for them
  - $(X - M)$ ignored for now, assuming a closed economy
- Consumption $C = c_a + c_y (Y - T)$
  - increases with disposable income
- Taxes $T = t_a + t_y Y$
- Investment $I = a_a - a_r r + a_y Y$
  - decreases with real interest-rate $r$
  - increases with demand
- Saving $S = Y - C - T$

## Multiplier

$$Y = C + I + G$$
$$Y = c_a + c_y (Y - t_a - t_y Y) + a_a - a_r r + a_y Y + G$$
Since $Y$ equals GDP, we can calculate the sensitivity of GDP to different measures:

- Effect of fiscal policy $\frac{\partial GDP}{\partial G} =$
  - if government spends 1 more dollar, GDP increases by ...
  - the first fraction, $\mu_G =$, is called the multiplier for $G$.
  - the second term is called the _autonomous demand_.
- Effect of fiscal policy: $\frac{\partial GDP}{\partial r} =$
  - if fed reduces real interest by, ...
  - the first fraction, $\mu_r =$, is called the multiplier for $r$.
  - the second term is called the _autonomous demand_.

```python
#%%
import numpy as np
import matplotlib.pyplot as plt



def radioPlot(labels, plotData, ax = None):
    isSubplot = ax is not None
    if not isSubplot:
        _, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))

    angles = np.linspace(0, 2 * np.pi, len(labels) + 1, endpoint=False).tolist()
    for (stats, label, color) in plotData:
        ax.fill(angles[:-1], stats, color=color, alpha=0.25)
        ax.plot(angles[:-1], stats, color=color, linewidth=1, label=label)
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels)

    if not isSubplot:
        plt.legend()
        plt.show()

def radioPlotRow(labels, titleLeft, plotDataLeft, titleRight, plotDataRight):
    _, axes = plt.subplots(1, 2, subplot_kw=dict(polar=True))
    radioPlot(labels, plotDataLeft, axes[0])
    axes[0].set_title(titleLeft)
    radioPlot(labels, plotDataRight, axes[1])
    axes[1].set_title(titleRight)
    plt.show()



#%%
def simulate(
        i_a,
        i_Y,
        i_r,
        r, # real interest rate
        t_a,
        t_w,
        c_a,
        c_w,
        a, # Cobb-Douglass factor
        G0, # government spending
        balancedBudget = False
):
    # setting initial values
    I = T = C = Y = L = 1

    for _ in range(100):
        I = i_a + i_Y * Y - i_r * r
        T = t_a + t_w * Y
        C = c_a + c_w * (Y - T)
        G = T if balancedBudget else G0
        Y = C + G + I
        L = Y

    return I, T, C, Y, L


stats1 = simulate(i_a=1, i_Y=0.2, i_r=0.2, r=10, t_a=1, t_w=0.3, c_a=2, c_w=0.5, G0=10, a=0.5, balancedBudget=False)
stats2 = simulate(i_a=1, i_Y=0.2, i_r=0.2, r=1,t_a=1, t_w=0.3, c_a=2, c_w=0.5, G0=10, a=0.5, balancedBudget=False)
stats3 = simulate(i_a=1, i_Y=0.2, i_r=0.2, r=10, t_a=1, t_w=0.3, c_a=2, c_w=0.5, G0=10, a=0.5, balancedBudget=False)
stats4 = simulate(i_a=1, i_Y=0.2, i_r=0.2, r=10,t_a=1, t_w=0.3, c_a=2, c_w=0.5, G0=15, a=0.5, balancedBudget=False)


radioPlotRow(
    ["I", "T", "C", "Y", "L"],
    "decreased interest",
    [
        (stats1, "baseline", "red"),
        (stats2, "low interest", "blue")
    ],
    "increased govt",
    [
        (stats3, "baseline", "red"),
        (stats4, "high govt", "blue")
    ],
)
"""
monetary policy -> decreased interest -> more investment, gdp
fiscal policy -> more govt. spending -> more gdp

Fiscal policy seems to have a stronger effect on employment than monetary policy does.
"""
```

## IS curve

The IS curve shows GDP as a function of real interest rate.
We've already established this relation:
$$Y^* = c_a + c_y (Y - t_a - t_y Y) + a_a - a_r r + a_y Y + G$$

**We mark with a \* values determined by the goods-market**.

Since the IS curve only cares about $r$, we can simplify this to:
$$Y^* = \frac{c_a + c_y t_a + a_a + G}{1 - c_y + c_y t_y - a_y} - \frac{a_r}{1 - c_y + c_y t_y - a_y} r$$
or
$$Y^* = A - \alpha r$$
with $A$ called the _autonomous demand_, containing all $r$-independent terms, and $\alpha$ containing all $r$-dependent terms.

We also now take into account the fact that markets react with some lag to changes in $r$:
$$Y^*_t = A - \alpha r_{t-1}$$

The macro-economic version of Cobb-Douglas is:
$$Y^* = pL^*$$
where $p$ is the _worker-productivity_.

## Inflation: the Phillips curve

Relates inflation to unemployment.

### Setting the wages in the factor market

Work is rented by firms from households in the factor-markets.
Wages are determined by the maximum firms will pay and the minimum unions will demand.

#### Supply side $w_r^S$

Unions can demand more wages if

- employment $L$ is already high
- they have much bargaining power $b$
- expected prices $P^{ex}$ are high

$$w^D_r = w^D_{nom} / P^{ex} = b + kL$$
This is the demand curve for wage $w$ as a function of $L$.

#### Demand side $w_r^D$

The macro-economic version of Cobb-Douglas is:
$$Y = pL$$
where $p$ is the _worker-productivity_.

The cost per unit is then:
$$\frac{Cost}{Y} = \frac{w_{nom}L}{Y} = \frac{w_{nom}}{p}$$

If companies are not in _perfect_ competition, they'll add a markup $m$ to their prices so they can make a profit:
$$P = (1+m)\frac{Cost}{Y} = (1+m)\frac{w_{nom}}{p}$$

Solving for $w_{nom}$:
$$w_{nom} = \frac{Pp}{1+m}$$
$$w^S_r = \frac{w_{nom}}{P} = \frac{p}{1+m}$$

This is the supply curve for $w$ as a function of $L$ ... but notice that $L$ does not appear in the function: the demand is a horizontal line!

#### Equilibrium $w^{eq}, L^{eq}$

$$L^{eq}: w^D_r(L) = w^S_r(L)$$
$$b + kL = \frac{p}{1+m}$$
$$L^{eq} = \frac{1}{k}[\frac{p}{1+m} - b]$$
$$w_r^{eq} = \frac{p}{1+m}$$

**Note** that with $L^{eq}$ we mean the labor at the factor-market equilibrium, _not_ the goods market equilibrium.
At steady state the labor that firms need to serve the goods market is equal to the labor that firms get for their wage-offer on the factor market. But when demand on the goods market requires more labor than $L^{eq}$, we get inflation:

### Causing inflation

Inflation is caused by lagging/wrong predictions of future price levels.

- Employment $L^*$ gets determined by a surge in demand on the goods-market
- $L^*$ is at a level above wage-equilibrium $L^N$.
- Employees and trade unions demand stronger increases in nominal wages in order to realize a higher real wage, initially assuming that the price level grows at the previous rate of inflation.
- Companies concede the nominal wage increase.
- But immediately after the nominal wage increase is negotiated, the companies realize an impending fall in their profit margin.
- In order to defend their profit margin, the companies raise prices, and thus the inflation rate, just enough to restore the original real wage.
- Thus we observe an increase in the inflation rate. This results from a conflict between target real wages and profits, or between employees and enterprises, which the enterprises can temporarily decide in their favour through an increase in the inflation rate.
- However, the employees have not reached their target and will therefore force the increase in nominal wages in the next period, which will then also cause the inflation rate to rise further.

This relation is described by the **Phillips curve**.

We begin with current labor $L^*$, as determined by the needs of the goods-market, being higher than $L^{N}$.

#### Unions increase demands

Unions will now (at time 0) demand an adjustment of real wages $\Delta w_r$ for the next year (time 1):

$$\Delta w_r = w_r^1(L^*) - w_r^0 = b + kL^* - (b + kL^N) = k(L^* - L^N)$$

But wage-negotiations are executed in _nominal_ money $\Delta w_{nom}$.

To transform real to nominal wage-change, we use a heuristic: the change in real wage is approximately the wage-inflation minus the global inflation:

$$\Delta w_r \approx \frac{\Delta w_{nom}}{w_{nom}^0} - \frac{\Delta P}{P^0}$$

We call $\frac{\Delta P}{P^0} = \Pi$ and approximate it by the last observed inflation $\Pi^0$.

This yields:
$$\frac{\Delta w_{nom}}{w_{nom}^0} \approx \Delta w_r  + \Pi^0 =  \Pi^0 +  k(L^* - L^N)$$

#### Firms adjust prices

Firms protect their margin by increasing prices $P^1$ after giving in to unions demanded $\frac{\Delta w_{nom}}{w_{nom}^0}$.

Remember that firms' prices are determined as:
$$P = (1+m)\frac{w_{nom}}{p}$$

Say one firm dominates the whole market, then increases in this firms prices equal inflation. That firm will increase prices such that $m$ stays the same:
$$\Pi^1 = \frac{\Delta P}{P^0} = \frac{ (1+m)\frac{\Delta w_{nom}}{p}  }{(1+m)\frac{w_{nom}^{eq}}{p}} = \frac{\Delta w_{nom}}{w_{nom}^{eq}}$$

#### Inflation higher than expected

Combining the unions' demand $\frac{\Delta w_{nom}}{w_{nom}^{eq}}$ with the firms' $\Pi$, we get a relation between inflation and labor:

$$\Pi^1 = \Pi^0 +  k(L^* - L^N)$$

This is known as the **Phillips curve**.

## Central bank policy

The fed attempts to minimize unemployment (or, better said, the difference between real employment $Y$ and $Y^N$) and at the same time to make $\Pi$ as close as possible to the target inflation $\Pi^T$. It does this by minimizing the function
$$E = (Y - Y^N)^2 + \beta(\Pi - \Pi^T)^2$$
$\beta$ determines the fed's policy: if it's bigger than one, the fed is mostly inflation-averse, if its smaller, its mostly unemployment-averse.

Now:

- substitute into $E$ the Phillips curve for $\Pi$
- substitute into $E$ the IS curve for $Y$ and $Y^N$, using $L^* = Y^*/p$
- Minimize to find the optimal $r$: $\frac{\partial E}{\partial r} = 0$

You'll obtain:
$$r^{eq} - r^1 = \frac{\beta k }{\alpha (1 + \frac{\beta k^2}{p})} (\Pi^0 - \Pi^T)$$
<small>(not sure about this, but the simplified below is correct)</small>

or simpler:
$$r^1 = r^{eq} - \beta \cdot cte(\Pi^1 - \Pi^T)$$

This is the **central bank policy**.

## Implementation

https://macrosimulation.org/a_new_keynesian_3_equation_model

```python
#%%
import numpy as np
import matplotlib.pyplot as plt

#%%



def simulate(A, pt, ye):
    Q = len(A)

    # Create arrays to store simulated data
    y = np.zeros(Q)  # Income/output
    p = np.zeros(Q)  # Inflation rate
    r = np.zeros(Q)  # Real interest rate
    rs = np.zeros(Q)  # Stabilizing interest rate

    # Set constant parameter values
    a1 = 0.3  # Sensitivity of inflation with respect to output gap
    a2 = 0.7  # Sensitivity of output with respect to interest rate
    b = 1     # Sensitivity of the central bank to inflation gap
    a3 = (a1 * (1 / (b * a2) + a2)) ** (-1)

    # Initialize endogenous variables at equilibrium values
    y[0] = ye[0]
    p[0] = pt[0]
    rs[0] = (A[0] - ye[0]) / a1
    r[0] = rs[0]

    # Simulate the model by looping over Q time periods for S different scenarios
    for t in range(1, Q):
        # (1) IS curve
        y[t] = A[t] - a1 * r[t - 1]
        # (2) Phillips Curve
        p[t] = p[t - 1] + a2 * (y[t] - ye[t])
        # (3) Stabilizing interest rate
        rs[t] = (A[t] - ye[t]) / a1
        # (4) Monetary policy rule, solved for r
        r[t] = rs[t] + a3 * (p[t] - pt[t])

    return y, p, rs, r


#%%

# Set number of periods
Q = 50
# Set parameter values
A = np.full(Q, 10)  # Autonomous spending
pt = np.full(Q, 2)  # Inflation target
ye = np.full(Q, 5)  # Potential output

# A[5:Q] = 12  # Scenario 1: AD boost
# pt[5:Q] = 3  # Scenario 2: Higher inflation target
ye[5:Q] = 7  # Scenario 3: Higher potential output

y, p, rs, r = simulate(A, pt, ye)


#%%

img, axes = plt.subplots(2, 1)
axes[0].plot(y, label="y: production")
axes[0].plot(p, label="p: inflation")
axes[0].legend()
axes[1].plot(rs, label="rs: stabilizing interest rate")
axes[1].plot(r, label="r: interest rate")
axes[1].legend()

# plt.plot(y)
# plt.plot(p)
# plt.plot(rs)
# plt.plot(r)
# %%

```

## Caveats

### investment trap

Strongly pessimistic expectations regarding future economic conditions, aggregate demand and the profitability of investment mean that even a significant reduction in the interest rate has little, if any, incentive effect on investment.

# Macro economics - agent based models

https://www.researchgate.net/profile/Edoardo-Gaffeo/publication/23536238_Adaptive_Microfoundations_for_Emergent_Macroeconomics/links/0912f513f4f7e3e7d3000000/Adaptive-Microfoundations-for-Emergent-Macroeconomics.pdf

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

## How banks create money

Required reserves: 10%

- Person A has 100$. -> Money supply: 100$
- Person A deposits 100$ in bank checking account. -> Checking accounts are part of money supply, so the money supply remains 100$.
- Bank lends 90$ to person B. -> Money supply: 190$, debt: 90$
- B deposits 90$ in another bank
- That bank lends 81$ to person C. -> Money supply: 271$, debt: 171$
- Repeat: next bank lends out 73$ -> Money supply: 344$, debt: 244$
- Repeat: ...
- Repeat: Money supply: 1000$, debt: 900$
- Money supply = initial deposit / reserve ratio

Note: When a person deposits 100$, the money supply increases by 1000$ - 100$ = 900$ (because the first 100$ were already in the money market). When the government buys back a bond for 100$ from a bank, the supply increases by 1000$, because the first 100$ were _not_ already in the market. When the government sells a bond for 100$, 100$ are removed from the money supply.

## How the fed adds and removes money
