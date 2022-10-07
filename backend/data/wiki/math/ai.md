$
\gdef\then{\to}
\gdef\thereis{\exists}
\gdef\iff{\leftrightarrow}
\gdef\intersection{\cap}
\gdef\union{\cup}
\gdef\reals{\mathbb{R}}
\gdef\naturals{\mathbb{N}}
\gdef\partDiff#1#2{\frac{\mathop{d#1}}{\mathop{d#2}}}
\gdef\convol{\circledast}
\gdef\pointwise{\odot}
\gdef\mtrx#1{\mathbf{#1}}
\gdef\myarray#1{
    \begin{bmatrix}
        #1 \\
    \end{bmatrix}
}
$


# Machine learning

## Neural networks

### Backpropagation
The analytical way of deriving the backpropagation algorithm consist of just a few steps. 
A few definitions: 


 - A layers output-vector $\vec{y}^l$ is obtained by the activation function $\vec{y}^l = f(\vec{x}^l)$
 - The layers input-vector is obtained as a weighted sum of previous outputs: $\vec{x}^l = \mtrx{W}^l \vec{y}^{l-1}$. We can express a single $x_t^l = \sum_f W_{t,f}^l y_f^{l-1}$
 - We strive to minimize the error-function. Assuming only one single training item we get $e = \frac{1}{2} \sum_t (\vec{y}^*_t - \vec{y}^L_t)^2 = \frac{1}{2} (\vec{y}^* - \vec{y}^L) \pointwise (\vec{y}^* - \vec{y}^L)$


Let's first consider only the top layer. 

$$
    \partDiff{e}{x_{t_0}^L} &= \frac{1}{2} \sum_t \partDiff{}{x_{t_0}^L} (\vec{y}^*_t - \vec{y}^L_t)^2  \\
                            &= (y_{t_0}^* - y_{t_0}^L) f'(x_{t_0}) 
$$

Or, in vector form: 

$$
\partDiff{e}{\vec{x}^L} = (\vec{y}^* - \vec{y}^L)^T \pointwise f'(\vec{x}^L)
$$


That part was easy. But how do we obtain the same differential for *any* layer $l$?

$$
\begin{align}
\partDiff{e}{x_{f_0}^l} &= \sum_t \partDiff{e}{x_t^{l+1}} \partDiff{x_t^{l+1}}{x_{f_0}^l}  \\
                        &= \sum_t \partDiff{e}{x_t^{l+1}} \partDiff{}{x_{f_0}^l} ( \sum_f W_{t,f}^{l+1} y_f^l ) \\
                        &= \sum_t \partDiff{e}{x_t^{l+1}} W_{t,f_0}^{l+1} f'(x_{f_0}^l)
\end{align}
$$

Or, in vector form: 

$$ \partDiff{e}{\vec{x}^l} = ( \partDiff{e}{\vec{x}^{l+1}} \mtrx{W}^{l+1} ) \pointwise f'(\vec{x}^l)  $$

The smart part here was to not derive $ \partDiff{e}{\vec{x}^l} $ by going through $\vec{y}^L$, $\vec{x}^L$, $\mtrx{W}^L$, $\vec{y}^{L-1}$, $\vec{x}^{L-1}$, $\mtrx{W}^{L-1}$, ..., but by instead creating a recurrence relation by differentiating by $\vec{x}^{l+1}$.

Finally, we can obtain the gradient at our weights as: 

$$ 
\begin{aligned}
    \partDiff{e}{W_{t_0, f_0}^l} &= \partDiff{e}{x_{t_0}^l} \partDiff{x_{t_0}^l}{W_{t_0, f_0}^l} \\
                                 &= \partDiff{e}{x_{t_0}^l} \partDiff{}{W_{t_0, f_0}^l} ( \sum_f W_{t_0, f}^l y_f^{l-1} ) \\
                                 &= \partDiff{e}{x_{t_0}^l} y_{f_0}^{l-1}
\end{aligned}
$$

Or, in vector form: 

$$ \partDiff{e}{\mtrx{W}^l} = \left( \partDiff{e}{\vec{x}^l} \right)^T  \left( \vec{y}^{l-1} \right)^T $$ 

