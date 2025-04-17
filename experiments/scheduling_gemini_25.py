#%%
import copy # Used for deep copying task data

# --- Original Loss Calculation Function (with potential redundancy noted) ---
def calcLoss(seq, original_tasks):
    """Calculates the loss for a given task sequence."""
    totalLoss = 0
    tasks_dict = {task["id"]: task for task in original_tasks}

    finish_times = {}
    work_done = {task_id: 0 for task_id in tasks_dict}

    # First pass: Determine finish time for each task
    for t, taskId in enumerate(seq):
        if taskId in work_done:
            work_done[taskId] += 1
            # Check if this is the last unit of work for this task
            if work_done[taskId] == tasks_dict[taskId]["work"]:
                finish_times[taskId] = t + 1 # Task finishes at the end of this time slot

    # Calculate loss based on finish times and original task definitions
    for task_id, task in tasks_dict.items():
        # Ensure task was actually finished (it should be by greedy scheduler)
        if task_id in finish_times:
            taskFinishedAt = finish_times[task_id]
            deadline = task["deadline"]

            # NOTE: The 'remainingWork * 3' term from the original function
            # will likely always be 0 here if the sequence completes all work,
            # as calculated *after* the sequence is generated.
            # It's kept here for consistency with the original logic, but
            # its effect might be null for complete schedules.
            # If the intent was different, this part might need revision.
            remainingWork = 0 # Assuming sequence completes the work
            totalLoss += remainingWork * 3

            timeLeft = max(deadline - taskFinishedAt, 0)
            timeOverdue = max(taskFinishedAt - deadline, 0)

            totalLoss -= timeLeft      # Reward for finishing early
            totalLoss += timeOverdue * 3 # Penalty for finishing late (higher weight)
        else:
            # Handle case where a task might not be finished (shouldn't happen with this greedy approach)
            # Apply a large penalty for unfinished work if necessary
            totalLoss += task["work"] * 3 # Example penalty for all work remaining

    # Calculate context switch penalty
    contextSwitches = 0
    for i, taskId in enumerate(seq):
        if i > 0 and seq[i] != seq[i-1]:
            contextSwitches += 1
    totalLoss += contextSwitches # Penalty for each context switch

    return totalLoss

# --- Helper function (if needed, similar to original clone) ---
def clone_tasks(tasks):
    """Creates a deep copy of the tasks list."""
    return copy.deepcopy(tasks)

# --- New Greedy Scheduling Function ---
def schedule_greedy_lst_context_aware(tasks_input):
    """
    Schedules tasks using a greedy Least Slack Time First approach,
    penalizing context switches during selection.
    """
    tasks = clone_tasks(tasks_input) # Work on a copy
    
    # Calculate total work units needed
    total_work_units = sum(task["work"] for task in tasks)
    
    # Initialize remaining work tracker
    remaining_work = {task["id"]: task["work"] for task in tasks}
    
    schedule = []
    current_time = 0
    last_task_id = None

    while current_time < total_work_units:
        best_task_id = -1
        min_priority_value = float('inf') # Lower value = higher priority

        available_tasks = [task for task in tasks if remaining_work[task["id"]] > 0]

        if not available_tasks:
            # Should not happen if total_work_units is correct
            print("Error: No available tasks but work remains.")
            break 

        for task in available_tasks:
            task_id = task["id"]
            
            # Calculate Slack Time
            slack = (task["deadline"] - current_time) - remaining_work[task_id]
            
            # Calculate Context Switch Penalty
            # Add a penalty if choosing this task causes a switch
            # The penalty value (e.g., 1) should ideally match the loss function's weight
            context_switch_penalty = 0
            if last_task_id is not None and task_id != last_task_id:
                context_switch_penalty = 1 # Matches the penalty in calcLoss

            # Priority: Lower slack is better, context switch adds penalty
            priority_value = slack + context_switch_penalty

            # Select task with the lowest priority value (best priority)
            # Simple tie-breaking: first task encountered with min priority wins
            if priority_value < min_priority_value:
                min_priority_value = priority_value
                best_task_id = task_id

        # Add the chosen task to the schedule
        if best_task_id != -1:
            schedule.append(best_task_id)
            remaining_work[best_task_id] -= 1
            last_task_id = best_task_id
            current_time += 1
        else:
            # Should not happen if there are available tasks
            print(f"Error: Could not select a task at time {current_time}")
            # Fallback: pick the first available task to avoid infinite loop
            if available_tasks:
                 fallback_task_id = available_tasks[0]["id"]
                 schedule.append(fallback_task_id)
                 remaining_work[fallback_task_id] -= 1
                 last_task_id = fallback_task_id
                 current_time += 1
            else:
                 break # No tasks left

    return schedule

# --- Main Execution ---
tasks_definition = [{
    "id": 1,
    "deadline": 5, 
    "work": 3 
}, {
    "id": 2,
    "deadline": 7, 
    "work": 2
}, {
    "id": 3,
    "deadline": 2, # Very tight deadline
    "work": 2
}]

print("Original Tasks:")
print(tasks_definition)
print("-" * 20)

# Generate schedule using the greedy algorithm
greedy_sequence = schedule_greedy_lst_context_aware(tasks_definition)

# Calculate the loss for the generated sequence
# Pass the original task definitions to calcLoss for correct deadline/work info
greedy_loss = calcLoss(greedy_sequence, tasks_definition) 

print("Greedy Schedule (LST + Context Penalty):")
print(f"  Sequence: {greedy_sequence}")
print(f"  Calculated Loss: {greedy_loss}")
print("-" * 20)

# --- Comparison (Optional - only run original if tasks are very small) ---
# print("Calculating loss via brute-force (may be very slow)...")
# try:
#     # Note: Your original createPermutations might need adjustment
#     # if it modifies the input list 'tasks' in place during recursion.
#     # It's safer to pass a copy if necessary.
#     # Also, the original createPermutations logic seems complex and potentially
#     # incorrect for generating all unique permutations of work units.
#     # Using itertools.permutations on an expanded list is more standard:
#     import itertools
    
#     work_units = []
#     for task in tasks_definition:
#         work_units.extend([task["id"]] * task["work"])

#     best_solution_brute = {
#         "sequence": [],
#         "loss": float("inf")
#     }
    
#     # Generate unique permutations using itertools
#     # Warning: This set conversion can consume a lot of memory for large inputs
#     unique_perms = set(itertools.permutations(work_units)) 
    
#     for sequence_tuple in unique_perms:
#         sequence = list(sequence_tuple)
#         loss = calcLoss(sequence, tasks_definition)
#         if loss < best_solution_brute["loss"]:
#             best_solution_brute["loss"] = loss
#             best_solution_brute["sequence"] = sequence

#     print("Optimal Schedule (Brute-Force Permutation):")
#     print(f"  Sequence: {best_solution_brute['sequence']}")
#     print(f"  Calculated Loss: {best_solution_brute['loss']}")

# except Exception as e:
#      print(f"Could not run brute-force comparison: {e}")


# %%
