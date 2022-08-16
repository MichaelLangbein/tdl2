package tdl.utils.statmod.MeanBottomUpVariableStructure;

import tdl.model.Task;
import tdl.utils.statmod.WeightedBottomUpVariableStructure.TreeParser;

/*
 * 	Pick 10% completed tasks
	Calibrate model without those 10%
	Predict those 10% with model
	Sum up errors. 
	
	But: should subtasks be completed yet?
	  Do the above in multiple steps: 
	    1. No subtasks assigned yet
	    2. 50% subtasks assigned, none completed
	    3. 75% assigned, 50% completed
	    4. 100% assigned, 75% completed
 * 
 * 
 * @TODO: Implementieren
 */
public class CrossValidation {

	private Task tree;
	private TreeParser treeParser;

	public CrossValidation (Task tree) {
		this.tree = null; // tree.copy();
		this.treeParser = new TreeParser(this.tree);
	}
}
