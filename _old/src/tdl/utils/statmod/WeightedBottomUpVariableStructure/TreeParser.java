package tdl.utils.statmod.WeightedBottomUpVariableStructure;

import java.util.ArrayList;

import tdl.model.Task;

public class TreeParser {
	
	private Task root;
	private ArrayList<Task> tasks;
	private ArrayList<Task> tasksCompleted;
	private Double globalMeanChildCountNet;
	private Double globalMeanTimeNet; 
	private DistanceMatrix dm;
	
	public TreeParser(Task root) {
		this.root = root;
		tasks = calcTasks(root, new ArrayList<Task>());
		tasksCompleted = calcTasksCompleted(root, new ArrayList<Task>());
		globalMeanChildCountNet = calcGlobalMeanChildCountNet();
		globalMeanTimeNet = calcGlobalMeanTimeNet();
		dm = calcDistanceMatrix(root);
	}

	public DistanceMatrix getDistanceMatrix() {
		return dm;
	}
	
	private DistanceMatrix calcDistanceMatrix(Task root) {
		
		DistanceMatrix dm = new DistanceMatrix();
		ArrayList<Task> tasks = getTasks();
		
		for(Task task : tasks) {
			dm.addTask(task);
		}
		
		return dm;
		
	}

	public ArrayList<Task> getTasks(){
		return tasks;
	}
	
	private ArrayList<Task> calcTasks(Task root, ArrayList<Task> tasks) {
		for(Task child : root.getChildren()) {
			ArrayList<Task> subTasks = calcTasks(child, new ArrayList<Task>());
			tasks.addAll(subTasks);
		}
		tasks.add(root);
		return tasks;
	}

	public ArrayList<Task> getTasksCompleted(){
		return tasksCompleted;
	}
	
	private ArrayList<Task> calcTasksCompleted(Task root, ArrayList<Task> tasks) {
		for(Task child : root.getChildren()) {
			ArrayList<Task> subTasks = calcTasksCompleted(child, new ArrayList<Task>());
			tasks.addAll(subTasks);
		}
		if(root.isCompleted()) {
			tasks.add(root);			
		}
		return tasks;
	}

	public Double getGlobalMeanChildcountNet() {
		return globalMeanChildCountNet;
	}
	
	private Double calcGlobalMeanChildCountNet() {
		// We don_t even have to calculate this. In a tree, the mean child count is always 1 - 1/N
		int size = tasksCompleted.size();
		if(size == 0) {
			return 0.0;
		} else {
			return 1.0 + (1.0/size);
		}
	}

	public Double getGlobalMeanTimeNet() {
		return globalMeanTimeNet;
	}


	private Double calcGlobalMeanTimeNet() {
		int count = tasksCompleted.size();
		if(count == 0) {
			return 0.0;
		}
		Double sum = 0.0;
		for(Task t : tasksCompleted) {
			sum += t.getSecondsActive();
		}
		return sum / count;
	}


}
