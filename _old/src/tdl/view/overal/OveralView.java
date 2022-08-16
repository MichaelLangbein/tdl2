package tdl.view.overal;

import java.awt.FlowLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.GridLayout;
import java.awt.event.WindowListener;

import javax.swing.BorderFactory;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;

import tdl.view.calendar.CalendarView;
import tdl.view.details.DetailView;
import tdl.view.stats.StatsView;
import tdl.view.tree.TreeView;
import tdl.view.upcoming.UpcomingView;

public class OveralView {
	
	private JPanel jpTree;
	private JPanel jpCal;
	private JPanel statsPanel;
	private JTabbedPane tp;
	private JFrame jf;
	
	public OveralView (String title, TreeView treeView, DetailView detailView, UpcomingView upcomingView, CalendarView calendarView, StatsView statsView) {
		
		jpTree = new JPanel(new GridBagLayout());
		GridBagConstraints tasktreeConstraints = new GridBagConstraints();
		tasktreeConstraints.gridx = 0;
		tasktreeConstraints.gridy = 0;
		tasktreeConstraints.weightx = tasktreeConstraints.weighty = 1.5;
		tasktreeConstraints.fill = GridBagConstraints.BOTH;
        GridBagConstraints detailsConstraints = new GridBagConstraints();
        detailsConstraints.gridwidth = 3;
        detailsConstraints.gridx = 1;
        detailsConstraints.gridy = 0;
        detailsConstraints.weightx = detailsConstraints.weighty = 3.0;
        detailsConstraints.fill = GridBagConstraints.BOTH;
        GridBagConstraints upcomingConstraints = new GridBagConstraints();
        upcomingConstraints.gridwidth = 1;
        upcomingConstraints.gridx = 4; 
        upcomingConstraints.gridy = 0;
        upcomingConstraints.weightx = upcomingConstraints.weighty = 1.0;
        upcomingConstraints.fill = GridBagConstraints.BOTH;
		
        jpTree.add(treeView.getPanel(), tasktreeConstraints);
        jpTree.add(detailView.getPanel(), detailsConstraints);
		jpTree.add(upcomingView.getPanel(), upcomingConstraints);
		
		jpCal = new JPanel();
		jpCal.add(calendarView.getPanel());
		
		statsPanel = new JPanel();
		statsPanel.add(statsView.getPanel());
		JScrollPane scrolableStatsPanel = new JScrollPane(statsPanel);
		
		tp = new JTabbedPane();
		tp.addTab("TreeView", jpTree);
		tp.addTab("CalView", jpCal);
		tp.addTab("StatsView", scrolableStatsPanel);
		
		jf = new JFrame(title);
		jf.setSize(800, 600);
		jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		jf.add(tp);
		jf.pack();
	}


	public void setOnCloseListener(WindowListener l) {
		jf.addWindowListener(l);
	}

	public JFrame getJFrame() {
		return jf;
	}

}
