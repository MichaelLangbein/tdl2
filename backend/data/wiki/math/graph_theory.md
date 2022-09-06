$
\gdef\then{\to}
\gdef\thereis{\exists}
\gdef\iff{\leftrightarrow}
\gdef\intersection{\cap}
\gdef\union{\cup}
\gdef\reals{\mathbb{R}}
\gdef\naturals{\mathbb{N}}
\gdef\indeg{n_{in}}
\gdef\outdeg{n_{out}}
\gdef\paths{\text{paths}}
\gdef\degr{\text{degree}}
$

# Graph Theory

## General properties

### Degrees

> **Theorem**
> <a id="sumIndegreesIsNrEdges"></a>
> In a directed graph $\sum_{V_G} \indeg(v_n) = |E_G|$
> 
>> Proof by induction.
>>
>> Base step: $\sum_{V_G} \indeg(v_n) = |E_G|$ where $E_G = \{(v_1, v_2)\}$
>>> This is trivially true.
>>
>> Induction step.
>> - Let $\sum_{V_G} \indeg(v_n) = |E_G|$ 
>> - Let $V_{G'} = V_G \cup \{v_{N+1}\}$
>> - Let $E_{G'} = E_G \cup \{(x, y) \in V_G \times \{v_{N+1}\} \cup \{v_{N+1}\} \times V_G \}$
>>> For the left side it holds that: 
>>> $$ \sum_{V_{G'}} \indeg(v_n) = \sum_{V_G} \indeg(v_n) + \outdeg(v_{N+1}) + \indeg(v_{N+1}) $$
>>> On the other hand on the right side it holds that: 
>>> $$ |E_{G'}| = |E_G| + \outdeg(v_{N+1}) + \indeg(v_{N+1}) $$
>>> So the equation reduces to $0=0$, which is true.


> **Lemma** <a id="indegIsOutdeg"></a>
> $\sum_{V_G} \indeg(v_n) = \sum_{V_G} \outdeg(v_n)$


> **Lemma**
> In an undirected graph we have $\sum_{V_G} \degr(v_n) = 2|E_G|$

## Walks and paths

> **Definition** 
>  A walk is any sequence of vertices that are connected by an edge.


> **Definition** 
> A path is a walk where no vertex appears twice.


> **Theorem**
> The shortest walk between any two vertices in a graph is a path.
>
> Proof by contradiction. Suppose that the vertex $x$ appears twice in the shortest walk.
>> Since $x$ appears twice, the proposed walk must be of the form $f-x-g-x-h$, where $g$ is a sequence of $0$ or more connected vertices. Then this walk can be shortened to $f-x-h$.

> **Theorem**
> The longest path in a graph has length $ | V_G | - 1 $.

This is too trivial for a full-fledged proof: there are no repetitions in a path, so it can only have as many steps as it has vertices.


### Relations and adjacency matrices

Let $R \circ Q$ be a composition of two relations. The number of paths of length exactly $n$ between two vertices $x$ and $y$, written as $\paths_n(x, z)$, can be expressed  as 
 $$ \paths_n(x,z) = | \{ y | xRy \land yQz \} | = \sum_{y \in Y} xRy \cdot yQz$$


If $R_{AM}$ and $Q_{AM}$ are the adjacency matrix representations of the above relations, then: 

$$  R_{AM} \cdot Q_{AM} [n,m] = \sum_{y \in Y} R_{AM} [x_n, y] \cdot Q_{AM} [y, z_m] $$

$$ = \sum_{y \in Y} xRy \cdot yQz = \paths_n(x,z) $$

When $R=Q$, it follows easily that:

> **Theorem**
> $R_{AM}^2 [n,m]$ is the number of paths  that go from $v_n$ to $v_m$ in exactly $2$ steps.


> **Theorem** <a id="all_possible_paths"></a>
> $R_{AM}$ explains whether or not two vertices $v$ and $u$ are connected. All possible paths are listed in $R^* = R_{AM} \cup R_{AM}^2 \cup R_{AM}^3 \cup ... \cup R_{AM}^{|V_G|-1}$.
> We can find the length of the shortest path between two vertices $u$ and $v$ by




## Planar graphs

The following theorems all deal with planar, connected graphs, and build up to Eulers theorem. Well use $N$ for the number of nodes, $E$ for the number of edges, and $L$ for the number of loops.

> **Theorem** 
>Adding a edge to a planar, connected graph means adding one loop: $\Delta N = 0 \land \Delta E = 1 \then \Delta L = 1$

> **Theorem** 
> Adding x edges means adding x loops: $\Delta N = 0 \land \Delta E = x \then \Delta L = x$
>
>> Proof by induction on $\Delta E$.
>>
>> Base case: Assume $\Delta E = 1$. Proof that $\Delta L = 1$.
>>> Proven by theorem 11.
>>
>> Induction step: Let $\Delta N = 0 \land \Delta E = x \then \Delta L = x$. Proof that $\Delta N = 0 \land \Delta E = x+1 \then \Delta L = x+1$
>>> Consider the graph from the induction hypothesis, then apply theorem 12.


>**Theorem**
> When we add a new node to a graph and connect it to the graph using one or more edges, then the number of edges and loops behaves as such: $\Delta N = 1 \then \Delta L = \Delta E - 1$
>
>> Let $\Delta N = 1$.
>> 
>> By induction on $\Delta E$.
>> 
>> Base case: $\Delta E = 1$. Proof that $\Delta L = 0$
>>> Graphically trivial
>>
>> Induction step: $\Delta L = \Delta E - 1$. Proof that $\Delta L' = \Delta E' - 1$
>>> $\Delta E ' = \Delta E + 1$
>>>
>>> Using theorem 12, that means:
>>>
>>> $\Delta L' = \Delta L +1$
>>>
>>> Thus: 
>>>
>>> $\Delta L + 1 = \Delta E + 1 - 1$
>>>
>>> Which reduces to: 
>>>
>>> $\Delta L = \Delta E - 1$, which is true by the induction hypothesis.



> **Theorem**
> Eulers theorem: $N + L = E + 1$


> Proof that $N + L = E + 1$
>> By induction on $N$. 
>>
>> Base case: $N=1$ or $N=2$. Proof that $N + L = E + 1$
>>> If $N=1$: $1 + 0 = 0 + 1$
>>>
>>> If $N=2$: $2 + 0 = 1 + 1$
>>
>> Induction step: Let $N + L = E + 1$. Proof that $N+1 + L' = E' + 1$
>>>
>>> Using theorem 13: $\Delta L' = \Delta E - 1$
>>> 
>>> Thus:
>>> 
>>> $N + 1 + L + \Delta L = E + \Delta E + 1$
>>> 
>>> $N + L = E + 1$, which is true  by the induction hypothesis.




### Trees


Here is a fun little proof.

In a tree, the mean number of children ($mcc$) is always equal to $1 - 1/N$.

> Proof that $mcc = 1 - \frac{1}{N}$
>> With what we have so far, this is almost trivial to prove. 
>> The mean child count can be written as 
>> $$ mcc = \frac{1}{N} \sum_N \outdeg{v_n} $$
>> Using [theorem](#sumIndegreesIsNrEdges) and [lemma](#indegIsOutdeg), this becomes
>> $$ mcc = \frac{1}{N} E $$
>> Euler's formula in a tree becomes $N = E + 1$, since there are no loops in trees. Using this: 
>> $$ mcc = 1 - \frac{1}{N} $$ 
  


When training a binary classifier, we usually need a measure of defining which of several trees is a good representation of the data. The number of nodes, however, cannot be used as a measure, because it is always going to be $2n - 1$.

In a binary tree, the number of leaves $n$ equals $\frac{N+1}{2}$, regardless of the architecture of the tree.

> Proof that $n = \frac{N+1}{2}$
>> We shall use the fact that in any tree, $\sum_{V_G} \indeg(v_n) = \sum_{V_G} \outdeg(v_n)$.
>>
>> Consider the leaves of the tree. They all have $\indeg(v_n) = 1$ and $\outdeg(v_n) = 0$. Thus $\sum_{\text{leaves}} \indeg(v_n) = n$ and $\sum_{\text{leaves}} \outdeg(v_n) = 0$.
>>
>> Now consider the nodes (there are $N-n$ of them). 
>> They all have $\outdeg(v_n) = 2$ and $\indeg(v_n) = 1$, except for the root-node.
>>
>> Thus $\sum_{\text{nodes}} \indeg(v_n) = N - n - 1$ and $\sum_{\text{nodes}} \outdeg(v_n) = 2(N - n)$.
>> Equating the in- and out-degrees, we obtain:
>> $$ n + N - n - 1 = 0 + 2(N - n) $$
>> $$ n = \frac{N+1}{2} $$




### Triangulation

A *n-gon, a polygon with n nodes, can be drawn with $n-2$ triangles.
The proof follows from induction on $n$, starting at $n=3$.

> When drawing a n-gon ($n \geq 3$) using triangles, there are $n-3$ shared edges.
>> 
>>  - The n-gon has $n$ nodes, $n$ edges and one loop
>>  - The $n-2$ triangles have in total $n$ nodes, $n-2$ loops and (via Euler's formula) $2n-3$ edges.
>>  - The outer edges, that is, all the edges of the n-gon, are not shared. Thus, there are $e_{triangles} - e_{n-gon} = n-3$ shared edges.
>> 




## Stable marriage and Gayle-Shapely
In dating, the people doing the active flirting end up with partners higher up their preference-list than the people being flirted with.
```python
    class Person:
    def __init__(self, name):
        self.name = name
        self.prefs = []

    def setPreferences(self, prefs):
        self.prefs = prefs

    def __repr__(self):
        return self.name


class Woman(Person):
    def selectBest(self, suitors):
        for p in self.prefs:
            if p in suitors:
                print(f"{self} selected {p}")
                return p


class Man(Person):
    def getFavorite(self):
        print(f"{self} fancies {self.prefs[0]}")
        return self.prefs[0]

    def rejectedBy(self, w):
        print(f"{w} rejected {self}")
        self.prefs.remove(w)


rachel = Woman('Rachel')
phoebe = Woman('Phoebe')
monica = Woman('Monica')

ross = Man('Ross')
chandler = Man('Chandler')
joey = Man('Joey')

women = [rachel, phoebe, monica]
men = [ross, chandler, joey]

rachel.setPreferences([joey, ross, chandler])
phoebe.setPreferences([ross, chandler, joey])
monica.setPreferences([joey, chandler, ross])

ross.setPreferences([rachel, phoebe, monica])
chandler.setPreferences([rachel, monica, phoebe])
joey.setPreferences([phoebe, rachel, monica])


## Gayle - Shapely

flirting = {w: [] for w in women}

def isStable(flirting):
    for w in flirting:
        suitors = flirting[w]
        if len(suitors) != 1:
            return False
    return True


while not isStable(flirting):
    print("--- lets go, flirt! ----")

    # men move to their most desired woman
    for m in men:
        w = m.getFavorite()
        flirting[w].append(m)

    # women reject all but best suitor
    for w in women:
        suitors = flirting[w]
        fav = w.selectBest(suitors)
        for m in suitors:
            if m is not fav:
                m.rejectedBy(w)
        if fav:
            flirting[w] = [fav]


print(" ---- couples have formed: ---- ")
for w in flirting:
    m = flirting[w][0]
    print(f"{w} + {m}")
```

