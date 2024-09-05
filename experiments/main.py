#%%
import numpy as np
import matplotlib.pyplot as plt
import csv

# %% parsing file
file = open("./tasks.csv")
reader = csv.DictReader(file, ["id", "name", "body", "parentId", "startedAt", "completedAt", "secondsActive"])
data = []
for row in reader:
    data.append({
        "id": int(row["id"]),
        "name": row["name"],
        "body": row["body"],
        "parentId": int(row["parentId"]) if row["parentId"] != "" else -1,
        "startedAt": int(row["startedAt"]),
        "completedAt": int(row["completedAt"]) if row["completedAt"] != "" else -1,
        "secondsActive": int(row["secondsActive"]) if row["secondsActive"] != "" else -1,
        "children": [],
        "parent": None,
        "level_bu": -1,
        "level_td": -1
    })

# %% convert to tree

def findDatum(func):
    for datum in data:
        if func(datum):
            return datum

tree = findDatum(lambda d: d["id"] == 1)
for datum in data:
    parent = findDatum(lambda d: d["id"] == datum["parentId"])
    if parent:
        datum["parent"] = parent
        parent["children"].append(datum)

# %% instrument

def topDownLevel(node, level):
    node["level_td"] = level
    for child in node["children"]:
        topDownLevel(child, level + 1)

topDownLevel(tree, 0)

def bottomUpLevel(node):
    if len(node["children"]) == 0:
        level = 0
        node["level_bu"] = level
        while node["parent"]:
            node = node["parent"]
            level += 1
            node["level_bu"] = max(level, node["level_bu"])
    else:
        for child in node["children"]:
            bottomUpLevel(child)
            
bottomUpLevel(tree)

def cumulativeTime(task):
    time = task["secondsActive"]
    for child in task["children"]:
        time += cumulativeTime(child)
    task["cumulativeTime"] = time
    return time

cumulativeTime(tree)


# %% seems to have exponential distribution

completedTasks = [t for t in filter(lambda d: d["completedAt"] > -1, data)]
secondsActive = [t["secondsActive"] for t in completedTasks]

plt.hist(secondsActive)
plt.title(f"all ({len(completedTasks)})")

#%% exponential on all levels
topCutoff = 3
midCutoff = 5
secondsActiveTop = [t["secondsActive"] for t in completedTasks if t["level_td"] < topCutoff]
secondsActiveMid = [t["secondsActive"] for t in completedTasks if midCutoff > t["level_td"] >= topCutoff]
secondsActiveBot = [t["secondsActive"] for t in completedTasks if t["level_td"] >= midCutoff]


fix, axes = plt.subplots(1, 3)
axes[0].hist(secondsActiveTop)
axes[0].set_title(f"levels 0-{topCutoff-1} ({len(secondsActiveTop)})")
axes[1].hist(secondsActiveMid)
axes[1].set_title(f"levels {topCutoff}-{midCutoff-1} ({len(secondsActiveMid)})")
axes[2].hist(secondsActiveBot)
axes[2].set_title(f"levels {midCutoff}-99 ({len(secondsActiveBot)})")

print(
    np.mean(secondsActiveBot) / 60, 
    np.mean(secondsActiveMid) / 60, 
    np.mean(secondsActiveTop) / 60
)

# %% also holds with bottom up numbering; which has more meaningful numbering anyway
topCutoff = 2
midCutoff = 1
secondsActiveTop = [t["secondsActive"] for t in completedTasks if t["level_bu"] > topCutoff]
secondsActiveMid = [t["secondsActive"] for t in completedTasks if midCutoff <= t["level_bu"] < topCutoff]
secondsActiveBot = [t["secondsActive"] for t in completedTasks if t["level_bu"] < midCutoff]


fix, axes = plt.subplots(1, 3)
axes[0].hist(secondsActiveTop)
axes[0].set_title(f"levels {topCutoff}-99 ({len(secondsActiveTop)})")
axes[1].hist(secondsActiveMid)
axes[1].set_title(f"levels {midCutoff}-{topCutoff-1} ({len(secondsActiveMid)})")
axes[2].hist(secondsActiveBot)
axes[2].set_title(f"levels 0-{midCutoff-1} ({len(secondsActiveBot)})")

print(
    np.mean(secondsActiveBot) / 60, 
    np.mean(secondsActiveMid) / 60, 
    np.mean(secondsActiveTop) / 60
)


