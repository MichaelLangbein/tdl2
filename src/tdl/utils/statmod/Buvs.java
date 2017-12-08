package tdl.utils.statmod;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

import org.apache.commons.math3.distribution.ExponentialDistribution;
import org.apache.commons.math3.distribution.PoissonDistribution;
import org.jfree.util.ArrayUtilities;

import tdl.model.Task;


/**
 * Bottom-Up Variable Structure Model
 * 
 * 
 */
public class Buvs implements StatMod {
	
	private WorkHours wh;
	
	private int treedepth;
	
	private HashMap<Integer, ArrayList<Double>> netTimes = new HashMap<Integer, ArrayList<Double>>();
	private HashMap<Integer, Double> meanNetTimes = new HashMap<Integer, Double>();
	private HashMap<Integer, Double> varNetTimes = new HashMap<Integer, Double>();	
	private double globalMeanNetTime;
	private double globalVarNetTime;
	private HashMap<Integer, ExponentialDistribution> expDs = new HashMap<Integer, ExponentialDistribution>();

	private HashMap<Integer, ArrayList<Integer>> childCounts = new HashMap<Integer, ArrayList<Integer>>();
	private HashMap<Integer, Double> meanChildCounts = new HashMap<Integer, Double>();
	private double globalMeanChildCount;	
	private HashMap<Integer, PoissonDistribution> poisDs = new HashMap<Integer, PoissonDistribution>();
	
	private HashMap<Integer, ArrayList<Double>> mixings = new HashMap<Integer, ArrayList<Double>>();
	private HashMap<Integer, Double> meanMixings = new HashMap<Integer, Double>();
	private double globalMeanMixing;

	
	public Buvs() {
		this.wh = new WorkHours();
	}

	@Override
	public void calculateModelParameters(Task root) {
		treedepth = getHeight(root);
		fillNetTimes(root, netTimes);
		fillChildCouns(root, childCounts);
		
		calcNetMeanTimes(netTimes);
		calcVarNetTimes(netTimes);
		calcMeanChildCounts(childCounts);
		
		globalMeanNetTime = averageMeanNetTime();
		globalMeanChildCount = averageMeanChildCount();
		globalVarNetTime = averageVarNetTime();
		calcPoisDistrs();
		calcExpDistrs();
		
		 fillMixings(root, mixings);
		 calcMeanMixings(mixings);
		 globalMeanMixing = averageMixing();
		
	}


	private Double getMeanNetTime(int depth) {
		Double mnt = meanNetTimes.get(depth);
		if(mnt == null) {
			mnt = globalMeanNetTime;
		}
		return mnt;
	}


	private Double getVarNetTime(int depth) {
		Double vnt = varNetTimes.get(depth);
		if(vnt == null || vnt == 0) {
			vnt = globalVarNetTime;
		}
		return vnt;
	}


	private Double getMeanChildCount(int depth) {
		Double mcc = meanChildCounts.get(depth);
		if(mcc == null) {
			mcc = globalMeanChildCount;
		}
		return mcc;
	}


	private void calcExpDistrs() {
		for(int d = 0; d < treedepth; d++) {
			Double mean = getMeanNetTime(d);
			ExponentialDistribution gam = new ExponentialDistribution(mean);  
			expDs.put(d, gam);
		}
	}



	private void calcPoisDistrs() {
		for(int d = 0; d < treedepth; d++) {
			Double mean = getMeanChildCount(d);
			if(mean > 0) {
				PoissonDistribution pd = new PoissonDistribution(mean);
				poisDs.put(d, pd);				
			}
		}
	}

	private double averageMeanChildCount() {
		double sum = 0;
		for(double c : meanChildCounts.values()) {
			sum += c;
		}
		Double average = sum / meanChildCounts.size();
		if(average.isNaN()) {
			average = 0.0;
		}
		return average;
	}

	private double averageMeanNetTime() {
		double sum = 0;
		for(double t : meanNetTimes.values()) {
			sum += t;
		}
		Double average = sum / meanNetTimes.size();
		if(average.isNaN()) {
			average = 0.0;
		}
		return average;
	}


