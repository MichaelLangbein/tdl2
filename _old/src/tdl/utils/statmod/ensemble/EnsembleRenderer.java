package tdl.utils.statmod.ensemble;

import java.util.Collection;
import java.util.HashMap;

import javax.swing.JPanel;

import tdl.model.Task;
import tdl.utils.scheduler.WorkHours;
import tdl.utils.statmod.ModRenderer;
import tdl.utils.statmod.StatMod;

public class EnsembleRenderer implements ModRenderer {

	private Ensemble ensemble;
	private WorkHours wh;

	public EnsembleRenderer(Ensemble ensemble) {
		this.ensemble = ensemble;
		this.wh = new WorkHours();
	}

	@Override
	public JPanel render() {
		// TODO Auto-generated method stub
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
			
			description += "-----------------------------------\n <br/>";
			HashMap<String, Double> estimates = ensemble.getSeparateEstimates(task);
			for(String model : estimates.keySet()) {
				Double estimate = estimates.get(model);
				description += model + ": " + wh.secsToHumanReadable(estimate.longValue()) + " \n <br/>";
			}
			Double mean = calcMean(estimates.values());
			description += "Mean: " + wh.secsToHumanReadable(mean.longValue()) + " \n <br/>";
			description += "-----------------------------------\n <br/>";
			
			
			int depth = task.getDepth();
			description += "Depth: " + depth + "\n";
			
		}
		
		return description;
	}

	private Double calcMean(Collection<Double> values) {
		if(values.size() == 0) return 0.0;
		
		Double sum = 0.0;
		for(Double el : values) {
			sum += el;
		}
		return sum / values.size();
	}

}