#%% relation level / time

# data for plot
times = []
levelsTd = []
levelsBu = []
for datum in completedTasks:
    times.append(datum["secondsActive"])
    levelsTd.append(datum["level_td"])
    levelsBu.append(datum["level_bu"])
    
# data for boxplot
nrLevels = 7
levelTimesTd = [[] for i in range(nrLevels)]
levelTimesBu = [[] for i in range(nrLevels)]
for datum in completedTasks:
    levelTimesTd[datum["level_td"]].append(datum["secondsActive"])
    levelTimesBu[datum["level_bu"]].append(datum["secondsActive"])
# filtering out too small groups
for i in range(nrLevels):
    if len(levelTimesTd[i]) < 2:
        levelTimesTd[i] = []
    if len(levelTimesBu[i]) < 2:
        levelTimesBu[i] = []


fix, axes = plt.subplots(2, 2)
axes[0][0].scatter(levelsTd, times)
axes[0][0].set_title("level(td)/time")
axes[0][1].scatter(levelsBu, times)
axes[0][1].set_title("level(bu)/time")
axes[1][0].boxplot(levelTimesTd)
axes[1][1].boxplot(levelTimesBu)

print([np.mean(lvlTimes)/60 for lvlTimes in levelTimesBu])

#%% how many children per level? There are less children the deeper down

# data for plot
children = []
levelsTd = []
levelsBu = []
for datum in completedTasks:
    children.append(len(datum["children"]))
    levelsTd.append(datum["level_td"])
    levelsBu.append(datum["level_bu"])
    
# data for boxplot
nrLevels = 7
levelChildrenTd = [[] for i in range(nrLevels)]
levelChildrenBu = [[] for i in range(nrLevels)]
for datum in completedTasks:
    levelChildrenTd[datum["level_td"]].append(len(datum["children"]))
    levelChildrenBu[datum["level_bu"]].append(len(datum["children"]))
# filtering out too small groups
for i in range(nrLevels):
    if len(levelChildrenTd[i]) < 2:
        levelChildrenTd[i] = []
    if len(levelChildrenBu[i]) < 2:
        levelChildrenBu[i] = []
    
fix, axes = plt.subplots(2, 2)
axes[0][0].scatter(levelsTd, children)
axes[0][0].set_title("level(td)/children")
axes[0][1].scatter(levelsBu, children)
axes[0][1].set_title("level(bu)/children")
axes[1][0].boxplot(levelChildrenTd)
axes[1][1].boxplot(levelChildrenBu)

print([np.mean(d) for d in levelChildrenBu])


#%% BU-lvl=3 seems to be high level tasks (eg "AR-app"). Whats the range of cumulative time?




highLevelTasks = [d for d in completedTasks if d["level_bu"] == 3]
times = [t["cumulativeTime"] for t in highLevelTasks]
print(np.mean(times) / 60, np.sqrt(np.var(times)) / 60)

cumtimes = []
levelsBu = []
for datum in completedTasks:
    cumtimes.append(datum["cumulativeTime"])
    levelsBu.append(datum["level_bu"])
    
plt.scatter(levelsBu, cumtimes)


#%%
timesPerLevelBu = [np.mean(i)/60 for i in levelTimesBu]
childrenPerLevelBu = [np.mean(i) for i in levelChildrenBu]
"""
    lessons learned:
        - Picking a model:
            - use BU if you've already specified at least one low-level task
            - use TD otherwise
            - use static-structure if you're not expecting more tasks
        - task time follows exponential distribution
        - for a root task I commonly need about two hours
        - I expect about 9 children at level 2 (bottom up from 0), 4 at level 1, 2 at level 0
            - that is: level 3: 1 x 114 min              (high level: task,          eg "AR-app"         )
                       level 2: 1 x 9 x 18 min          (sub-task                   eg "camera access"  )
                       level 1: 1 x 9 x 4 x 48 min      (feature                    eg "bugfix"         )
                       level 0: 1 x 9 x 4 x 2 x 24 min  (low level, atomic feature, eg "nicer icon"     )
                       -------------------------------
                        +       62h for 79 tasks
            - I can do one level-3 task in 1-2weeks, which will branch out to ~80 subtasks
        - one high-level task takes on average 13h (2days), but varies (2sigma) up to a 1.5week
"""


