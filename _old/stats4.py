import math as m
import matplotlib.pyplot as plt


def cml(x0, lambd):
    return 1.0 - m.exp(-lambd*x0)


def cmlMom(x0, lambd):
    a = - m.exp(-lambd * x0)
    b = x0 + 1/lambd
    c = 1/lambd
    return a*b + c

def expcCond(x0, lambd):
    a = 1.0/lambd - cmlMom(x0, lambd)
    b = 1.0 - cml(x0, lambd)
    return a/b

def expcCondAn(x0, lambd):
    return x0 + 1.0/lambd


mean = 200
lambd = 1.0/mean
iss = []
es = []
ecs = []
ecas = []
for i in range(1, 10 * mean):
    iss.append(i)
    es.append(mean)
    ecs.append(expcCond(i, lambd))
    ecas.append(expcCondAn(i, lambd))

plt.plot(iss, iss)
plt.plot(iss, es)
#plt.plot(iss, ecs)
plt.plot(iss, ecas)
plt.show()
