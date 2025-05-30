#%%


def calcLoss(seq, tasks):
    totalLoss = 0

    for task in tasks:
        remainingWork = task["work"]
        deadline = task["deadline"]
        taskFinishedAt = -1
        for t, taskId in enumerate(seq):
            if taskId == task["id"]:
                remainingWork -= 1
                taskFinishedAt = t + 1
        timeLeft = max(deadline - taskFinishedAt, 0)
        timeOverdue = max(taskFinishedAt - deadline, 0)
        totalLoss += remainingWork * 3
        totalLoss -= timeLeft
        totalLoss += timeOverdue * 3

    contextSwitches = 0
    for i, taskId in enumerate(seq):
        if i > 0 and seq[i] != seq[i-1]:
            contextSwitches += 1

    totalLoss += contextSwitches
    return totalLoss
        

def createPermutations(tasks):
    sequences = []
    for task in tasks:
        if task["work"] > 0:
            baseSequence = [task["id"]]
            task["work"] -= 1
            childSequences = createPermutations(tasks)
            if len(childSequences) == 0:
                sequences.append(baseSequence)
            else:
                for childSequence in childSequences:
                    sequences.append(baseSequence + childSequence)
            task["work"] += 1
    return sequences


print(createPermutations([{"id": 1, "work": 1}]))
print(createPermutations([{"id": 1, "work": 2}]))
print(createPermutations([{"id": 1, "work": 1}, {"id": 2, "work": 1}]))
print(createPermutations([{"id": 1, "work": 1}, {"id": 2, "work": 2}]))


tasks = [{
    "id": 1,
    "deadline": 5, 
    "work": 3 
}, {
    "id": 2,
    "deadline": 7, 
    "work": 2
}, {
    "id": 3,
    "deadline": 2, 
    "work": 2
}]


bestSolution = {
    "sequence": [],
    "loss": float("inf")
}
for sequence in createPermutations(tasks):
    loss = calcLoss(sequence, tasks)
    if loss < bestSolution["loss"]:
        bestSolution["loss"] = loss
        bestSolution["sequence"] = sequence


print(bestSolution)
# %%
