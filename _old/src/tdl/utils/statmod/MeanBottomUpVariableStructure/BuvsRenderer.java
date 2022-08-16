package tdl.utils.statmod.MeanBottomUpVariableStructure;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.GridLayout;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

import javax.swing.JPanel;
import javax.swing.JTextArea;

import org.apache.commons.math3.distribution.ExponentialDistribution;
import org.apache.commons.math3.distribution.PoissonDistribution;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartFrame;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.DatasetRenderingOrder;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.plot.ValueMarker;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.xy.DefaultXYItemRenderer;
import org.jfree.chart.renderer.xy.XYItemRenderer;
import org.jfree.data.statistics.HistogramDataset;
import org.jfree.data.statistics.HistogramType;
import org.jfree.data.xy.XYSeries;
import org.jfree.data.xy.XYSeriesCollection;
import org.jfree.ui.RectangleInsets;

import tdl.model.Task;
import tdl.utils.scheduler.WorkHours;
import tdl.utils.statmod.ModRenderer;



public class BuvsRenderer implements ModRenderer {
	
	private static int nrGroupsTime = 7;
	private static int nrGroupsChildren = 7;
	private static int imgWidth = 300;
	private static int imgHeight = 200;
	private Buvs model;
	private WorkHours wh;

	public BuvsRenderer(Buvs buvs) {
		model = buvs;
		wh = new WorkHours();
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
			description += "Depth: " + depth + "\n";
			
			int children = task.getChildCountRecursive();
			double childrenExpected = model.getExpectedChildCountCondRecursive(task);
			description += "Current children: " + children + " Expected children: " + childrenExpected + "\n <br/>";
			
			double mix = model.getMixingFactor(depth);
			description += "Mixing factor: " + mix + "\n <br/>";
			
			double expectedTimeMix = model.estimateTimeToCompleteInclMix(task) - activeTime;
			Date finish = wh.addSecondsToDate(expectedTimeMix, new Date());
			description += "expected to be done on " + finish;
		}
		
