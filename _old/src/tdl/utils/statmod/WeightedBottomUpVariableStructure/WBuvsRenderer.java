package tdl.utils.statmod.WeightedBottomUpVariableStructure;

import java.util.Date;

import javax.swing.JPanel;

import tdl.model.Task;
import tdl.utils.scheduler.WorkHours;
import tdl.utils.statmod.ModRenderer;

public class WBuvsRenderer implements ModRenderer {

	WBuvs model;
	WorkHours wh;
	
	public WBuvsRenderer(WBuvs statMod) {
		model = statMod;
		wh = new WorkHours();
	}

	@Override
	public JPanel render() {
		return new JPanel();
	}

	@Override
	public String describeTask(Task task) {
		
String description = "";
		
		if(task.isCompleted()) {
			long complTime = task.getSecondsActiveRecursive();
			String complTimeString = wh.secsToHumanReadable(complTime);
			description += "Task completed in (brutto) " + complTimeString;
		}else {
			long activeTime = task.getSecondsActiveRecursive();
			String activeTimeString = wh.secsToHumanReadable(activeTime);
			description += "Task active since (brutto) " + activeTimeString + "\n <br/>";
			
			double expectedTime = model.estimateTimeToComplete(task);
			String expectedTimeString = wh.secsToHumanReadable((long) expectedTime);
			double perz = 100 * (double) activeTime / (double) expectedTime;
			description += "Expected time to completion: " + expectedTimeString + " ("+ perz + "% finished)\n <br/>";
			
			int depth = task.getDepth();
			description += "Depth: " + depth + "\n <br/>";
			
			int children = task.getChildCount();
			double netChildrenExpected = model.expectedNrChildrenNet(task);
			description += "Current children (nonrecur): " + children + " Expected children (nonrecur): " + (netChildrenExpected - children) + "\n <br/>";
			
//			double mix = model.getMixingFactor(depth);
//			description += "Mixing factor: " + mix + "\n <br/>";
//			
//			double expectedTimeMix = model.estimateTimeToCompleteInclMix(task) - activeTime;
//			Date finish = wh.addSecondsToDate(expectedTimeMix, new Date());
//			description += "expected to be done on " + finish;
		}
		
		return description;
	}

}
