package tdl.view.calendar;


import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import javax.swing.JButton;
import javax.swing.JEditorPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextPane;
import javax.swing.ScrollPaneConstants;

import org.jdesktop.swingx.JXDatePicker;

import tdl.controller.Controller;
import tdl.messages.Message;
import tdl.messages.MessageRecipient;
import tdl.model.Task;
import tdl.utils.scheduler.ScheduleItem;

public class CalendarView implements MessageRecipient {
	
	private Controller controller;
	private JTextPane scheduleTextPane;
	private JScrollPane scrollingScheduleTextPane;
	private JButton updateScheduleButton;
	private JTextPane reportTextPane;
	private JScrollPane scrollingReportTextPane;
	private JXDatePicker reportFromField;
	private JXDatePicker reportToField;
	private JButton updateReportButton;
	private JPanel jp;

	public CalendarView(Controller controller) {
		this.controller = controller; 
		this.jp = new JPanel(new GridBagLayout());
		
		scheduleTextPane = new JTextPane();
		scheduleTextPane.setEditable(false);
		scrollingScheduleTextPane = new JScrollPane(scheduleTextPane, ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS, ScrollPaneConstants.HORIZONTAL_SCROLLBAR_AS_NEEDED); 
		updateScheduleButton = new JButton("Update schedule");
		updateScheduleButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				updateSchedule();
			}
		});
		
		reportTextPane = new JTextPane();
		reportTextPane.setEditable(false);
		scrollingReportTextPane = new JScrollPane(reportTextPane, ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS, ScrollPaneConstants.HORIZONTAL_SCROLLBAR_AS_NEEDED);
		updateReportButton = new JButton("Update report");
		updateReportButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				updateReport();
			}
		});
		reportFromField = new JXDatePicker();
		reportToField = new JXDatePicker();
		Calendar cal = new GregorianCalendar();
		cal.add(Calendar.DAY_OF_MONTH, -7);
		Date sevenDaysAgo = cal.getTime();
		reportFromField.setDate(sevenDaysAgo);
		cal.add(Calendar.DAY_OF_MONTH, 7);
		Date inSevenDays = cal.getTime();
		reportToField.setDate(inSevenDays);
		
		
        GridBagConstraints leftSmallFieldConstraints = new GridBagConstraints();
        leftSmallFieldConstraints.gridx = 0;
        leftSmallFieldConstraints.gridy = 0;
        
        GridBagConstraints rightLSmallFieldConstraints = new GridBagConstraints();
        rightLSmallFieldConstraints.gridx = 4;
        rightLSmallFieldConstraints.gridy = 0;
        rightLSmallFieldConstraints.weightx = 0.33; 
        rightLSmallFieldConstraints.weighty = 0.2;
        rightLSmallFieldConstraints.fill = GridBagConstraints.BOTH;
        GridBagConstraints rightMSmallFieldConstraints = new GridBagConstraints();
        rightMSmallFieldConstraints.gridx = 5;
        rightMSmallFieldConstraints.gridy = 0;
        rightMSmallFieldConstraints.weightx = 0.33; 
        rightMSmallFieldConstraints.weighty = 0.2;
        rightMSmallFieldConstraints.fill = GridBagConstraints.BOTH;
        GridBagConstraints rightRSmallFieldConstraints = new GridBagConstraints();
        rightRSmallFieldConstraints.gridx = 6;
        rightRSmallFieldConstraints.gridy = 0;
        rightRSmallFieldConstraints.weightx = 0.33; 
        rightRSmallFieldConstraints.weighty = 0.2;
        rightRSmallFieldConstraints.fill = GridBagConstraints.BOTH;
		
		GridBagConstraints leftBigFieldConstraints = new GridBagConstraints();
        leftBigFieldConstraints.gridx = 0;
        leftBigFieldConstraints.gridy = 1;
        leftBigFieldConstraints.gridwidth = 3;
        leftBigFieldConstraints.weightx = 0.5;
        leftBigFieldConstraints.weighty = 0.8;
        leftBigFieldConstraints.fill = GridBagConstraints.BOTH;
        leftBigFieldConstraints.insets = new Insets(3,3,3,3);
        
        
        GridBagConstraints rightBigFieldConstraints = new GridBagConstraints();
        rightBigFieldConstraints.gridx = 4;
        rightBigFieldConstraints.gridy = 1;
        rightBigFieldConstraints.gridwidth = 3;
        rightBigFieldConstraints.weightx = 0.5; 
        rightBigFieldConstraints.weighty = 0.8;
        rightBigFieldConstraints.fill = GridBagConstraints.BOTH;
        rightBigFieldConstraints.insets = new Insets(3,3,3,3);

        
		jp.add(scrollingScheduleTextPane, leftBigFieldConstraints);
		jp.add(updateScheduleButton, leftSmallFieldConstraints);
		jp.add(scrollingReportTextPane, rightBigFieldConstraints);
		jp.add(updateReportButton, rightRSmallFieldConstraints);
		jp.add(reportFromField, rightLSmallFieldConstraints);
		jp.add(reportToField, rightMSmallFieldConstraints);
		
		updateSchedule();
		updateReport();
	}

	@Override
	public void receiveMessage(Message message) {
		System.out.println("CalendarView now receiving " + message.getMessageType());
		switch(message.getMessageType()) {
		case UPDATED_TASK:
		case ADDED_SUBTASK:
			//updateSchedule(); //This now happens only on refresh click
			break;
		default:
			break;
		}
	}
	
	public JPanel getPanel() {
		return jp;
	}
	
	
	private void updateSchedule() {
		ArrayList<ScheduleItem> schedule = getSchedule();
		String t = formatSchedule(schedule);
		scheduleTextPane.setText(t);		
	}
	
	private ArrayList<ScheduleItem> getSchedule() {
		return controller.getSchedule();
	}
	
	private String formatSchedule(ArrayList<ScheduleItem> schedule) {
		String formatted = "";
		for(ScheduleItem si : schedule) {
			formatted += si.getFrom() + " - ";
			formatted += si.getTo() + " : ";
			formatted += si.getTask().getTitle() + " \n";
		}
		formatted += "";
		return formatted;
	}
	
	
	
	
	
	private class ReportRow {
		public String description;
		public Double active;
		public boolean completed;
		public ReportRow(String description, double active, boolean completed) {
			this.description = description;
			this.active = active;
			this.completed = completed; 
		}
	}
	
	
	
	private void updateReport() {
		String r = formatReport(controller.getBaseTask(), reportFromField.getDate(), reportToField.getDate());
		reportTextPane.setText(r);
	}
	
	private String formatReport(Task task, Date from, Date to) {
		String report = "";
		double timeTotal = 0.0;
		for(ReportRow s : doFormatReport(task, from, to) ) {
			report += s.description + "\n";
			timeTotal += s.active;
		}
		report += "Total time active: " + round(timeTotal, 2) + " hours\n";
		return report;
	}
	
	private ArrayList<ReportRow> doFormatReport(Task task, Date from, Date to) {
		ArrayList<ReportRow> r = new ArrayList<ReportRow>();
		
		if(task.wasActiveDuring(from, to)) {
			r.add( new ReportRow(task.getTitle(), task.getSecondsActive() / (60.0 * 60.0), task.isCompleted() )  );	
		}
		
		for(Task child : task.getChildren()) {
			for(ReportRow s : doFormatReport(child, from, to) ) {
				s.description = "    " + s.description;
				r.add(s);
			}
		}
		return r;
	}

	private double round(double value, int places) {
	    if (places < 0) throw new IllegalArgumentException();
	    long factor = (long) Math.pow(10, places);
	    value = value * factor;
	    long tmp = Math.round(value);
	    return (double) tmp / factor;
	}
}
