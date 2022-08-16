import matplotlib.pyplot as plt
import math as m
import numpy as np


def partIntNum(x0, lambd, k):
    steps = 100
    delta = float(x0) / steps
    sm = 0
    for s in range(steps):
        x = s*delta
        a = x**k
        b = m.exp(-lambd*x)
        sm += delta * a * b
    return sm

def partInt(x0, lambd, k):
    corr = m.factorial(k) / (lambd**(k+1))
    ex = - m.exp(-lambd*x0)
    sm = 0
    for i in range(k+1):
        a = ( x0**(k-i) ) / ( lambd**(i+1) )
        b = m.factorial(k) / m.factorial(k-i)
        sm += a*b
    return ex * sm + corr

def erlang(x, lambd, k):
    a = lambd**k
    b = x**(k-1)
    c = m.exp(-lambd*x)
    d = m.factorial(k-1)
    return a * b * c / d

def erlangExpct(lambd, k):
    return k/lambd

def erlangCuml(x0, lambd, k):
    sm = 1
    for n in range(k):
        a = m.exp(-lambd*x0) / m.factorial(n)
        b = (lambd*x0)**n
        sm -= a*b
    return sm

def erlangPartialMoment(x0, lambd, k):
    a = lambd**k / m.factorial(k-1)
    b = partInt(x0, lambd, k)
    return a * b

def erlangExpctCond(x0, lambd, k):
    ex = erlangExpct(lambd, k)
    mm = erlangPartialMoment(x0, lambd, k)
    cl = erlangCuml(x0, lambd, k)
    return (ex - mm) / (1 - cl)


lambd = 4
k = 20

x0s = []
es = []
econd = []
for x0 in np.arange(0.1, 40, 0.1):
    x0s.append(x0)
    es.append(erlangExpct(lambd, k))
    econd.append(erlangExpctCond(x0, lambd, k))


plt.plot(x0s, x0s)
plt.plot(x0s, es)
plt.plot(x0s, econd)
plt.show()


