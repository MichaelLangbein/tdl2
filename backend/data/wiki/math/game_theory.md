# Game theory

- $s_i$: strategy $s$ of player $i$
- $s_{-i}$: strategies of all players except player $i$
- $u_i(s_i, s_{-i})$: utility $u$ for player $i$ given his strategy $s_i$ and everyone elses strategies

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
> $$ s'_i: \text{dominating} \iff \forall s_{-i}, \forall s''_i: u_i(s''_i, s_{-i}) < u_i(s'_i, s_{-i})$$
> A dominated strategy is one where no matter what your opponent does, you could do something better than that strategy.
> $$ s'_i: \text{dominated} \iff \forall s_{-i} \exists s''_{i}: u_i(s''_i, s_{-i}) > u_i(s'_i, s_{-i}) $$ 
> **In picking a strategy, we can always delete dominated strategies.**


Note that Hanibal crossing the alps is a *0-sum-game*: there is no global optimum, because the players utilities always sum to 0.


## Why gas-stations are so close to each other: iterative deletion of dominated strategies

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


## Deal or no deal: best responses

> **Best responses**
>
> If you know your opponent's strategy $s_{-i}$, then your best response is defined as:
> $$ s'_i: BR_{|s_{-i}} \iff \forall s''_i: u_i(s'_i, s_{-i}) \geq u_i(s''_i, s_{-i}) $$
> If you hold some belief $p(s_{-i})$ about your opponent's strategy, then your best response is defined as:
> $$ s'_i: BR_{|p(s_{-i})} \iff \forall s''_i: E_{|p(s_{-i})}[u_i(s'_i, s_{-i})] \geq E_{|p(s_{-i})}[u_i(s''_i, s_{-i})]$$ 
> **In picking a strategy, we can delete strategies that are not a best response under any belief $p(s_{-i})$**


### Deal or no deal
Deal or no deal is a game show where the host often offers players to buy them out.

A prices of 100$ is hidden behind door 1 or 2. The price has been hidden there by some random process $p$ - which may be biased.
The host offers to give you 40$ immediately if you chose to forfeit.

|          |         | door |      |
|----------|---------|------|------|
|          |         | 1    | 2    |
| strategy | 1       | 100$ | 0    |
|          | 2       | 0    | 100$ |
|          | forfeit | 40$  | 40$  |

Plotting $p(\text{door}=1)$ against $u(1), u(2)$ and $u(\text{abstain}) $, we see that under no belief $p(\text{door}=1)$ is abstaining ever a best response - there is always some strategy that's expected to be better, never mind where you think the price is most likely. 

Thus a player would never pick the pay-out strategy.

Some notes:
- Note that if the host were to increase the pay-out to 60$, you'd be better off accepting the payout except if you have a strong suspicion that you know where the price is.
- Note that you can still be off worse by not forfeiting.

### Penalty kicks
A similar game is the soccer-penalty-kick game. Here's something interesting: shooting into the middle is never a best response. But if the goalie knows you'll never shoot into the middle, then he'll account for that - making shooting in the middle a very good option for you again. This is an example where iterating the game (like in the gas-station example) does *not* reduce our possible strategies. We may initially remove never-best-responses, but immediately have to add them in again after one iteration.






## Stable marriage
- Men get the best possible outcome
- Women get the worst possible outcome
- Men cannot get a better outcome by collaborating
- Women can get a better outcome by collaborating
