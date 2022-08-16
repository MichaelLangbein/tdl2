package tdl.utils.statmod.TopDownStaticStructure;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import tdl.model.Task;
import tdl.utils.statmod.StatMod;


/**
 * 
 * Top-Down Static Structure Model
 * 
 * We model the time it takes to complete a task as such: 
 * 
	E_0B = mean(0N)
	E_1B = mean(1N) + sum_children E_0B
	E_2B = mean(2N) + sum_children E_1B
	...
	
	where
	
	E: expected time
	N: netto
	B: brutto
	0: leaf
	1: first parent
	2: second parent 
	...
	
 *
 */
public class Tdss implements StatMod {

	
	private HashMap<Integer, Double> meansNetto;
	
	
	public Tdss() {}
	
	public void calculateModelParameters(Task root) {
		HashMap<Integer, ArrayList<Long>> data = extractData(root); 
		root.printTree();
		printData(data);
		
		meansNetto = new HashMap<Integer, Double>();
		
		for(Integer depth : data.keySet()) {
			Double mean = meanTime(data.get(depth));
			meansNetto.put(depth, mean);
		}
	}

	public double estimateTimeToComplete(Task tree) {
		Double E_T_brutto;
		
		if(tree.isCompleted()) {
			E_T_brutto = (double) tree.getSecondsActive();
		}
		
		else {
			
			int level = getDepth(tree);
			E_T_brutto = meansNetto.get(level);
			if(E_T_brutto == null) {
				E_T_brutto = 0D;
			}
			for(Task child : tree.getChildren()) {
				E_T_brutto += estimateTimeToComplete(child);
			}
			
		}
		
		return E_T_brutto;
	}

	private Double meanTime(ArrayList<Long> nettoTimes) {
		Double result = null;
		Integer count = nettoTimes.size();
		if(count > 0) {
			Long sum = 0L;
			for(Long nettoTime : nettoTimes) {
				sum += nettoTime;
			}
			result = new Double(sum) / new Double(count);
		}
		return result;
	}
	
	
	private HashMap<Integer, ArrayList<Long>> extractData(Task root) {
		
		// Setting up data structure
		Integer depth = getDepth(root);
		HashMap<Integer, ArrayList<Long>> data = new HashMap<Integer, ArrayList<Long>>();
		for(Integer i = 1; i <= depth; i++) {
			data.put(i, new ArrayList<Long>());
		}
		
		// Filling up data structure
		fillLevelTimesMap(root, data);
		
		return data;
	}
	
	/*
	 * Has every node in the tree calculate its depth and add its 
	 * worktime to the datastructure under that depth.
	 * 
	 *  HashMap<Integer, ArrayList<Integer>>
	 *  		depth    nettoTimes on this depth
	 */
	
	private HashMap<Integer, ArrayList<Long>> fillLevelTimesMap(Task root, HashMap<Integer, ArrayList<Long>> data) {
		
		if(root.isCompleted() && root.getSecondsActive() > 0) {		
			Integer depth = getDepth(root);
			long secsNetto = root.getSecondsActiveRecursive();
			data.get(depth).add(secsNetto);	
		}
		
		for(Task child : root.getChildren()) {
			fillLevelTimesMap(child, data);
		}
		
		return data;
	}

	private int getDepth(Task tree) {
		int depth = 1;
		int maxChildDepth = 0;
		for(Task task : tree.getChildren()) {
			int maxChildDepthCandidate = getDepth(task);
			maxChildDepth = Math.max(maxChildDepth, maxChildDepthCandidate);
		}
		return depth + maxChildDepth;
	}
	
	private void printData(HashMap<Integer, ArrayList<Long>> data) {
		System.out.println("Depth | Data");
		System.out.println("------|------------------------");
		
		for (Integer depth : data.keySet()) {
			String newline = depth + "     |  ";
			ArrayList<Long> rowData = data.get(depth);
			for(Long netTime : rowData) {
				newline = newline + netTime + "  ";
			}
			System.out.println(newline);
		}
	}


	
}
