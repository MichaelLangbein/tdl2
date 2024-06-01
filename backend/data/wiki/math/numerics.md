# Difference equations

https://macrosimulation.org/intro_stability_analysis

# Runge-Kutta

## Problem statement

We want to approximate a function $y(x)$. We don't know $y$'s value at any $x$, but we know a function $f$ to calculate $y$'s gradient:
$$\frac{dy}{dx} = f(x, y)$$

## Taylor expansion

$$
\begin{aligned}
y(x + \Delta) &= y(x) &+ \Delta \frac{dy}{dx}|_x &+ \frac{\Delta^2}{2} \frac{d^2y}{dx^2} |_x             &+ \mathcal{O}(\Delta^3) \\
              &= y(x) &+ \Delta f(x, y(x))       &+ \frac{\Delta^2}{2} \frac{d}{dx} f(x, y(x))           &+ \mathcal{O}(\Delta^3) \\
              &= y(x) &+ \Delta f(x, y(x))       &+ \frac{\Delta^2}{2} (\frac{df}{dx} + f\frac{df}{dy})  &+ \mathcal{O}(\Delta^3) \\
\end{aligned}
$$

## One step forward

A first approach would be to approximate $y$ with one step forward:
$$y(x + \Delta) \approx y(x) + \Delta f(x, y(x))$$
This equals a first order Taylor expansion and as such has an error of $\mathcal{O}(\Delta^2)$.

## Half step forward, another half step forward

We can do better like this:

$$
\begin{aligned}
    y\left(x + \frac{\Delta}{2}\right)  &\approx y(x) + \frac{\Delta}{2} f(x, y(x))  \\
    y(x + \Delta)                       &\approx y(x) + \Delta f\left(x + \frac{\Delta}{2}, y(x + \frac{\Delta}{2})\right)
\end{aligned}
$$

Some arithmetic proves that this is actually identical to the _second_ order Taylor expansion and as such has an error of $\mathcal{O}(\Delta^3)$.

## RK4

Consequently expanding on this idea we get Runge-Kutta-4:

$$
\begin{aligned}
    y(x+\Delta) &\approx y(x) + \frac{k_1}{6} + \frac{k_2}{3} + \frac{k_3}{3} + \frac{k_4}{6} \\
    k_1         &= \Delta f(x, y)                                               & \text{one full step forward}  \\
    k_2         &= \Delta f\left(x + \frac{\Delta}{2}, y + \frac{k_1}{2}\right) & \text{half step forward}  \\
    k_3         &= \Delta f\left(x + \frac{\Delta}{2}, y + \frac{k_2}{2}\right) & \text{half step forward, but with better y-offset}  \\
    k_4         &= \Delta f\left(x + \Delta, y + k_3 \right)                    & \text{full full step forward, but with better y-offset}
\end{aligned}
$$

This equals a Taylor expansion of order 4, thus has error $\mathcal{O}(\Delta^5)$.

## Dynamic step-size

Rule of thumb: reduce step size until predicted outcome no longer changes.
But we can do that a bit better.

The plan is to vary $\Delta$ dynamically as we move through time.

- Do standard prediction: $y(x + \Delta) = RK_4(x, y(x), \Delta)$
- Every so often, do a "half step forward, another half step forward" approximation:
  - $y(x + \Delta / 2) = RK_4(x, y(x), \Delta/2)$
  - $y(x + \Delta / 2 + \Delta / 2) = RK_4(x + \Delta/2, y(x + \Delta/2), \Delta/2)$
- Calculate how much better exactly that doubly expensive approach is:
  - $\epsilon = |y(x + \Delta) - y(x + \Delta/2 + \Delta/2)|$
- ```python
     if epsilon > 0.1:
        # error was too big, reduce step-size from now on
        stepSize = 0.8 * stepSize
     elif epsilon < 0.01:
        # error was very small, we can afford bigger steps
        stepSize = 1.2 * stepSize
  ```

# Predictor corrector

https://paleodyn.uni-bremen.de/study/MES/The_nature_of_mathematical_modeling_Gershenfeld.pdf, chapter 7

In $RK_4$ we've always dealt with predicting $y(x + \Delta)$ from $y(x) + \Delta f(x, y)$. But what if we can assume that $y$ can also be, in part, predicted from past $y$'s?

Just like before we again know
$$\frac{dy}{dx} = f(x, y(x))$$

If we could do infinitely many approximation steps, we'd have:
$$y(x + \Delta) = y(x) + \int_{u=x}^{u=x + \Delta} f(u, y(x)) du$$

Assume that $f$ is a simple polynomial:
$$f(x, y) = a + bx + cx^2$$

If that _were_ the case, we'd get:
$$\int_{u=x}^{u=x + \Delta} f(u, y(x)) du = a\Delta + bx\Delta + b\Delta/2 + cx^2\Delta + cx\Delta^2 + c \Delta^3 / 3$$

Some arithmetic gives us a prediction of $y$ if $f$ could really be approximated by such a polynomial:

$$
\begin{aligned}
y_{pred}(x + \Delta) = y(x) &+ \frac{\delta}{12} 23 f(x, y(x))  \\
                            &- \frac{\delta}{12} 16 f(x - \Delta, y(x - \Delta))  \\
                            &+ \frac{\delta}{12} 5 f(x - 2\Delta, y(x - 2\Delta))
\end{aligned}
$$

Notice how that prediction requires only one new function evaluation, $f(x, y(x))$, while the other terms, $f(x - \Delta, y(x - \Delta))$ and $f(x - 2\Delta, y(x - 2\Delta))$, can be stored from the last simulation steps.

Of course, the assumption of $f$ being a polynomial will likely have been off. But we can correct our estimate using just one additional evaluation:

$$
\begin{aligned}
y_{corr}(x + \Delta) = y(x) &+ \frac{\Delta}{12} 5 f(x + \Delta, y(x + \Delta)) \\
                            &+ \frac{\Delta}{12} 8 f(x, y(x)) \\
                            &- \frac{\Delta}{12} 1 f(x - \Delta, y(x - \Delta)) \\
\end{aligned}
$$

Again we've only needed one additional evaluation, $f(x + \Delta, y(x + \Delta))$.

In total with this approach we've only used two evaluations of $f$, as compared to 4 for $RK_4$. If $f$ can be assumed to be reasonably smooth, a predictor corrector method can be twice as efficient as Runge-Kutta.

# Central point

# Markov chain monte carlo