	private double averageVarNetTime() {
		double sum = 0;
		for(double v : varNetTimes.values()) {
			sum += v;
		}
		Double average = sum / varNetTimes.size();
		if(average.isNaN()) {
			average = 0.0;
		}
		return average;
	}
	
	

	private double averageMixing() {
		double sum = 0;
		for(double m : meanMixings.values()) {
			sum += m;
		}
		Double average = sum / meanMixings.size();
		if(average.isNaN()) {
			average = 0.0;
		}
		return average;
	}
	
	private void calcMeanChildCounts(HashMap<Integer, ArrayList<Integer>> childCounts) {
		for(Integer d : childCounts.keySet()) {
			double sum = 0;
			for(double c : childCounts.get(d)) {
				sum += c;
			}
			double meanCount = sum / childCounts.get(d).size();
			meanChildCounts.put(d, meanCount);
		}
	}

	private void calcNetMeanTimes(HashMap<Integer, ArrayList<Double>> netTimes) {
		for(Integer d : netTimes.keySet()) {
			double sum = 0;
			for(double t : netTimes.get(d)) {
				sum += t;
			}
			double meanTime = sum / netTimes.get(d).size();
			meanNetTimes.put(d, meanTime);
		}
	}

	

	private void calcVarNetTimes(HashMap<Integer, ArrayList<Double>> netTimes) {
		for(Integer d : netTimes.keySet()) {
			double mean = meanNetTimes.get(d);
			double sum = 0;
			for(double t : netTimes.get(d)) {
				sum += (mean - t)*(mean - t);
			}
			double varTime = sum / netTimes.get(d).size();
			varNetTimes.put(d, varTime);
		}
	}
	


	private void calcMeanMixings(HashMap<Integer, ArrayList<Double>> mixings) {
		for(Integer d : mixings.keySet()) {
			double sum = 0;
			for(double t : mixings.get(d)) {
				sum += t;
			}
			double meanMix = sum / mixings.get(d).size();
			meanMixings.put(d, meanMix);
		}
	}
	
	private void fillChildCouns(Task root, HashMap<Integer, ArrayList<Integer>> childCounts) {
		int depth = getDepth(root);
		int chCount = root.getChildren().size();
		if(childCounts.get(depth) != null) {
			childCounts.get(depth).add(chCount);			
		}else {
			childCounts.put(depth, new ArrayList<Integer>());
			childCounts.get(depth).add(chCount);
		}
		for(Task child : root.getChildren()) {
			fillChildCouns(child, childCounts);
		}
	}

	private void fillNetTimes(Task root, HashMap<Integer, ArrayList<Double>> netTimes) {
		int depth = getDepth(root);
		if(root.isCompleted()) {
			double netTime = root.getSecondsActive();
			if(netTime > 30) {
				if(netTimes.get(depth) != null) {
					netTimes.get(depth).add(netTime);			
				}else {
					netTimes.put(depth, new ArrayList<Double>());
					netTimes.get(depth).add(netTime);
				}				
			}
		}
		for(Task child : root.getChildren()) {
			fillNetTimes(child, netTimes);
		}
	}



	private void fillMixings(Task root, HashMap<Integer, ArrayList<Double>> mixings) {
		int depth = getDepth(root);
		Date created = root.getCreated();
		Date finished = root.getCompleted();
		if(created != null && finished != null) { // Note: this also checks that a created field does even exist. This is not the case for older tasks. 
			long grossTime = root.getSecondsActiveRecursive();
			long diffSeconds = wh.workSecondsBetweenDates(created, finished);
			double mix = (double) grossTime / (double) diffSeconds;
			if(mixings.get(depth) != null) {
				mixings.get(depth).add(mix);			
			}else {
				mixings.put(depth, new ArrayList<Double>());
				mixings.get(depth).add(mix);
			}
		}
		for(Task child : root.getChildren()) {
			fillMixings(child, mixings);
		}
	}
	
	
	@Override
	public double estimateTimeToComplete(Task tree) {
		double expctTime = 0;
		
		if(tree.isCompleted()) {
			return tree.getSecondsActiveRecursive();
		}
		
		// factor 1: net time of base
		int depth = getDepth(tree);
		long secsActive = tree.getSecondsActive();
		expctTime += getExpectedNetTimeCond(depth, secsActive);
		
		// factor 2: estimated gross time of children
		for(Task child : tree.getChildren()) {
			expctTime += estimateTimeToComplete(child);
		}
		
		// factor 3: expected number of additional children
		int k0 = tree.getChildren().size();
		double lambda = meanChildCounts.get(depth);
		double additChildren = getExpectedChildCountCond(lambda, k0) - k0;
		double expTimeNewChild = expectedTimeNewChild(depth);
		expctTime += additChildren * expTimeNewChild;
		
		return expctTime;
	}