So we should change the weights by: 

$$ 
\begin{aligned}
    \Delta \mtrx{W}^l &= - \alpha \partDiff{e}{\mtrx{W}^l} \\
                      &= - \alpha \partDiff{e}{\vec{x}^l} \vec{y}^{l-1} 
\end{aligned}
$$


It makes sense to reiterate the whole process in matrix-form. 

First, we  get $\delta^L$:
$$ \partDiff{e}{\vec{y}^L} = (\vec{y}^* - \vec{y}^L)^T := \delta^L $$ 

Then we go through the highest layer:
$$ \partDiff{e}{\vec{x}^L} = \delta^L \pointwise f'(\vec{x}^L)  $$
$$ \partDiff{e}{\mtrx{W}^L} = \left( \partDiff{e}{\vec{x}^L} \right)^T \left( \vec{y}^{L-1} \right)^T $$
$$ \delta^{L-1} = \partDiff{e}{\vec{x}^L} \mtrx{W}^L $$

Then we pass $\delta^{L-1}$ to the next layer. 
$$ \partDiff{e}{\vec{x}^l} = \delta^l \pointwise f'(\vec{x}^l)  $$
$$ \partDiff{e}{\mtrx{W}^l} = \left( \partDiff{e}{\vec{x}^l} \right)^T  \left( \vec{y}^{l-1} \right)^T $$
$$ \delta^{l-1} = \partDiff{e}{\vec{x}^l} \mtrx{W}^l $$



### Universal approximation
Let $f$ be a function mapping images to labels. $f$ stems from a vector space of functions $\mathscr{F}$. Let $B$ be a basis for $\mathscr{F}$, meaning that 
$$ \forall f \in \mathscr{F}: \thereis \vec{\alpha}: \sum \alpha_n b_n = f $$
So far, so simple. This holds for any basis of any vector space. Let's just propose that sigmoid functions do constitute a basis for these image-to-label functions. We cannot prove this, since we don't know what the image-to-label functions look like, but notice the potential: 
$ \sum \alpha_n b_n $ is then just the output of one layer of a neural net!

