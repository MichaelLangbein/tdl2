package tdl.utils.statmod.WeightedBottomUpVariableStructure;

import java.util.ArrayList;

import tdl.model.Task;
import tdl.utils.statmod.StatMod;

/**
 * We're assuming an exponential distribution for both the time a task can take and the number of children a task may have. 
 * As a result, the conditional mean equals the current value plus the mean. 
 * 
 * @author michael
 *
 */
public class WBuvs implements StatMod {
	
	private Double weightingExponent = 2.0;
	private TreeParser tp;
	private DistanceMatrix dm;
	private Double globalMeanTimeNet;
	private Double globalMeanChildcountNet;

	@Override
	public void calculateModelParameters(Task root) {
		tp = new TreeParser(root);
		dm = tp.getDistanceMatrix();
		globalMeanTimeNet = tp.getGlobalMeanTimeNet();
		globalMeanChildcountNet = tp.getGlobalMeanChildcountNet();
	}

	@Override
	public double estimateTimeToComplete(Task task) {
		
		if(task.isCompleted()) {
			return task.getSecondsActiveRecursive();
		}
		
		// Step 1: expected time net of the task alone
		Double expectedTimeNet = expectedTimeNet(task);
		
		
		// Step 2: expected time of the existing children
		Double expectedTimeExistingChildren = 0.0;
		for(Task child : task.getChildren()) {
			expectedTimeExistingChildren += estimateTimeToComplete(child);
		}
		
		// Step 3: expected time of the expected children yet to come
		Double nrChildrenExpected = expectedNrChildrenNet(task);
		Double nrAdditionalChildrenExpected = nrChildrenExpected - task.getChildCount();
		Double expectedTimeNewChild = expectedTimeNewChildGrossNthGeneration(task, 1);
		Double expectedTimeNewChildren = nrAdditionalChildrenExpected * expectedTimeNewChild;
		
		Double sum = expectedTimeNet + expectedTimeExistingChildren + expectedTimeNewChildren;
		
		return sum;
	}


	/**
	 * E[T_n(task)] | tree_0 = integrate_t0^oo t P(t) dt
	 * For an exponential  distribution, this yields: t0 + lambda
	 * @param task
	 * @return
	 */
	private Double expectedTimeNet(Task task) {
		
		if(task.isCompleted()) {
			return (double) task.getSecondsActive();
		}
		
		Double timeActive = (double) task.getSecondsActive();
		Double timeWeightedMean = weightedMeanTimeActive(task);
		
		Double sum = timeActive + timeWeightedMean;
		
		return sum;
	}

	private Double weightedMeanTimeActive(Task baseTask) {
		Double sum = 0.0;
		Double sumW = 0.0;
		ArrayList<Task> tasks = tp.getTasksCompleted();
		
		if(tasks.size() == 0) {
			return 0.0;
		}
		
		for(Task task : tasks) {
			Integer distance = dm.distance(baseTask, task);
			Double weight = Math.pow( 1.0/distance, weightingExponent );
			sumW += weight;
			sum += weight * task.getSecondsActive();
		}
		
		Double mean = sum/sumW;
		
		return mean;
	}

	
	public Double expectedNrChildrenNet(Task task) {
		
		if(task.isCompleted()) {
			return (double) task.getChildCount();
		}
		
		Double nrChildrenCurrent = (double) task.getChildCount();
		Double nrChildrenWeightedMean = weightedMeanNrChildren(task);
		
		Double sum = nrChildrenCurrent + nrChildrenWeightedMean;
		
		return sum;
	}

	private Double weightedMeanNrChildren(Task baseTask) {
		Double sum = 0.0;
		Double sumW = 0.0;
		ArrayList<Task> completedTasks = tp.getTasksCompleted();
		
		if(completedTasks.size() == 0) {
			return 0.0;
		}
		
		for(Task task : completedTasks) {
			Integer distance = dm.distance(baseTask, task);
			Double weight = Math.pow( 1.0/distance, weightingExponent );
			sumW += weight;
			sum += weight * task.getChildCount();
		}
		
		Double mean = sum/sumW;
		
		return mean;
	}
	

	private Double expectedTimeNewChildGrossNthGeneration(Task parent, int n) {
		
		if (parent.isCompleted()) {
			return 0.0;
		}
		if (n > 5) { // We only go 5 generations deep. 
			return 0.0;
		}
		
		// Step 1: expected time net of the task alone
		Double expectedTimeNet = expectedTimeNetNthGeneration(parent, n);
				
				
		// Step 3: expected time of the expected children yet to come
		Double nrChildrenExpected = expectedNrChildrenNetNthGeneration(parent, n);
		Double expectedTimeNewChild = expectedTimeNewChildGrossNthGeneration(parent, n + 1);
		Double expectedTimeNewChildren = nrChildrenExpected * expectedTimeNewChild;
		
		Double sum = expectedTimeNet + expectedTimeNewChildren;
				
		
		// E[T_b] = E[T_n] + E[Ch_n] E[T_b(child)]
		//        = T_g + Ch_g ( T_g + Ch_g ( T_g + Ch_g ( T_g + Ch_g ( T_g + Ch_g ( ... ) ) ) ) )
		//Double sum = globalMeanTimeNet * (1.0 / (1.0 - globalMeanChildcountNet) );
		
		return sum;
		
	}


	private Double expectedTimeNetNthGeneration(Task parent, int n) {

		if(parent.isCompleted()) {
			return (double) parent.getSecondsActive();
		}
		
		Double timeWeightedMean = weightedMeanTimeActiveNthGenertaion(parent, n);
		
		return timeWeightedMean;
	}

	private Double weightedMeanTimeActiveNthGenertaion(Task parent, int n) {
		Double sum = 0.0;
		Double sumW = 0.0;
		ArrayList<Task> tasks = tp.getTasksCompleted();
		
		if(tasks.size() == 0) {
			return 0.0;
		}
		
		for(Task task : tasks) {
			Integer distance = dm.distanceToNthChild(parent, n, task);
			Double weight = Math.pow( 1.0/distance, weightingExponent );
			sumW += weight;
			sum += weight * task.getSecondsActive();
		}
		
		Double mean = sum/sumW;
		
		return mean;
	}

	private Double expectedNrChildrenNetNthGeneration(Task parent, int n) {

		if(parent.isCompleted()) {
			return (double) parent.getChildCount();
		}
		
		Double nrChildrenWeightedMean = weightedMeanNrChildrenNthGeneration(parent, n);
		
		return nrChildrenWeightedMean;
	}

	private Double weightedMeanNrChildrenNthGeneration(Task parent, int n) {
		Double sum = 0.0;
		Double sumW = 0.0;
		ArrayList<Task> tasks = tp.getTasksCompleted();
				
		if(tasks.size() == 0) {
			return 0.0;
		}

		for(Task task : tasks) {
			Integer distance = dm.distanceToNthChild(parent, n, task);
			Double weight = Math.pow( 1.0/distance, weightingExponent );
			sumW += weight;
			sum += weight * task.getChildCount();
		}
		
		Double mean = sum/sumW;
		
		return mean;
	}
}
