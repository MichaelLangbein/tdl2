#%%
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

# %%
