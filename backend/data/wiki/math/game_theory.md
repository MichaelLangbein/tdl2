# Game theory

## Aspect 1: How to design systems such that the participants' interests are aligned with the system-designer's
Racket-teams deliberately loose to face weaker opponents in the future. This does not align with the tournament-designer's objective of ordering the teams by strength.


## Aspect 2: When does egoistic behavior of participants produce optimal results in the system
Sometimes it does not. Example: Braess's paradox.
In Stuttgart, a fast road was closed - removing an optimal route that everyone took.
This forced drivers to pick one of two alternative routes - each longer than the original.
BUT: there were now two equally bad routes - wich each only got half as congested.
In effect, traffic got faster.

### Selfish routing and the price of anarchy

## Aspect 3: When/how do we reach equilibria?



## Prisoners dilemma

|         | Snitch     | Silence   |
|---------|------------|-----------|
| Snitch  | $5^5_{NE}$ | $0^{10}$  |
| Silence | $10^0$     | $1^1_{GO} |

The prisoners' dillemma has a *global optimum* at silence/silence where all players have on average the best outcome.
But each individual player can move away from that state and be better off - at the cost of the other player being way worse off.

The state snitch/snitch is a Nash-equilibrium.

> **Nash equilibrium**:
>
> No player can gain anything by changing *only his own* behavior.

Such games are frequent: there is a global optimum, but it's not a Nash equilibrium.
A single player can leave the global optimum making him better off and the global average much worse.
Examples:
 - tragedy of the commons
 - climate change


## Hanibal crossing the alps

Hanibal can pick the easy or the hard route to Italy.
When picking the hard route, he'll lose one batallion.
Scipio can defend the hard or the easy path.
When he meets Hanibal, Scipio will destroy one of Hanibals batallions.

|         |      | Scipio |      |
|         |      | Easy   | Hard |
|---------|------|--------|------|
| Hanibal | Easy | 1      | 0    |
|         | Hard | 1      | 2    |

- For Scipio, there is no *dominating strategy*. 
    - If he defends the easy route,
        - and Hanibal takes the easy route, Scipio was right to chose the easy route
        - and Hanibal takes the hard route, Scipio should have defended the hard route
    - If he defends the hard route,
        - and Hannibal takes the easy route, Scipio should have defended the easy route
        - and Hannibal takes the hard route, Scipio was right to chose the hard route

Yet, Scipio is well advised to defend the easy route - not because he has a dominating strategy, but because he knows that Hanibal has one.

- Hanibal has a dominating strategy: Choose the easy route.
    - If Scipio defends the easy route, Hanibal is just as well off fighting Scipio as he is crossing the alps.
    - If Scipio defends the hard route, Hanibal is way better off taking the easy route.

So never mind what Scipio does, Hanibal is better of taking the easy route.

> **Strictly dominating strategy**:
>
> A SDS is one where no matter what your opponent does, you are better off than taking another strategy.


Note that Hanibal crossing the alps is a *0-sum-game*: there is no global optimum, because the players utilities always sum to 0.




## Stable marriage
- Men get the best possible outcome
- Women get the worst possible outcome
- Men cannot get a better outcome by collaborating
- Women can get a better outcome by collaborating