		return description;
	}

	@Override
	public JPanel render() {
		
		int treeDepth = model.getTreeDepth();
		JPanel jp = new JPanel(new GridLayout(treeDepth - 1, 5));
		
		HashMap<Integer, ArrayList<Integer>> childCounts = model.getChildCounts();
		HashMap<Integer, ArrayList<Double>> netTimes = model.getNetTimes();
		HashMap<Integer, PoissonDistribution> poisDs = model.getPoisDs();
		HashMap<Integer, ExponentialDistribution> expDs = model.getExpDs();
		
		for(int i = 1; i < treeDepth; i++) { // starting at 1: root will never be finished. 
			
			ChartPanel childPanel = createChildGraph(i, childCounts.get(i), poisDs.get(i));
			ChartPanel timePanel = createTimeGraph(i, netTimes.get(i), expDs.get(i));
			ChartPanel childConditional = createChildCondExGraph(i, childCounts.get(i), poisDs.get(i));
			ChartPanel timeConditional = createTimeCondExGraph(i, netTimes.get(i), expDs.get(i));
			
			childPanel.setPreferredSize(new Dimension(imgWidth,  imgHeight));
			timePanel.setPreferredSize(new Dimension(imgWidth,  imgHeight));
			timeConditional.setPreferredSize(new Dimension(imgWidth,  imgHeight));
			childConditional.setPreferredSize(new Dimension(imgWidth,  imgHeight));
			
			JTextArea stats = createStatsArea(i);
			
			jp.add(stats);
			jp.add(childPanel);
			jp.add(childConditional);
			jp.add(timePanel);
			jp.add(timeConditional);
		}
		
		return jp;
	}

	
	private JTextArea createStatsArea(int i) {
		JTextArea stats = new JTextArea();
		stats.setEditable(false);
		String text = "Depth " + i + " \n";
		text += "Mixing factor: " + model.getMixingFactor(i);
		stats.setText(text);
		return stats;
	}

	private ChartPanel createTimeCondExGraph(int depth, ArrayList<Double> netTimes, ExponentialDistribution exponentialDistribution) {
		if(netTimes == null || exponentialDistribution == null) return new ChartPanel(null);
		
		
		XYSeriesCollection dataset = new XYSeriesCollection();
		
		XYSeries t0Series = new XYSeries("t0");
		XYSeries e0Series = new XYSeries("E[t]");
		XYSeries eCondSeries = new XYSeries("E[t|t>t0]");
		double t0Max = Collections.max(netTimes);
		int steps = 20;
		double delta = t0Max / steps;
		for(int s = 0; s < steps; s++) {
			double t0 = delta * s;
			t0Series.add(t0 / 60.0, t0 / 60.0);
			e0Series.add(t0 / 60.0, exponentialDistribution.getNumericalMean() / 60.0);
			eCondSeries.add(t0 / 60.0, model.getExpectedNetTimeCond(depth, (long) t0) / 60.0);
		}
		
		dataset.addSeries(t0Series);
		dataset.addSeries(e0Series);
		dataset.addSeries(eCondSeries);
		
		JFreeChart chart = ChartFactory.createXYLineChart("", "t0", "E[t|t>c0]", dataset, PlotOrientation.VERTICAL, false, false, false);
		XYPlot plot = (XYPlot) chart.getPlot();

		// Getting frame
		ChartFrame cf = new ChartFrame("E on " + depth, chart);
		ChartPanel cp = cf.getChartPanel();
		
		return cp;
	}

	private ChartPanel createChildCondExGraph(int depth, ArrayList<Integer> childCounts, PoissonDistribution pd) {
		if(pd == null) return new ChartPanel(null);
		
		
		XYSeriesCollection dataset = new XYSeriesCollection();
		
		XYSeries c0Series = new XYSeries("c0");
		XYSeries e0Series = new XYSeries("E[c]");
		XYSeries eCondSeries = new XYSeries("E[c|c>c0]");
		int c0Max = 10;
		for(int c0 = 0; c0 < c0Max; c0++) {
			c0Series.add(c0, c0);
			e0Series.add(c0, pd.getNumericalMean());
			eCondSeries.add(c0, model.getExpectedChildCountCond(depth, c0));
		}
		
		dataset.addSeries(c0Series);
		dataset.addSeries(e0Series);
		dataset.addSeries(eCondSeries);
		
		JFreeChart chart = ChartFactory.createXYLineChart("", "c0", "E[c|c>c0]", dataset, PlotOrientation.VERTICAL, false, false, false);
		XYPlot plot = (XYPlot) chart.getPlot();

		// Getting frame
		ChartFrame cf = new ChartFrame("E on " + depth, chart);
		ChartPanel cp = cf.getChartPanel();
		
		return cp;
	}

	private ChartPanel createTimeGraph(int depth, ArrayList<Double> netTimes, ExponentialDistribution exponentialDistribution) {
		if(netTimes == null || netTimes.size() <= 1) return new ChartPanel(null);
		
		// Histogram
		double[] data = toPrimitiveDouble(netTimes);
		data = mapOnDouble(data, a -> a/60);
		HistogramDataset dataset = new HistogramDataset();
		dataset.setType(HistogramType.SCALE_AREA_TO_1);
		dataset.addSeries("Times", data, nrGroupsTime);

		// Pdf
		XYSeries xyseries = new XYSeries("pdf");
		if(exponentialDistribution != null) {			
			int steps = 20;
			double maxT = Collections.max(netTimes) + Math.sqrt(exponentialDistribution.getNumericalVariance());
			double delta = maxT / steps;
			for(int i = 1; i < steps; i++) { // strikt positiv; darf nicht bei 0 beginnen
				double t = delta * i;
				double pt = exponentialDistribution.density(t);
				xyseries.add(t/60, pt * 100);
			}
		}
		XYSeriesCollection dataset2 = new XYSeriesCollection();
		dataset2.addSeries(xyseries);
		XYItemRenderer pdfRenderer = new DefaultXYItemRenderer();
		
		// Creating chart with dataset 1
		JFreeChart barChart = ChartFactory.createHistogram("", "minutes", "prob/count", dataset, PlotOrientation.VERTICAL, false, false, false);
		
		// Getting plot 
		XYPlot plt = (XYPlot) barChart.getPlot();
		
		// Adding dataset 2
		plt.setDataset(1, dataset2);
		plt.setRenderer(1, pdfRenderer);
		plt.setDatasetRenderingOrder( DatasetRenderingOrder.FORWARD );
		
		// Adding mean
		if(exponentialDistribution != null) {
			double m = exponentialDistribution.getNumericalMean() / 60;
			ValueMarker marker = new ValueMarker(m);  // position is the value on the axis
			marker.setPaint(Color.black);
			marker.setLabel("mean: " + m);
			marker.setLabelOffset(new RectangleInsets(15, -60, 0, 0));
			plt.addDomainMarker(marker);
		}
			
		
		// Getting frame
		ChartFrame cf = new ChartFrame("", barChart);
		ChartPanel cp = cf.getChartPanel();
		
		return cp;
	}



	private ChartPanel createChildGraph(int depth, ArrayList<Integer> childCounts, PoissonDistribution pd) {
		if(childCounts == null || childCounts.size() <= 1) return new ChartPanel(null);
		
		// Histogram
		double[] data = toPrimitiveInt(childCounts);
		HistogramDataset dataset = new HistogramDataset();
		dataset.setType(HistogramType.SCALE_AREA_TO_1);
		dataset.addSeries("hist", data, nrGroupsChildren);

		// Dataset 2
		XYSeries xyseries = new XYSeries("pdf");
		if(pd != null) {
			int steps = Collections.max(childCounts) + 1;
			for(int t = 0; t < steps; t++) {
				double pt = pd.probability(t);
				xyseries.add(t, pt);
			}			
		}
		XYSeriesCollection dataset2 = new XYSeriesCollection();
		dataset2.addSeries(xyseries);
		XYItemRenderer pdfRenderer = new DefaultXYItemRenderer();
		
		// Creating chart with dataset 1
		JFreeChart barChart = ChartFactory.createHistogram("", "children", "count/prob", dataset, PlotOrientation.VERTICAL, false, false, false);
		
		// Getting plot 
		XYPlot plt = (XYPlot) barChart.getPlot();
		
		// Adding dataset 2
		plt.setDataset(1, dataset2);
		plt.setRenderer(1, pdfRenderer);
		plt.setDatasetRenderingOrder( DatasetRenderingOrder.FORWARD );
		
		// Adding mean
		if(pd != null) {
			double m = pd.getNumericalMean();
			ValueMarker marker = new ValueMarker(m);  // position is the value on the axis
			marker.setPaint(Color.black);
			marker.setLabel("mean: " + m);
			marker.setLabelOffset(new RectangleInsets(15, -60, 0, 0));
			plt.addDomainMarker(marker);
		}
		
		// Getting frame
		ChartFrame cf = new ChartFrame("children on " + depth, barChart);
		ChartPanel cp = cf.getChartPanel();
		
		return cp;
	}
	
	
	

	private double[] toPrimitiveDouble(ArrayList<Double> list) {
		int size = list.size();
		double[] rawData = new double[size];
		for(int i = 0; i < size; i++) {
			rawData[i] = list.get(i);
		}
		return rawData;
	}
	
	private double[] toPrimitiveInt(ArrayList<Integer> list) {
		int size = list.size();
		double[] rawData = new double[size];
		for(int i = 0; i < size; i++) {
			rawData[i] = list.get(i);
		}
		return rawData;
	}


	private double[] mapOnDouble(double[] data, Function<Double, Double> f) {
		int size = data.length;
		double[] out = new double[size];
		for(int i = 0; i < size; i++) {
			out[i] = f.apply(data[i]);
		}
		return out;
	}
}
