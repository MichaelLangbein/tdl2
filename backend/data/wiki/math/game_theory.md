# Game theory

## Prisoners dilemma: Nash equilibrium vs global optimum

|         | Snitch     | Silence    |
|---------|------------|------------|
| Snitch  | $5^5_{NE}$ | $0^{10}$   |
| Silence | $10^0$     | $1^1_{GO}$ |

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


## Hanibal crossing the alps: 0-sum games and dominant strategies

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

> **Dominating strategy**:
>
> A dominating strategy is one where no matter what your opponent does, you are better off than taking another strategy.


Note that Hanibal crossing the alps is a *0-sum-game*: there is no global optimum, because the players utilities always sum to 0.


## Why gas-stations are so close to each other: iterative deletion

Imagine two candidates for presidential election. 
- They can each chose to position themselves on one of ten possible stances from left to right.
- Each stance is agreed on by 10% of the voters.
- On election-day, the voters will vote for the candidate closest to their stance. If the two candidates are equally far away from one stance, 50% of those voters will vote for one, 50% for the other candidate.
- How should the candidates position themselves?


|    | 1      | 2      | 3      | 4      | 5      | 6      | 7      | 8      | 9      | 10     |
|----|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|
| 1  | 50\|50 | 10\|90 | 15\|85 | 20\|80 | 25\|75 | 30\|70 | 35\|65 | 40\|60 | 45\|55 | 50\|50 |
| 2  | 90\|10 | 50\|50 | 20\|80 | 25\|75 | 30\|70 | 35\|65 | 40\|60 | 45\|55 | 50\|50 | 55\|45 |
| 3  | 85\|15 | 80\|20 | 50\|50 | 30\|70 | 35\|65 | 40\|60 | 45\|55 | 50\|50 | 55\|45 | 60\|40 |
| 4  |        |        |        | 50\|50 | 40\|60 | 45\|55 | 50\|50 | 55\|45 | 60\|40 | 65\|35 |
| 5  |        |        |        |        | 50\|50 | 50\|50 | 55\|45 | 60\|40 | 65\|35 | 70\|30 |
| 6  |        |        |        |        |        | 50\|50 | 60\|40 | 65\|35 | 70\|30 | 75\|25 |
| 7  |        |        |        |        |        |        | 50\|50 | 70\|30 | 75\|25 | 80\|20 |
| 8  |        |        |        |        |        |        |        | 50\|50 | 80\|20 | 85\|15 |
| 9  |        |        |        |        |        |        |        |        | 50\|50 | 90\|10 |
| 10 |        |        |        |        |        |        |        |        |        | 50\|50 |


- Position 1, on the far left, is strictly dominated by position 2: you'll always get at least 5% more voters when chosing position 2 over position 1.
- By the same logic, position 10 is strictly dominated by position 9.
- As such, no candidate would chose positions 1 or 10.
- Position 3 does **not** dominate position 2: if you're opponent were to chose position 1, you'd be better off takeing position 2.
    - **But**: since you know that no-one will take position 1 anyway, you can ignore this option.
    - With that, position 3 now *does* dominate position 2.
- This logic can be applied iteratively, removing 2 edge-positions on each iteration.
- We're left with one candidate taking position 5 and the other taking position 6.

## Stable marriage
- Men get the best possible outcome
- Women get the worst possible outcome
- Men cannot get a better outcome by collaborating
- Women can get a better outcome by collaborating
