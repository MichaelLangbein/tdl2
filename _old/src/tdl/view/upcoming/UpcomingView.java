package tdl.view.upcoming;


import java.awt.Dimension;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;

import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;

import tdl.controller.Controller;
import tdl.messages.Message;
import tdl.messages.MessageType;
import tdl.messages.MessageRecipient;
import tdl.model.Task;
import tdl.view.upcoming.popup.UpcomingPopup;
import tdl.view.upcoming.popup.UpcomingPopupListener;


public class UpcomingView implements MessageRecipient {

	private Controller controller;
	private JPanel jp;
	private JLabel listlabel;
	private JTextField filterTextField;
	private JList<Task> jlist;
	private JScrollPane listscrollpane;
	
	public UpcomingView(Controller controller) {
		
		this.controller = controller;
		
		this.jp = new JPanel(new GridBagLayout());
		GridBagConstraints labelConstraints = new GridBagConstraints();
        labelConstraints.gridx = 0;
        labelConstraints.gridy = 0;
        labelConstraints.anchor = GridBagConstraints.NORTHEAST;
        GridBagConstraints filterFieldConstraints = new GridBagConstraints();
        filterFieldConstraints.gridx = 0;
        filterFieldConstraints.gridy = 1;
        filterFieldConstraints.gridwidth = 2;
        filterFieldConstraints.fill = GridBagConstraints.HORIZONTAL;
        GridBagConstraints bigFieldConstraints = new GridBagConstraints();
        bigFieldConstraints.gridx = 0;
        bigFieldConstraints.gridy = 2;
        bigFieldConstraints.gridwidth = 2;
        bigFieldConstraints.weightx = bigFieldConstraints.weighty = 1.0;
        bigFieldConstraints.fill = GridBagConstraints.BOTH;
		
		listlabel = new JLabel("Upcoming");
		jp.add(listlabel, labelConstraints);
		
		filterTextField = new JTextField();
		filterTextField.addKeyListener(new FilterListener());
		jp.add(filterTextField, filterFieldConstraints);
		
		jlist = new JList<Task>(new TaskListModel(controller.getBaseTask()));
		jlist.setCellRenderer(new TaskListRenderer());
		
		UpcomingPopup up = new UpcomingPopup(this);
		jlist.addMouseListener(new UpcomingPopupListener(up, this));
		
		listscrollpane = new JScrollPane(jlist);
		jp.add(listscrollpane, bigFieldConstraints);
	}

	public JPanel getPanel() {
		return jp;
	}

	@Override
	public void receiveMessage(Message message) {
		System.out.println("UpcomingView now receiving " + message.getMessageType());
		switch(message.getMessageType()) {
		case UPDATED_TASK:
			updateList();
			setCurrentTask( (Task) message.getHeaders().get("task") );
			break;
		case NEW_TASK_ACTIVE:
			updateList();
			setCurrentTask( (Task) message.getHeaders().get("task") );
			break;
		case ADDED_SUBTASK:
			updateList();
			break;
		default:
			break;
		}
	}
	
	private void updateList() {
		TaskListModel model = (TaskListModel) jlist.getModel();
		model.setData(controller.getBaseTask());
		refreshView();
	}
	
	private void setCurrentTask(Task currentTask) {
		jlist.setSelectedValue(currentTask, true);
		refreshView();
	}
	
	private void filterView(String filterText) {
		TaskListModel model = (TaskListModel) jlist.getModel();
		model.filterTasksByText(filterText);
		refreshView();
	}
	
	private void refreshView() {
		TaskListModel model = (TaskListModel) jlist.getModel();
		model.refreshView();
	}

	public void onPopupSetActiveRequested(Task clickedTask) {
		Message m = new Message(MessageType.NEW_TASK_ACTIVE_REQUEST);
		m.addHeader("task", clickedTask);
		System.out.println("UpcomingView now messaging " + m.getMessageType() + " for task "+ clickedTask.getTitle());
		controller.receiveMessage(m);
	}

	public Task getTaskForEvent(MouseEvent e) {
		return jlist.getModel().getElementAt(jlist.locationToIndex(e.getPoint()));
	}
	
	private class FilterListener extends KeyAdapter {
		
		public FilterListener() {}
		
@		Override
		public void keyPressed(KeyEvent e) {
			if(e.getKeyCode() == KeyEvent.VK_ENTER) {
				String filterText = filterTextField.getText();
				System.out.println("Now filtering tasks for the text: " + filterText);
				filterView(filterText);
				refreshView();
			}
		}
		
	}


}
