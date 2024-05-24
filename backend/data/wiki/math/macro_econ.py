#%% https://macrosimulation.org/a_neoclassical_macro_model

"""
Y = real output, 
K = capital stock, 
N = employment, 
w = real wage, 
C = consumption, 
G = government expenditure, 
r = real interest rate, 
I = investment, 
r_n = nominal interest rate, 
pi = inflation, 
M_s = money supply, 
M_d = money demand,
P_t = price level

Assumptions:
- Output: (Cobb-Douglass) Y = AK^a * N^(1-a), a in (0,1)
- Classical dichotomy aka neutrality of money: money supply is exogenous, only impacts price level, not real economy
- Ricardian equivalence: Government expenditures crowd out private expenditures
- Sort-term model: prices are flexible, capital stock is fixed

"""

#%%
import math as m


# Cobb Douglass parameter
A = 2
a = 0.5 # a in (0, 1), capital elasticity of output

# Household utility function weights
b1 = 0.4  # b1 > 0
b2 = 0.9  # discount rate
b3 = 0.6  # household preference for money

# Derived parameters
c1 = 1 / (1 + b2 + b3)
c2 = b1 * (b2 * b3)

G0 = 1 # government expenditure
M0 = 10 # money supply
K = 5
pi_future = 0.02
Y_future = 1

def calcRealOutput(capital, employment):
    return A * m.pow(capital, a) * m.pow(employment, 1-a)

# def calcRealOutput(consumption, investment, governmentExpenditure):
#     # goods market equilibrium condition
#     return consumption + investment + governmentExpenditure

def calcRealWage(capital, employment):
    # labor demand of firms, solved for real wage
    return (1-a) * A * m.pow(capital, a) * m.pow(employment, -a)

def calcEmployment(realWage):
    # labor supply: simple linear curve, up to 1, b1 is empirical
    return 1 - b1 / realWage

def calcConsumption(realOutput, governmentExpenditure, realOutputFuture, governmentExpenditureFuture, realInterestRate, realWage):
    # consumption demand
    # consumption smoothing: if governments spends much today, it'll have to raise taxes tomorrow, so better save up today.
    income = realOutput - governmentExpenditure
    futureIncome = (realOutputFuture - governmentExpenditureFuture) / (1 - realInterestRate)
    return c1 * (income + futureIncome - c2 * m.log(b1 / realWage))

def calcInvestment(realOutput, consumption, governmentExpenditure):
    # investment demand
    # equilibrium between investment and saving is interpreted as loanable-funds-market
    # return m.pow(a * A * m.pow(employment, 1-a) / realInterestRate, 1/(1-a))
    # goods marked equilibrium condition, solved for I
    return realOutput - consumption - governmentExpenditure

def calcRealInterestRate(employment, investment):
    # investment demand, solved for r
    return m.pow(investment, a-1) * a * A * m.pow(employment, 1-a)

def calcGovernmentExpenditure():
    return G0

def calcNominalInterestRate(realInterestRate, futureInflation):
    # fisher equation
    return realInterestRate + futureInflation

def  calcMoneySupply():
    return M0

def calcMoneyDemand(nominalInterestRate, priceLevel, consumption):
    return b3 * (1 + nominalInterestRate) * priceLevel * consumption / nominalInterestRate

def calcMoney():
    # money market equilibrium condition: M = M_d(P) = M_s
    return M0

def calcPriceLevel(moneySupply, nominalInterestRate, consumption):
    nom = moneySupply * nominalInterestRate
    denom = (1 + nominalInterestRate) * b3 * consumption
    return nom / denom


#%%
capital = 1
employment = 1
realOutput = 1
realWage = 1
consumption = 1
governmentExpenditure = G0
governmentExpenditureFuture = G0
realOutputFuture = 1
realInterestRate = 0.01
nominalInterestRate = 0.01
investment = 1
futureInflation = 1
priceLevel = 1

# solving relations through fixed-point iteration:
for i in range(100):
    governmentExpenditure = calcGovernmentExpenditure()
    realOutput = calcRealOutput(capital, employment)
    realWage = calcRealWage(capital, employment)
    employment = calcEmployment(realWage)
    consumption = calcConsumption(realOutput, governmentExpenditure, realOutputFuture, governmentExpenditureFuture, realInterestRate, realWage)
    investment = calcInvestment(realOutput, consumption, governmentExpenditure)
    realInterestRate = calcRealInterestRate(employment, investment)
    nominalInterestRate = calcNominalInterestRate(realInterestRate, futureInflation)
    priceLevel = calcPriceLevel(M0, nominalInterestRate, consumption)


# %%