# %%
"""
- lingo:
    - i is `censored` at t: I don't know if i has died, I only know that i had not died before t
    - y_t: min(t, c), with
        - c: time of censoring, i.e. last time that i was observed alive before losing contact
        - t: time of death
    - delta = 1 if death has occurred, delta = 0 if not
    - covariates: predicting factors like age, occupation, habits etc.
- survival function S(t) = prob that I'm still alive at time t
- cuml hazard function H(t) = prob that I've died before t
- `sksurv.nonparametric.kaplan_meier_estimator()`
    - calculates S(t) from `[(delta_1, y_1), (delta_2, y_2), ...]`
- sksurv.nonparametric.nelson_aalen_estimator():
    - same, but calculates H(t)
- neither kaplan nor nelson can take in predicting factors like age, occupation, habits etc., aka. `covariates` 
    - `sksurv.linear_model.CoxPHSurvivalAnalysis` does do that, though.
    - assumes `proprtional hazards`:
        - It assumes that a baseline hazard function exists and that covariates change the “risk” (hazard) only proportionally. 
        - In other words, it assumes that the ratio of the “risk” of experiencing an event of two patients remains constant over time.
        - am I right in interpreting this as follows?
            - the hazard due to a covariate may increase over time
            - but it must increase at the same rate for all patients
    - once CoxHP has been fitted, you can get
        - S(t) from `sksurv.linear_model.CoxPHSurvivalAnalysis.predict_survival_function()`
        - H(t) from `sksurv.linear_model.CoxPHSurvivalAnalysis.predict_cumulative_hazard_function()`
"""

from sksurv.datasets import load_veterans_lung_cancer

data_x, data_y = load_veterans_lung_cancer()
data_y  # [(delta_i, y_i),...] = [(dead, time_of_death), (dead, time_of_death), (not_dead, last_spoken), ...]

# %%
import matplotlib.pyplot as plt
from sksurv.nonparametric import kaplan_meier_estimator

time, survival_prob = kaplan_meier_estimator(
    data_y["Status"], data_y["Survival_in_days"] #, conf_type="log-log"
)
plt.step(time, survival_prob, where="post")
plt.ylim(0, 1)
plt.ylabel(r"est. probability of survival $\hat{S}(t)$")
plt.xlabel("time $t$")


# %%
# @TODO: would be nice to have a `lastEditedAt` column in DB.

covariate_data = []
survival_data = []
def treeToSksurvData(tree):
    died = False if tree["completedAt"] == -1 else True
    observationTime = tree["secondsActive"]
    survival_datum = (died, observationTime)
    covariate_datum = {
        "level_bu": tree["level_bu"],
        "level_td": tree["level_td"],
        # "cumulativeTime": tree["cumulativeTime"],
        "bodyLength": len(tree["body"]),
        "childCount": len(tree["children"])
    }
    survival_data.append(survival_datum)
    covariate_data.append(covariate_datum)
    for child in tree["children"]:
        treeToSksurvData(child)

treeToSksurvData(tree)

# %%
x = pd.DataFrame(covariate_data)
y = np.asarray(survival_data, dtype=[('died', bool), ('time', int)])
estimator = CoxPHSurvivalAnalysis()
estimator.fit(x, y)

# %%
prediction = estimator.predict(x)
result = concordance_index_censored(y["died"], y["time"], prediction)
result[0]

# %%

def fit_and_score_features(X, y):
    n_features = X.shape[1]
    scores = np.empty(n_features)
    m = CoxPHSurvivalAnalysis()
    for j in range(n_features):
        Xj = X[:, j : j + 1]
        m.fit(Xj, y)
        scores[j] = m.score(Xj, y)
    return scores

scores = fit_and_score_features(x.values, y)
pd.Series(scores, index=x.columns).sort_values(ascending=False)

"""
    Interpretation: almost no variable has much predicting power
    bodyLength is yet the best
    level_bu and childCount seem to predict very little (!)
"""
# %%
testData = pd.DataFrame(covariate_data[0:3])
surv = estimator.predict_survival_function(testData)
plt.step(surv[0].x / (60 * 60), surv[0].y, where="post", label=f"{covariate_data[0]}")
plt.step(surv[1].x / (60 * 60), surv[1].y, where="post", label=f"{covariate_data[1]}")
plt.step(surv[2].x / (60 * 60), surv[2].y, where="post", label=f"{covariate_data[2]}")
plt.legend()

# %%
