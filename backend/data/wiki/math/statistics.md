# Statistics

## Correlation

Assume an inner product space.

## Linear regression

Assume that reality can me modelled by a model like this one:

$$ \vec{y} = \mathbf{X} \vec{w} + \vec{e} $$

Not knowing $\vec{e}$, our best guess at the outcome would be

$$ \vec{\hat{y}} = \mathbf{X} \vec{w} $$

We can find the gradient of w by:

$$ \frac{ \partial E}{ \partial \vec{w}} = - (\vec{y} - \vec{\hat{y}}) \mathbf{X} $$

### You are absolutely allowed to invert a linear regression relation

Linear regressions are focussed on $P(y | x)$ ... but you can absolutely revert that relation. For example, you are allowed to predict size from basketball scores, even though in reality it's likely the other way round.

Assume
$$ y = \alpha x + \epsilon $$
and 
$$ \epsilon ~ N(0, \sigma^2*\epsilon), x ~ N(\mu_x, \sigma^2_x)$$
This yields $P(y|x) = N(\alpha x, \sigma^2*\epsilon)$. But in the same vain we may also write
$$ x = \frac{y}{\alpha} - \frac{\epsilon}{\alpha} $$
With:
$$ P(x|y) = N(\frac{\mu*y}{\alpha}, \frac{\sigma^2*\epsilon}{\alpha^2}) $$

We can also arrive at the same joint distribution $P(x, y)$ coming from $x$ as well as from $y$.

$$
    \begin{aligned}
        P(x, y) &= P(y|x) P(x) &= N(\alpha x, \sigma^2_\epsilon) N(\mu_x, \sigma^2_x) \\
                &= P(x|y) P(y) &= N( \frac{y}{\alpha}, \frac{\sigma^2_\epsilon}{\alpha^2} ) \int_X P(x, y)
    \end{aligned}
$$

All the regression-model tells us, is that there is a relation $ y = \alpha x + \epsilon $ between $x$ and $y$. It does _not_ imply a direction or causality.

## Spatial modelling

### Generalized least squares

like linear regression, but errors are not iid, but allowed to be correlated.

### Gaussian processes