	/**
	 * Returns the distance from the tree root
	 * 
	 * @param tree
	 * @return
	 */
	private int getDepth(Task tree) {
		int depth = 0;
		Task parent = tree.getParent();
		while(parent != null) {
			depth++;
			parent = parent.getParent();
		}
		return depth;
	}


	/**
	 * Returns the distance to the furthest leaf
	 * 
	 * @param root
	 * @return
	 */
	private int getHeight(Task root) {
		int height = 1;
		int maxChHeight = 0;
		for(Task child : root.getChildren()) {
			int chHeight = getHeight(child);
			if(chHeight > maxChHeight) {
				maxChHeight = chHeight;
			}
		}
		height += maxChHeight;
		return height;
	}
	
	private double factorial(int k) {
		double out = 1;
		while(k > 0) {
			out *= k;
			k--;
		}
		return out;
	}

	
	/**
	 * Estimates the number of hits in a Poisson process, given that we already have k0 hits.
	 * 
	 * @param lambda
	 * @param k0
	 * @return
	 */
	public double getExpectedChildCountCond(double lambda, int k0) {
		double sum1 = 0;
		double sum2 = 0;
		for(int i = 0; i < k0; i++) {
			sum1 += i * Math.pow(lambda, i) / factorial(i);
			sum2 += Math.pow(lambda, i) / factorial(i);
		}
		double a = lambda - Math.exp(-lambda) * sum1;
		double b = 1 - Math.exp(-lambda) * sum2;
		return a / b;
	}
	
	
	/**
	 * Returns the expected gross time for a completely new childnode
	 * 
	 * @param depth
	 * @return
	 */
	private double expectedTimeNewChild(int depth) {
		double expTime = 0;
		int maxDepth = meanNetTimes.size();
		expTime +=  getExpectedNetTimeCond(depth, 0);
		double chCount = 1;
		for(int d = depth; d < maxDepth; d++) {
			expTime += chCount * getExpectedNetTimeCond(d, 0);
			chCount *= meanChildCounts.get(d);
		}
		return expTime;
	}
	

	public double getExpectedNetTimeCond(int depth, long secsActive) {
		ExponentialDistribution exDis = expDs.get(depth);
		double ex = secsActive + exDis.getMean();
		return ex;
	}


	public int getTreeDepth() {
		return treedepth;
	}


	public HashMap<Integer, ArrayList<Double>> getNetTimes() {
		return this.netTimes;
	}



	public HashMap<Integer, ArrayList<Integer>> getChildCounts() {
		return this.childCounts;
	}


	public HashMap<Integer, PoissonDistribution> getPoisDs() {
		return this.poisDs;
	}



	public HashMap<Integer, ExponentialDistribution> getExpDs() {
		return this.expDs;
	}
	
	public Double getMixingFactor(int depth) {
		Double mix = meanMixings.get(depth);
		if(mix == null) {
			mix = globalMeanMixing;
		}
		return mix;
	}

	private HashMap<Integer, Double> mapOnDouble(HashMap<Integer, Double> data, Function<Double, Double> f) {
		int size = data.size();
		HashMap<Integer, Double> out = new HashMap<Integer, Double>();
		for(int i = 0; i < size; i++) {
			out.put(i, f.apply(data.get(i)));
		}
		return out;
	}
	
	
	
}
