#%%
import itertools



def uniquePermutations(sequence):
    allePerms = itertools.permutations(sequence)
    uniquePerms = set(allePerms)
    return [list(seq) for seq in uniquePerms]


def find(lst, predicate):
    for item in lst:
        if predicate(item):
            return item
    return None


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
        

def clone(tasks):
    return [dict(task) for task in tasks]

  

def createPermutations(tasks):
    sequences = []
    for task in tasks:
        if task["work"] > 1:
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


# print(createSequences([{"id": 1, "work": 1}]))
# print(createSequences([{"id": 1, "work": 2}]))
# print(createSequences([{"id": 1, "work": 1}, {"id": 2, "work": 1}]))
# print(createSequences([{"id": 1, "work": 1}, {"id": 2, "work": 2}]))


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