Gaussian processes are a means of interpolating a value $y_x$ from surrounding values $y_x = \sum \alpha_i y_i$. Basic intuition from [here](https://bookdown.org/rbg/surrogates/chap5.html).
That is different from what linear regression or its extension GLS do: regression predicts $y$ from explanatory variables $x$, assuming a (linear) model.
Gaussian processes don't do that. They only interpolate between already observed $y$'s. No model is assumed.

Consider the $n \times m$ surface $\mathbf{Y}$. Assume that the value of any pixel in $\mathbf{Y}$ follows a gaussian distribution - which may be correlated to all other pixels in $\mathbf{Y}$.
Millions of surfaces $\mathbf{Y}$ may be sampled from $N(\vec{0}, \mathbf{\Sigma}) = P(\mathbf{Y})$, where $\vec{0}$ is of size $n \times m$ and $\mathbf{\Sigma}$ is of size $nm \times nm$.
We call $P(\mathbf{Y})$ the prior. $\mathbf{\Sigma}$ can be very large, so we assume that it can be modeled by a covariance-function $cov(h)$ which is _only dependent on the distance between two points, not on the points themselves_.

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import multivariate_normal


NOISEFACTOR = 0.001


def size(x):
    return np.sqrt(np.sum(np.power(x, 2)))

def distance(x0, x1):
    return size(x0 - x1)

def getDistanceMatrix(rowPoints, colPoints):
    # deliberately not exploiting symmetry
    # <- this way it works with non-square matrices, too.
    rows = len(rowPoints)
    cols = len(colPoints)
    distances = np.zeros((rows, cols))
    for i in range(rows):
        for j in range(cols):
            p0 = rowPoints[i]
            p1 = colPoints[j]
            d = distance(p0, p1)
            distances[i, j] = d
    return distances

deltaX = 0.1
deltaY = 0.1
gridX = 40
gridY = 60
nrPoints = gridX * gridY
points = np.zeros((nrPoints, 2))
i = 0
for x in range(gridX):
    for y in range(gridY):
        points[i] = [x * deltaX, y * deltaY]
        i += 1
distances = getDistanceMatrix(points, points)

mean = np.zeros((nrPoints))
cov0 = 2.3  # variance without distance: Cov(0) = Cov(Z(x), Z(x)) = Var(Z | x)
h95 = 40     # distance at which cov(h) >= 0.95 * cov0

def variogramFunction(h):
    return cov0 * ( 1 - np.exp( -3*h/h95 ) )

Sigma = cov0 - variogramFunction(distances)
Sigma += NOISEFACTOR * np.eye(nrPoints) * np.random.rand(nrPoints) # to make inverse possible
prior = multivariate_normal(mean, Sigma, allow_singular=True)

sample1 = prior.rvs()
sample2 = prior.rvs()
sample3 = prior.rvs()
```

3 samples from prior $P(\mathbf{Y})$: <br/>
<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/gp_prior_samples.png" />

We have observed some samples $\mathbf{D} = {(x_i, y_i)}$.
Which of these millions of surfaces are most likely given those observations? We can answer that with $P(\mathbf{Y}|\mathbf{D})$.

Observations $\mathbf{D}$. Which field $\mathbf{Y}$ is most likely to have produced these observations?
<img width="305" src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/gp_observations.jpg" />

We can calculate the posterior using

$$
P(\mathbf{Y}|\mathbf{D}) \sim P(\mathbf{D}|\mathbf{Y}) P(\mathbf{Y})
$$

But since in gaussian processes we assume multivariate-normals, this can be done much easier.

Consider a multivariate normal distribution on, say, 400 dimensions $N(\vec{\mu}, \mathbf{\Sigma})$. Those 400 dimensions could, for example, be pixel-values in a 20 by 20 image.
Now assume that out of those 400 dimensions we have measurements for $s$ samples, leaving a rest $r = 400 - s$.
For multivariate-normal distributions, we can easily and analytically obtain the conditional distribution $P(\vec{y}_r | \vec{y}_s) = N(\hat{\vec{\mu_r}}, \hat{\mathbf{\Sigma_r}})$.

Split $\vec{y}$ like so:

$$
y = \begin{bmatrix}
    \vec{y}_r \\
    \vec{y}_s
\end{bmatrix}
$$

Analogously we can split the covariance-matrix:

$$
\mathbf{\Sigma} = \begin{bmatrix}
    \mathbf{\Sigma}_{rr} & \mathbf{\Sigma}_{rs} \\
    \mathbf{\Sigma}_{sr} & \mathbf{\Sigma}_{ss} \\
\end{bmatrix}
$$

Then, according to [wikipedia](https://en.wikipedia.org/wiki/Multivariate_normal_distribution#Conditional_distributions), we can obtain $\hat{\vec{\mu}}$ and $\hat{\mathbf{\Sigma}}$ like so:
$$ \hat{\vec{\mu}}_r = \vec{\mu}\_r + \mathbf{\Sigma}_{rs} \mathbf{\Sigma}_{ss}^{-1} (\vec{y}\_s - \vec{\mu}\_s) $$
$$ \hat{\mathbf{\Sigma}}\_r = \mathbf{\Sigma}_{rr} - \mathbf{\Sigma}_{rs} \mathbf{\Sigma}_{ss}^{-1} \mathbf{\Sigma}\_{sr} $$

```python
indices = np.arange(nrPoints)
sampleIndices = np.asarray([13, 25, 84, 96]) # ... from data ...
sampleValues = np.asarray([4.6, 19, 9.4, 21]) # ... from data ...
samplePoints = points[sampleIndices]
nonSampleIndices = np.asarray(
        [i for i in indices
            if i not in sampleIndices]
)
nonSamplePoints = points[nonSampleIndices]

# For simplicity, we just re-calculate SigmaXX here.
# But we could have also picked the right values from Sigma
# without any need for re-computation.
distancesRR = getDistanceMatrix(nonSamplePoints, nonSamplePoints)
SigmaRR = cov0 - variogramFunction(distancesRR)

distancesSS = getDistanceMatrix(samplePoints, samplePoints)
SigmaSS = cov0 - variogramFunction(distancesSS)
SigmaSS += NOISEFACTOR * np.eye(nrSamples) * np.random.rand(nrSamples) # To make inverse possible
SigmaSSInverse = np.linalg.inv(SigmaSS)

distancesRS = getDistanceMatrix(nonSamplePoints, samplePoints)
SigmaRS = cov0 - variogramFunction(distancesRS)
SigmaSR = SigmaRS.transpose()

meanPosterior = SigmaRS @ SigmaSSInverse @ sampleValues
SigmaPosterior = SigmaRR - SigmaRS @ SigmaSSInverse @ SigmaSR
SigmaPosterior += NOISEFACTOR * np.eye(nrPoints - nrSamples) * np.random.rand(nrPoints - nrSamples)  # To make inverse possible

posterior = multivariate_normal(meanPosterior, SigmaPosterior)
```

We can now plot the `meanPosterior` around our `samples`. Doing so we obtain the graphic as shown in figure \ref{gpPosterior}.

Samples and fitted posterior fit together well
<img  src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/gp_posterior_samples.png" />

Note how we assumed that the covariance matrix $\mathbf{\Sigma}$ could be parameterized with a covariance-function $c(h)$. Only this way do we have any chance of finding a good approximation for $\mathbf{\Sigma}$ with only few samples.
The relation `Sigma = cov0 - variogramFunction(distances)` comes from the variogram $\gamma(h)$ as in here:

$$
  \begin{aligned}
    2 \gamma(h) &= E[(Z(x+h) - Z(x))^2] \\
                &= E[( (Z(x+h) - \mu) - (Z(x) - \mu) )^2] \\
                &= E[ (Z(x+h) - \mu)^2  - 2(Z(x+h) - \mu)(Z(x) - \mu)  + (Z(x) - \mu)^2 ] \\
                &= E[ (Z(x+h) - \mu)^2 ]  - 2 E[(Z(x+h) - \mu)(Z(x) - \mu)]  + E[ (Z(x) - \mu)^2 ] \\
                &= c(0) - 2 c(h) + c(0) \\
      \gamma(h) &= c(0) - c(h) \\
           c(h) &= c(0) - \gamma(h)
  \end{aligned}
$$

In practical applications, we'll usually fit our function `cov0 * ( 1 - np.exp( -3*h/h95 ) )` by moving the parameters `cov0` and `h95` until the residuals fit properly.
Our code would then look like this:

```python
def empiricalVariogram(distanceMatrix, data):
  variogram = {}
  d0 = np.min(distanceMatrix)
  d1 = np.max(distanceMatrix)
  nrHs = 20
  deltaH = (d1 - d0) / nrHs
  for h in np.linspace(d0, d1, nrHs):
      Nh = 0
      hSum = 0
      pairs = (h <= distanceMatrix) * (distanceMatrix < h+deltaH)
      for i in range(nrTotal):
          for j in range(i, nrTotal):
              if pairs[i, j]:
                  v = data[i]
                  vh = data[j]
                  hSum += np.power(v - vh, 2)
                  Nh += 1
      if Nh > 0:
          variogram[h] = hSum / (2 * Nh)
    return variogram

def fitVariogram(samples):
    pass  # TBD


residuals = prediction - samples
(cov0, h95) = fitVariogram(residuals)

SigmaRR = cov0 - variogramFunction(cov0, h95, distancesRR)
SigmaSS = cov0 - variogramFunction(cov0, h95, distancesSS)
SigmaRS = cov0 - variogramFunction(cov0, h95, distancesRS)
SigmaSR = SigmaRS.transpose()
SigmaSSInverse = np.linalg.inv(SigmaSS)

meanPosterior = prediction + SigmaRS @ SigmaSSInverse @ sampleValues
SigmaPosterior = SigmaRR - SigmaRS @ SigmaSSInverse @ SigmaSR

predictionPosterior = meanPosterior
```

For more, see this [very thorough tutorial](https://michaeloneill.github.io/GPR-tutorial.html).

### AR and SAR

Autoregressive and spatial-autoregressive models.

### Comparison

\begin{table}[H]
\centering
\resizebox{\textwidth}{!}{%
\begin{tabular}{@{}llll@{}}
\toprule
&
Generalized least squares &
Gaussian processes &
AR \\ \midrule
\multicolumn{1}{|l|}{type} &
\multicolumn{1}{l|}{\begin{tabular}[c]{@{}l@{}}Predict y from x.\\ Has explanatory variables.\end{tabular}} &
\multicolumn{1}{l|}{\begin{tabular}[c]{@{}l@{}}Interpolate y from other y's.\\ Explanatories can be added with GLS\end{tabular}} &
\multicolumn{1}{l|}{interpolate y from other y's} \\ \midrule
\multicolumn{1}{|l|}{model} &
\multicolumn{1}{l|}{\begin{tabular}[c]{@{}l@{}}$y = X\alpha + \epsilon$\\ \\ $\epsilon \sim N(\vec{0}, \mathbf{\Sigma})$\end{tabular}} &
\multicolumn{1}{l|}{\begin{tabular}[c]{@{}l@{}}$Y \sim N(\vec{0}, \mathbf{\Sigma})$\\ $P(\mathbf{Y}|\mathbf{D}) = N(\hat{\vec{\mu}}, \hat{\mathbf{\Sigma}})$\\ $\tilde{y} = \sum \alpha_i \vec{y}_i$\\ Y is a field of size n by m\\ D is the observations \end{tabular}} &
\multicolumn{1}{l|}{\begin{tabular}[c]{@{}l@{}}$y_t = \sum \alpha_i y_{t-i} + \epsilon$\\ $\epsilon \sim N(0, \sigma)$, iid \end{tabular}} \\ \midrule
\multicolumn{1}{|l|}{Specialities} &
\multicolumn{1}{l|}{} &
\multicolumn{1}{l|}{\begin{tabular}[c]{@{}l@{}}$\mathbf{\Sigma}$ is encoded using a covariance-function cov(h)\\ to save on parameters\end{tabular}} &
\multicolumn{1}{l|}{} \\ \midrule
\multicolumn{1}{|l|}{$\epsilon$} &
\multicolumn{1}{l|}{} &
\multicolumn{1}{l|}{} &
\multicolumn{1}{l|}{} \\ \midrule
\multicolumn{1}{|l|}{$cov(\epsilon_i, \epsilon_j)$} &
\multicolumn{1}{l|}{} &
\multicolumn{1}{l|}{} &
\multicolumn{1}{l|}{} \\ \midrule
\multicolumn{1}{l|}{$cov(y_i, y_j)$} &
\multicolumn{1}{l|}{} &
\multicolumn{1}{l|}{} &
\multicolumn{1}{l|}{} \\ \bottomrule
\end{tabular}%
}
\end{table}

## Bayesian networks

Bayesian networks are a neat tool when we can manually encode some complex causation-graphs.

- There are analytical ways of calculating posteriors, like [here](https://ocw.mit.edu/courses/6-825-techniques-in-artificial-intelligence-sma-5504-fall-2002/7119c2c7a9d00760da07077d9c59c55f_Lecture16FinalPart1.pdf)
- But these are hard to implement! Sampling is much simpler.
- The core design trick is that each node specifies its _conditional_ probability distribution.
- You _could_ do regression with a bayesian network like so:
  - ```
    const xs = new Nod("xs", [[1, 2, 3, 4]], (val) => val = xs.values[0] ? 1 : 0);
    const a  = new Nod("a", [0, 1, 2, 3], (val) => 0.25);
    const ys = new Nod("xs", [[2, 4, 6, 8]], (val) => val = ys.values[0] ? 1 : 0);
    const net = new Net([xs, a, ys]);
    const aPosterior = net.probDist([a]);
    ```
  ```
  - But this is pretty finicky... for regression, better do bayesian regression using MCMC.
  ```

```ts
import embed from 'vega-embed';
import { TopLevelSpec } from 'vega-lite';

type Sample = { [name: string]: any };
type Bin = { samples: Sample[]; groupedBy: { [name: string]: any } };
type EmpiricalPdf = (Bin & { prob: number })[];

class Utils {
  static scalarMult(scalar: number, arr: number[]) {
    return arr.map((a) => a * scalar);
  }

  static allExcept(xs: Nod<any>[], yNames: string[]) {
    const outs: Nod<any>[] = [];
    for (const x of xs) {
      if (!yNames.includes(x.name)) outs.push(x);
    }
    return outs;
  }

  static arraysEqual(xs: any[], ys: any[]) {
    if (xs.length !== ys.length) return false;
    for (let i = 0; i < xs.length; i++) {
      const x = xs[i];
      const y = ys[i];
      if (x !== y) return false;
    }
    return true;
  }

  static binByNodes(nodes: Nod<any>[], samples: Sample[]) {
    function doBin(samples: Sample[], node: Nod<any>): Bin[] {
      const bins: Bin[] = [];
      for (const value of node.values) {
        bins.push({ samples: [], groupedBy: { [node.name]: value } });
      }

      for (const sample of samples) {
        const bin = bins.find((b) => b.groupedBy[node.name] === sample[node.name])!;
        bin.samples.push(sample);
      }

      return bins;
    }

    function spreadBinsBy(node: Nod<any>, binned: Bin[]): Bin[] {
      const newBins: Bin[] = [];
      for (const oldBin of binned) {
        for (const value of node.values) {
          const newBin: Bin = {
            samples: oldBin.samples.filter((s) => s[node.name] === value),
            groupedBy: {
              ...oldBin.groupedBy,
              [node.name]: value,
            },
          };
          newBins.push(newBin);
        }
      }
      return newBins;
    }

    const node = nodes[0];

    if (nodes.length === 1) {
      const binned = doBin(samples, node);
      return binned;
    }

    const binned = this.binByNodes(nodes.slice(1), samples);
    const subBinned = spreadBinsBy(node, binned);

    return subBinned;
  }

  static empiricalPmf(nodes: Nod<any>[], samples: Sample[]): EmpiricalPdf {
    const bins = this.binByNodes(nodes, samples);
    for (const bin of bins) {
      (bin as any)['prob'] = bin.samples.length / samples.length;
    }
    return bins as any;
  }
}

class Nod<T> {
  constructor(
    readonly name: string,
    readonly values: T[],
    public conditionalProbability: (val: T, givens: { [name: string]: any }) => number
  ) {}

  sample(givens: { [name: string]: any }) {
    const cmf = this.cmf(givens);
    const randP = Math.random();
    for (const [val, cumProb] of cmf) {
      if (randP <= cumProb) return val;
    }
  }

  // @TODO: memoize
  cmf(givens: { [name: string]: any }) {
    const cmf = new Map<T, number>();
    let lastP = 0;
    for (const val of this.values) {
      const p = this.conditionalProbability(val, givens);
      const cumP = p + lastP;
      cmf.set(val, cumP);
      lastP = cumP;
    }
    return cmf;
  }
}

class BayesianBeliefNet {
  constructor(
    /* Must be ordered from roots to leaves */
    readonly nodes: Nod<any>[]
  ) {}

  private sample(givens: { [name: string]: any }) {
    const sampled = structuredClone(givens);
    for (const node of this.nodes) {
      if (node.name in sampled) continue;
      const nodeVal = node.sample(sampled);
      sampled[node.name] = nodeVal;
    }
    return sampled;
  }

  private samples(sampleSize: number, givens: { [name: string]: any }) {
    const out = [];
    for (let i = 0; i < sampleSize; i++) {
      out.push(this.sample(givens));
    }
    return out;
  }

  probDist(nodes: Nod<any>[]) {
    const samples = this.samples(5000, {});
    const pdf = Utils.empiricalPmf(nodes, samples);
    return pdf;
  }

  conditionalProbDist(nodes: Nod<any>[], givens: { [name: string]: any }) {
    const samples = this.samples(5000, givens);
    const pdf = Utils.empiricalPmf(nodes, samples);
    return pdf;
  }
}

const eq = new Nod('earthquake', [0, 1, 2, 3, 4, 5], (val, _) => {
  return 5 / 12 - 0.1 * val;
});

const burglary = new Nod('burglary', [true, false], (val, _) => {
  return val ? 0.1 : 0.9;
});

const alarm = new Nod('alarm', [true, false], (val, givens) => {
  const probOfAlarm = Math.min(1, givens[eq.name] * 0.1 + givens[burglary.name] * 0.8);
  return val ? probOfAlarm : 1 - probOfAlarm;
});

const bp = new Nod('blood-pressure', [100, 110, 120, 130, 140, 150, 160], (val, givens) => {
  const bpExpected = 120 + 30 * givens[alarm.name];
  const distance = Math.abs(val - bpExpected);
  return 3.1 / 7 - 0.01 * distance;
});

const net = new BayesianBeliefNet([eq, burglary, alarm, bp]);

const prior = net.probDist([bp]); // distribution of blood pressure
const posterior = net.conditionalProbDist([bp], { [eq.name]: 5 }); // distribution of blood pressure if there is a heavy eq
```

## Hidden-state models

Hidden Markov state model
<img  src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/hidden_markov_states.jpg" />

Imagine a model as in the image above.
What is known:

- $p(y_t|s_t)$
- $p(s_t+1|s_t)$

From this we can deduce:
$$ p(s*0|y_0) = p(y_0|s_0) \frac{p(s_0)}{p(y_0)} $$
$$ p(s_1|y_0) = \Sigma*{s*0} p(s_1|s_0) p(s_0|y_0) $$
$$ p(y_1|y_0) = \Sigma*{s*0} \Sigma*{s_1} p(y_1|s_1) p(s_1|s_0) p(s_0|y_0) $$
Note that $ p(y_1|y_0) $ is not a function of either $s_0$ nor $s_1$.

$$
    \begin{aligned}
        p(s_1|y_0, y_1) &= \frac{ p(y_1|s_1, y_0) p(s_1|y_0) }{ p(y_1|y_0) } \\
                        &= \frac{ p(y_1|s_1) p(s_1|y_0) }{ p(y_1|y_0) } \\
                        & \propto p(y_1|s_1) p(s_1|y_0) \text{ ... since $p(y_1|y_0)$ is not a function of $s$ }
    \end{aligned}
$$

(As reference, see the findings \ref{condPropLemmas}.)

More generally, we can write the **update-equation** as:

$$
    p(s_t | \vec{y}_{[1..t]}) \propto p(y_t | s_t) p(s_t | \vec{y}_{[1..t-1]})
$$

... where $p(s_t | \vec{y}_{[1..t-1]})$ is the result of the last prediction equation.

With the **prediction-equation**:

$$
    p(s_{t+1} | \vec{y}_{[1..t]} ) = \Sigma_{s_t} p(s_{t+1} | s_t) p(s_t | \vec{y}_{[1..t]}) )
$$

... where $ p(s*t | \vec{y}*{[1..t]}) $ is the result of the last update equation.

```python
    states = ('Rainy', 'Sunny')

    observations = ('walk', 'shop', 'clean')

    start_prob = {'Rainy': 0.6, 'Sunny': 0.4}

    transition_prob = {
       'Rainy' : {'Rainy': 0.7, 'Sunny': 0.3},
       'Sunny' : {'Rainy': 0.4, 'Sunny': 0.6},
    }

    emission_prob = {
       'Rainy' : {'walk': 0.1, 'shop': 0.4, 'clean': 0.5},
       'Sunny' : {'walk': 0.6, 'shop': 0.3, 'clean': 0.1},
    }

    state_series = ['Rainy', 'Sunny', 'Sunny', 'Sunny', 'Rainy', 'Sunny', 'Rainy', 'Rainy', 'Sunny', 'Sunny', 'Sunny']
    emission_series = ['clean', 'walk', 'walk', 'shop', 'clean', 'shop', 'clean', 'clean', 'clean', 'shop', 'clean']


    def prediction(states, transition_prob, prob_St_Yt):
        prob_St1_Yt = {}
        for state1 in states:
            prob_St1_Yt[state1] = 0.0
            for state0 in states:
                prob_St1_Yt[state1] += transition_prob[state0][state1] * prob_St_Yt[state0]
        return prob_St1_Yt


    def update(states, emission, emission_prob, prob_St1_Yt):
        prob_St_Yt = {}
        for state in states:
            prob_St_Yt[state] = emission_prob[state][emission] * prob_St1_Yt[state]
        sm = sum(prob_St_Yt.values())
        for state in prob_St_Yt:
            prob_St_Yt[state] = prob_St_Yt[state] / sm
        return prob_St_Yt


    prob_St1_Yt = start_prob
    for t in range(10):
        emission = emission_series[t]
        prob_St_Yt = update(states, emission, emission_prob, prob_St1_Yt)
        prob_St1_Yt = prediction(states, transition_prob, prob_St_Yt)
```

## Tests

This subsection is about what is the most common form of statistics in social sciences: tests.
Often, statistical tests work _the wrong way round_. You have your hypothesis, like "these groups are different". Then you state the opposite, the _null-hypothesis_. Then you determine how likely your data is under the null-hypothesis - the _p-value_. And than you hope that the p-value is very low.

**Students T-Test**
compares two averages (means) and tells you if they are different from each other. The null hypothesis is that all samples come from the same distribution. That means that under $H_0$, the two means you obtained should be similar. So the interpretation goes like this:

- low p-value: the chance that your result would have happend under $H_0$ is low. It is very unlikely that the two means you have obtained actually come from the same distribution.
- high p-value: It is quite possible that both your groups come from the same distribution.

Note that there are two experimental setups that can use t-tests:

- unpaired: you have two groups, with no person in both groups. Example: Test one group with medication and another with placebo.
- paired: every person is first in the first and then in the second group. Example: test patients before and after treatment.

Statistical test decision tree
<img  src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/statistical_test_decision_tree.png" />
