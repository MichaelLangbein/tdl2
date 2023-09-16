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

plotter.plotMarketSupplyAndDemand(market)

averageProfits = []
nrFirms = []
marketPrices = []
quantities = []
for t in range(200):
    market.longTermCycle()
    averageProfits.append(market.averageProfit())
    nrFirms.append(len(market.firms))
    marketPrice, qProduced = market.settledPriceAndQuantity() 
    marketPrices.append(marketPrice)
    quantities.append(qProduced)

fig, axes = plotter.plotMarketSupplyAndDemand(market)
fig.show()


#%%
fig, axes = plotter.plotFirmCurves(market.firms[2], market)
fig.show()

#%%
fig, axes = plt.subplots(1, 1)
axes.plot(averageProfits)
axes.plot(nrFirms)


# %%
