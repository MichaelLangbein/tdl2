package tdl.utils.statmod.WeightedBottomUpVariableStructure;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.UUID;

import tdl.model.Task;

/**
 * Distance matrix for a Task-Tree
 * @author michael
 *
 */
public class DistanceMatrix {

	private ArrayList<Task> tasks;
	private HashMap<UUID, HashMap<UUID, Integer>> distances;

	public DistanceMatrix() {
		distances = new HashMap<UUID, HashMap<UUID, Integer>>();
		tasks = new ArrayList<Task>();
	}
	
	public void addTask(Task task) {
		distances.put(task.getId(), new HashMap<UUID, Integer>());
		for(Task t : tasks) {
			Integer dist = calcDistance(task, t);
			distances.get(task.getId()).put(t.getId(), dist);
			distances.get(t.getId()).put(task.getId(), dist);
		}
		tasks.add(task);
	}

	public Integer distance(Task baseTask, Task task) {
		return distances.get(baseTask.getId()).get(task.getId());
	}

	public Integer distanceToNthChild(Task parent, int n, Task task) {
		Integer distToParent = distance(parent, task);
		return distToParent + n;
	}
	
	private Integer calcDistance(Task taskA, Task taskB) {
		if(taskA == taskB) {
			return 0;
		}
		
		Integer distance = null; 
		
		ArrayList<Task> aVisited = new ArrayList<Task>();
		ArrayList<Task> bVisited = new ArrayList<Task>();
		Task headA = taskA;
		Task headB = taskB;
		Task parentA;
		Task parentB;
		aVisited.add(headA);
		bVisited.add(headB);
		
		boolean foundInPathA = false;
		boolean foundInPathB = false;
		while(!foundInPathA && !foundInPathB) {

			parentA = headA.getParent();
			if(parentA != null) {
				headA = parentA;
				aVisited.add(headA);

				if(bVisited.contains(headA)) {
					foundInPathB = true;
				}
			}
			
			
			parentB = headB.getParent();
			if(parentB != null) {
				headB = parentB;
				bVisited.add(headB);
				
				if(aVisited.contains(headB)) {
					foundInPathA = true;
				}				
			}
			
			if(parentA == null && parentB == null) {
				return null;
			}
		}
		
		if(foundInPathA) {
			int stepsFromTaskAToAncestor = aVisited.indexOf(headB);
			int stepsFromTaskBToAncestor = bVisited.size() - 1;
			distance = stepsFromTaskAToAncestor + stepsFromTaskBToAncestor;
		} else if(foundInPathB) {
			int stepsFromTaskBToAncestor = bVisited.indexOf(headA);
			int stepsFromTaskAToAncestor = aVisited.size() - 1;
			distance = stepsFromTaskAToAncestor + stepsFromTaskBToAncestor;
		} 
		
		return distance;
	}

}