It turns out that sigmoid functions do indeed form a basis for any continuous function on $[0,1]^n$ (Note also that, while sigmoids do form a basis, they do not constitute an *orthogonal* basis, meaning that we cannot obtain weights with the inner-product-trick. We couldn't have obtained them anyway, because for that trick we need the analytical form of $f$, which is generally not known to us.).

There is an important point that the universal approximation theorem does not cover, however. The UAT only deals with a single layer net. We know from practice, however, that a multilayer net can approximate functions with far less nodes than what a single-layer net would need. There is some strength to having multiple layers.



### Some data in n dimensions requires more than n neurons in a layer
The backpropagation algorithm requires a networks layers to transform its input data in a continuous fashion, i.e. distort the input surface without cutting it at any point. In topology, such a transformation is known as a homomorphism.  

### Some functions can be better approximated with a deep net than with a shallow one
Consider the case of a hierarchical function. 
$$ f(x_1, x_2) = h_2( h_11(x_1), h_12(x_2))$$
We will prove that a deep net needs less neurons than a shallow one to approximate this function.





### Convolutional networks

These are the networks most commonly found employed in image-classification. Really, they are just a simplified version of our backpropagation-networks (they are even trained using an only slightly altered algorithm). Instead of connecting every node from layer $l$ to every node of layer $l+1$, they impose some restrictions on the connection-matrix:

- Nodes are connected in a pyramid scheme. A node on layer $l+1$ is connected to 9 nodes directly beneath it. Instead of a $n_l \times n_{l+1}$ connection matrix, we thus have several $9 \times 1$ matrices.
- The connection-strengths of these  $9 \times 1$ matrices are all the same - so really there is only just one  $9 \times 1$ matrix. 

These restrictions are inspired by the physiology of the visual cortex. They have the nice effect that a network is trained much faster, since they massively reduce the amount of weights that need to be learned. 

In practice, such networks have a few convolutional layers to reduce the dimension of the input-images, followed by a few conventional, fully connected layers that learn some logic based on the reduced images. 

We give the backpropagation-steps for convolutional layers and pooling layers. 

In convolutional layers, the forward step goes: 

$$ \vec{x}^l = \vec{y}^{l-1} \convol \vec{w}^l $$
$$ \vec{y}^l = f(\vec{x}^l) $$

Where the convolution is defined (in our simplified case) as:
$$ (\vec{y} \convol \vec{w})_n = \sum_{m=-1}^1 \vec{y}_{n+m} \vec{w}_m $$

Differentiating a convolution is unfamiliar, but not too hard: 
$$ \partDiff{(\vec{y} \convol \vec{w})}{\vec{w}} = \myarray{
	0   && y_0 && y_1 \\
	y_0 && y_1 && y_2 \\
	y_1 && y_2 && y_3 \\
	... \\
	y_{l-1} && y_l && 0 \\
} := tr(\vec{y}) $$
$$ \partDiff{(\vec{y} \convol \vec{w})}{\vec{y}} = \myarray{
	w_0    && w_1    && 0   && ... \\
	w_{-1} && w_0    && w_1 && ... \\
	0      && w_{-1} && w_0 && ... \\
	...    \\
	0      && ...    && w_{-1} && w_0 \\
} := br(\vec{w}) $$



Accordingly, the backwards step goes:

$$ \partDiff{e}{\vec{x}^l} = \delta^l \pointwise f'(\vec{x}^l) $$
$$ \partDiff{e}{\vec{w}^l} = \partDiff{e}{\vec{x}^l} tr(\vec{y}) = (\sum_{n=1}^l e'_{x_n} y_{n+1}, \sum_{n=0}^l e'_{x_n} y_n, \sum_{n=0}^{l-1} e'_{x_n} y_{n+1}) $$
$$ \delta^{l-1} = \partDiff{e}{\vec{x}^l} br(\vec{w}) = \partDiff{e}{\vec{x}^l} \convol \vec{w} $$

In pooling layers, the forward step goes: 

$$ x_t^l = \frac{1}{4} \sum_f y_{4t + f}^{l-1} $$
$$ y_t^l = x_t^l $$

And the  backwards step: 

$$ \partDiff{e}{\vec{x}^l} = \partDiff{e}{\vec{y}^l} \partDiff{\vec{y}^l}{\vec{x}^l}  = \delta^l  $$
$$ \partDiff{e}{\vec{w}^l} = 0 $$
$$ \delta^{l-1} = \frac{1}{4} \partDiff{e}{\vec{x}^l}  $$


### Self organizing maps
Self organizing maps are another, fundamentally different type of neural network. Where feedforward nets employ supervised learning with backpropagation, SOM's do unsupervised learning with a competitive algorithm. 


## Computer vision

**Feature detection and pose estimation**

Say you want to locate the position of the nose in a portrait. 



# Feature extraction and dimensionality reduction
The art of preprocessing input has developed in a branch of machine learning itself. Classifiers like SVM's and nnets work better when they get cleaned up and encoded input instead of raw data. 



# Symbolic AI

Contrary to the before mentioned approaches, symbolic AI uses logical deduction instead of numerical processing to arrive at decisions. If neural nets and decision-trees learning from data can be called building *experience*, then an inference engine deducting from rules can be called building *expertise*. A good tutorial can be found here: [codeproject.com](codeproject.com/Articles/179375/Man-Marriage-and-Machine-Adventures-in-Artificia).


## Inference engine

A inference engine can do the following: 

- Learning: 	
	- Gather if-then statements (usually in the form of Horn-clauses).
	- Create a graph of dependencies between statements (a so called and-or-tree).	
- Applying the learned things: Given a question:	
	- Possible answers: find all potential answers to the problem
	- Backward pass: go through the graph to see what data is required
	- Data acquisition: ask user to provide the data
	- Forward pass: trace the graph forward again to arrive at a single one of the possible answers
		


Depending on how much effort you put into the expressions that the engine can understand, we differentiate between different levels of logic: 

- 0th order logic: understands simple facts and chains them using modus ponens
- 1st order logic: understands variables: all of naive math can be written in 1st order logic.
- higher order logic: is better at inference; can create new if-then-statements as a result of inference or even explore


Popular expert-system-libraries are Prolog, CLIPS and Pyke.

There are many variants to how you can write an expert system. 
The most important variables are 

- How are rules parsed? Do we allow for other logical connectives than 'AND'? See [this example](https://medium.com/a-42-journey/expert-systems-how-to-implement-a-backward-chaining-resolver-in-python-bf7d8924f72f).
- How is inference done? Forward pass on `addFact` or backward pass on `eval`, or a mixture? 
- How is pattern-matching done? The Rete-algorithm is very popular for this.
- Are meta-heuristics used? 
	- Does the engine try to infer more general rules while idle? 
	- Does the engine keep track if a search down one branch takes very long (needs a watching strategy-module)?
		


```python
class InferenceEngine:
    def __init__(self):
        self.facts = []
        self.rules = []

    def addFact(self, *fact):
        if fact not in self.facts:
            self.facts.append(fact)  # add the fact
            print(f"Just learned that {fact}")
        for arg in fact[1:]:
            if not self.__isVariable(arg):
                self.addFact(arg) # add all arguments

    def addRule(self, conditions, consequence):
        newRule = {'conditions': conditions, 'consequence': consequence}
        if not newRule in self.rules:
            self.rules.append(newRule)
            print(f"Just learned that {newRule}")

    def eval(self, *statement):
        print(f"Evaluating whether '{statement}' holds true")
        fact = self.__searchFacts(*statement)
        if fact:
            return fact
        fact = self.__tryToProve(*statement)
        if fact:
            return fact
        print(f"No, '{statement}' holds not true")
        return False

    def __searchFacts(self, *statement):
        for fact in self.facts:
            if self.__statementsMatch(fact, statement):
                return fact
        return False

    def __tryToProve(self, *statement):
        # a professional inference engine would probably use Rete here
        candidateRules = self.__findCandidateRules(*statement)
        for candidateRule in candidateRules:
            substitutedRule = self.__setRuleVariablesByStatement(candidateRule, statement)
            facts = self.__evalAll(substitutedRule['conditions'])
            if facts:
                substitutedRule = self.__setRuleVariablesByStatements(substitutedRule, facts)
                self.addFact(*substitutedRule['consequence'])
                return substitutedRule['consequence']
        return False

    def __evalAll(self, statements):
        facts = []
        for statement in statements:
            fact = self.eval(*statement)
            if not fact:
                return False
            else:
                facts.append(fact)
        return facts

    '''
    -----------------  helpers -------------------------
    '''

    def __setRuleVariablesByStatements(self, rule, statements):
        newRule = dict(rule)
        for statement in statements:
            newRule = self.__setRuleVariablesByStatement(newRule, statement)
        return newRule

    def __setRuleVariablesByStatement(self, rule, statement):
        substitutionDict = {}
        for ruleArg, stateArg in zip(rule['consequence'][1:], statement[1:]):
            if self.__isVariable(ruleArg):
                substitutionDict[ruleArg] = stateArg
        return self.__setRuleVariablesByDict(rule, substitutionDict)

    def __setRuleVariablesByDict(self, rule, subsDict):
        newRule = {'conditions': [], 'consequence': None}
        for condition in rule['conditions']:
            newCondition = self.__setVariablesByDict(condition, subsDict)
            newRule['conditions'].append(newCondition)
        newConsequence = self.__setVariablesByDict(rule['consequence'], subsDict)
        newRule['consequence'] = newConsequence
        return newRule

    def __setVariablesByDict(self, statement, subsDict):
        newStatement = [statement[0]]
        for arg in statement[1:]:
            if self.__isVariable(arg) and arg in subsDict:
                newStatement.append(subsDict[arg])
            else:
                newStatement.append(arg)
        return newStatement

    def __findCandidateRules(self, *statement):
        candidates = []
        for rule in self.rules:
            if self.__statementsMatch(rule['consequence'], statement):
                candidates.append(rule)
        return candidates

    def __statementsMatch(self, statementOne, statementTwo):
        for wordOne, wordTwo in zip(statementOne, statementTwo):
            oneIsVal = not self.__isVariable(wordOne)
            twoIsVal = not self.__isVariable(wordTwo)
            if oneIsVal and twoIsVal: # ? (oneIsVar and twoIsVar) or (not oneIsVar and not twoIsVar):
                if wordOne != wordTwo:
                    return False
        return True

    def __isVariable(self, arg):
        return isinstance(arg, str) and arg[0].isupper()





if __name__ == '__main__':
    e = InferenceEngine() 

    # Test 0: obligatory Socrates test
    e.addRule([
        ['man', 'X']
    ], ['mortal', 'X'])
    e.addFact('man', 'socrates')
    print(e.eval('mortal', 'Y'))
```


## Constraint satisfaction
This is actually a somewhat simpler form of logic machine.

```python
#%%
# https://www.youtube.com/watch?v=Yo-xat4cn8M


class Var:
    def __init__(self, name, range):
        self.name = name
        self.range = range

    def decided(self):
        return len(self.range) == 1

    def decide(self, val):
        return Var(self.name, [val])

    def __repr__(self) -> str:
        if self.decided():
            return f"Var({self.name} - {self.range[0]})"
        return f"Var({self.name} - {self.range})"


class Fac:
    def __init__(self, inputNames, func):
        self.inputNames = inputNames
        self.func = func

    def applicable(self, vars):
        for inputName in self.inputNames:
            inputVar = first(vars, lambda v: v.name == inputName)
            if not inputVar:
                return False
            if not inputVar.decided():
                return False
        return True
   
    def apply(self, vars):
        inputs = []
        for inputName in self.inputNames:
            inputVar = first(vars, lambda v: v.name == inputName)
            inputs.append(inputVar)
        return self.func(*inputs)

    def __repr__(self) -> str:
        return f"Fac({self.vars.join(', ')})"


#%%

# user may overwrite this
def orderVars(vars, facs):
    # return most constrained var first
    def sortFunc(var):
        if var.decided():
            return 999999
        else:
            return len(var.range)
    vars.sort(key = sortFunc)
    return vars

# user may overwrite this
def orderVals(var, vars, facs):
    # return least constraining values first
    return var.range

# user may overwrite this
def updateDomain(var, vars, facs):
    # restrict domain of var
    return var


bestRating = 0
@memoize
def solve(vars, facs, rating = 1):
    if all(vars, lambda var: var.decided()):
        if rating > bestRating:
            bestRating = rating
        yield (rating, vars)

    else:
        for var in orderVars(vars, facs):
            for val in orderVals(var, vars, facs):

                # Step 1: new variable set with decided value
                varDecided = var.decide(val)
                otherVars = allExcept(vars, var)
                newVars = [*otherVars, varDecided]
                # print(f"Trying {newVars} ...")

                # Step 2: evaluate set.
                subRating = 1
                for fac in facs:
                    if fac.applicable(newVars):
                        subRating *= fac.apply(newVars)
                # If inconsistent, stop here.
                if subRating == 0:
                    continue
                # If another combination was already better
                # than anything we can get from here, stop, too.
                if bestRating > rating * subRating:
                    continue

                # Step 3: adjust domains of other variables through lookahead
                # This step is optional because if we don't do it, inconsistent values
                # will be filtered out in the next recursion ...
                # ... but here we have a chance to do something smart
                # that removes multiple values at once.
                updatedVars = [
                    updateDomain(var, newVars, facs)
                    for var in newVars
                ]

                for result in solve(updatedVars, facs, rating * subRating):
                    yield result



#%%

colors = ['R', 'G', 'B']

def differentColor(state1, state2):
    if state1.decided() and state2.decided():
        if state1.range[0] == state2.range[0]:
            return 0
    return 1

wa = Var('WA', colors)
nt = Var('NT', colors)
wa_nt = Fac(['WA', 'NT'], differentColor)
sa = Var('SA', colors)
wa_sa = Fac(['WA', 'SA'], differentColor)
nt_sa = Fac(['NT', 'SA'], differentColor)
qu = Var('QU', colors)
nt_qu = Fac(['NT', 'QU'], differentColor)
sa_qu = Fac(['SA', 'QU'], differentColor)
nw = Var('NW', colors)
qu_nw = Fac(['QU', 'NW'], differentColor)
sa_nw = Fac(['SA', 'NW'], differentColor)
vc = Var('VC', colors)
sa_vc = Fac(['SA', 'VC'], differentColor)
nw_vc = Fac(['NW', 'VC'], differentColor)
ta = Var('TA', colors)


vars = [wa, nt, sa, qu, nw, vc, ta]
facs = [wa_nt, wa_sa, nt_sa, nt_qu, sa_qu, qu_nw, sa_nw, sa_vc, nw_vc]

for i, result in enumerate(solve(vars, facs)):
    print(i, result)

# %%

```



## Markov decision processes

We move from *state* to state through *action*s.
Actions applied to a state yield another state *probabilistic*ally.
Arriving at a new state yields some *reward*.
We try to find a *policy* which maximizes our *cumulative* reward, aka. the *value*.

- $s$: **State**.
- $a$: **Action**. Probabilistic - might result in $s' = s_1$ or $s' = s_2$ or ...
- $P_a(s, s') = P(s_{t+1} = s' | s_t = s, a_t = a)$: **Transition probabilities**
- $R_a(s, s')$: Immediate **reward** for getting to state $s'$ from $s$ through $a$
- $\pi(s) = a$: **Policy**: decides on which action to take given a state.


Once a policy $\pi$ has been decided on, this process reduces to a Markov-chain.
$P(s' | s, a)$ reduces to $P(s' | s)$.

The objective is to chose a $\pi$ that will maximize my cumulative reward: 

$$ E[ \Sigma_{t=0..\infty} \gamma^t R_{a_t}(s_{t}, s_{t+1}) ] $$
Where $\gamma$ is some discount value $0 \leq \gamma \leq 1$ which accounts for the fact that I'd rather have my earnings today than tomorrow.

The value $V = E[U]$ is defined as the expected reward. This expands to:
$$
\begin{aligned}
U    &= R(s_1 | s_0) + \gamma R(s_2 | s_1) + ...  \\
E[U] &= E[R(s_1 | s_0)] + \gamma E[R(s_2 | s_1)] + ... \\
     &= \Sigma_{s_1} P(s_1) R(s_1 | s_0) + \gamma \Sigma_{s_1} P(s_1) E | s_1[R(s_2 | s_1)]   + ... \\
     &= \Sigma_{s_1} P(s_1) R(s_1 | s_0) + \gamma \Sigma_{s_1} \Sigma_{s_2} P(s_1) P(s_2 | s_1) R(s_2 | s_1) + ...
\end{aligned}
$$

This is a recursive calculation. So, given a policy we can calculate our value per state:
$$ V(s) | \pi = \Sigma_{s'} P_{\pi(s)}(s, s') [ R_{\pi(s)}(s, s') + \gamma V(s')] $$



And we can chose $\pi(s)$ like so:
$$ \pi(s) | V = \text{argmax}_a \{ \Sigma_{s'} P_a(s, s')[R_a(s, s') + \gamma V(s')] \} $$


This requires a lot of back- and forth-iteration, but will eventually yield a correct solution.


```python
def calcValue(policy, s):
    if isEndState(s):
        return 0
    a = policy[s]
    v = 0
    for sNext in S:
        vNow = reward(sNext, s, a)
        vFut = calcValue(policy, sNext)
        v += prob(sNext, s, a) * (vNow + gamma * vFut)
    return v


def calcPolicy(value, s):
    vMax = 0
    for a in A:
        v = 0
        for sNext in S:
            vNow = reward(sNext, s, a)
            vFut = value[sNext]
            v += prob(sNext, s, a) * (vNow + gamma * vFut)
        if v > vMax:
            vMax = v
            aOpt = a
    return aOpt

p = {...}
v = {...}
while delta > 0.01:
    pLast = p
    for s in S:
        v[s] = calcValue(p, s)
    for s in S:
        p[s] = calcPolicy(v, s)
    delta = maxDif(p, pLast)


```