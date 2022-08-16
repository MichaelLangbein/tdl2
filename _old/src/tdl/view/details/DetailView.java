package tdl.view.details;


import java.awt.Dimension;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;

import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.ToolTipManager;

import tdl.controller.Controller;
import tdl.messages.Message;
import tdl.messages.MessageType;
import tdl.messages.MessageRecipient;
import tdl.model.Task;
import tdl.view.details.attachments.AttachmentView;

import org.jdesktop.swingx.JXDatePicker;


public class DetailView implements MessageRecipient {

	private Controller controller;
	private JPanel jp;
	private JLabel descrLabel;
	private JTextArea descrTextfield;
	private JScrollPane descrscollpane;
	private JXDatePicker deadlinePicker;
	private JLabel attachLabel;
	private AttachmentView attachmentView;
	private JPanel attachmentListPanel;
	
	
	public DetailView(Controller controller) {
		this.controller = controller;
		
		ToolTipManager.sharedInstance().setDismissDelay(Integer.MAX_VALUE);
		
		descrLabel = new JLabel("Description");
		descrLabel.setToolTipText(getHoverText());
		descrTextfield = new JTextArea();
		descrTextfield.setLineWrap(true);
		descrTextfield.setWrapStyleWord(true);
		descrscollpane = new JScrollPane(descrTextfield);
		//descrscollpane.setPreferredSize(new Dimension(400, 400));
		
		deadlinePicker = new JXDatePicker();
		deadlinePicker.addActionListener(new DatePickerListener());
		
		attachLabel = new JLabel("attachments");
		attachmentView = new AttachmentView(this);
		attachmentListPanel = attachmentView.getJPanel();
		
		
		this.jp = new JPanel(new GridBagLayout());
		GridBagConstraints labelConstraints = new GridBagConstraints();
        labelConstraints.gridx = 0;
        labelConstraints.gridy = 0;
        labelConstraints.anchor = GridBagConstraints.NORTHEAST;
        GridBagConstraints bigFieldConstraints = new GridBagConstraints();
        bigFieldConstraints.gridx = 0;
        bigFieldConstraints.gridy = 1;
        bigFieldConstraints.gridwidth = 2;
        bigFieldConstraints.weightx = bigFieldConstraints.weighty = 1.0;
        bigFieldConstraints.fill = GridBagConstraints.BOTH;
        GridBagConstraints secondBigFieldConstraints = new GridBagConstraints();
        secondBigFieldConstraints.gridx = 2;
        secondBigFieldConstraints.gridy = 1;
        secondBigFieldConstraints.gridwidth = 1;
        secondBigFieldConstraints.weightx = secondBigFieldConstraints.weighty = 1.0;
        secondBigFieldConstraints.fill = GridBagConstraints.BOTH;
        GridBagConstraints extraConstraints = new GridBagConstraints();
        extraConstraints.gridx = 1; 
        extraConstraints.gridy = 0;
        GridBagConstraints secondExtraConstraints = new GridBagConstraints();
        secondExtraConstraints.gridx = 2; 
        secondExtraConstraints.gridy = 0;
        
        jp.add(descrLabel, labelConstraints);
        jp.add(descrscollpane, bigFieldConstraints);
        jp.add(deadlinePicker, extraConstraints);
        jp.add(attachLabel, secondExtraConstraints);
        jp.add(attachmentListPanel, secondBigFieldConstraints);
	}

	public JPanel getPanel() {
		return jp;
	}

	public Task getCurrentTask() {
		return controller.getCurrentTask();
	}
	
	public ArrayList<File> getCurrentAttachmentList() {
		return getCurrentTask().getAttachmentsInclParents();
	}
	
	
	private class DatePickerListener implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent e) {
			JXDatePicker picker = (JXDatePicker) e.getSource();
			Date selectedDate = picker.getDate();
			Message m = new Message(MessageType.TASK_CHANGE_DEADLINE_REQUEST);
			m.addHeader("task", getCurrentTask());
			m.addHeader("deadline", selectedDate);
			controller.receiveMessage(m);
		}
	}
	
	
	@Override
	public void receiveMessage(Message message) {
		System.out.println("DetailView now receiving " + message.getMessageType());
		switch(message.getMessageType()) {
		case FILE_DROPPED_IN:
			controller.receiveMessage(message);
			break;
		case UPDATED_TASK:
			setCurrentTask((Task) message.getHeaders().get("task"));
			attachmentView.receiveMessage(message);
			break;
		case NEW_TASK_ACTIVE:
			setCurrentTask((Task) message.getHeaders().get("task"));
			attachmentView.receiveMessage(message);
			break;
		case ADDED_SUBTASK:
			break;
		case DELETE_FILE_REQUEST:
			controller.receiveMessage(message);
			break;
		case PREPARE_DELETING_TASK:
			Task taskToDelete = (Task) message.getHeaders().get("task");
			if(taskToDelete == getCurrentTask()) {
				saveDetails();
			}
			break;
		case DELETED_FILE:
			attachmentView.receiveMessage(message);
			break;
		default:
			break;
		}
	}

	private void saveDetails() {
		Message m = new Message(MessageType.SAVE_TASK_REQUEST);
		m.addHeader("task", getCurrentTask());
		controller.receiveMessage(m);
	}

	private void setCurrentTask(Task currentTask) {
		setDescription(currentTask.getDescription());
		setDeadline(currentTask.getDeadline());
	}

	private void setDeadline(Date deadline) {
		deadlinePicker.setDate(deadline);
	}


	private void setDescription(String description) {
		descrTextfield.setText(description);
	}

	public String getDescription() {
		return descrTextfield.getText();
	}
	

	private String getHoverText() {
		return "<html><small><h2>Four principles</h2>\r\n" + 
				"<p><em>How to Solve It</em> suggests the following steps when solving a <a title=\"Mathematical problem\" href=\"https://en.wikipedia.org/wiki/Mathematical_problem\">mathematical problem</a>:</p>\r\n" + 
				"<ol>\r\n" + 
				"<li>First, you have to <em><a title=\"Understanding\" href=\"https://en.wikipedia.org/wiki/Understanding\">understand</a> the <a title=\"Problem\" href=\"https://en.wikipedia.org/wiki/Problem\">problem</a></em>.<sup></sup></li>\r\n" + 
				"<li>After understanding, <em><a title=\"Plan\" href=\"https://en.wikipedia.org/wiki/Plan\">make a plan</a></em>.</li>\r\n" + 
				"<li><em>Carry out the plan</em>.</li>\r\n" + 
				"<li><em><a title=\"Review\" href=\"https://en.wikipedia.org/wiki/Review\">Look back</a></em> on your work.<sup></sup> <a title=\"Scientific method\" href=\"https://en.wikipedia.org/wiki/Scientific_method\">How could it be better</a>?</li>\r\n" + 
				"</ol>\r\n" + 
				"<p>If this technique fails, P&oacute;lya advises: \"If you can't solve a problem, then there is an easier problem you can solve: find it.\" Or: \"If you cannot solve the proposed problem, try to solve first some related problem. Could you imagine a more accessible related problem?\"</p>\r\n" + 
				"<h3>First principle: Understand the problem</h3>\r\n" + 
				"<p>\"Understand the problem\" is often neglected as being obvious and is not even mentioned in many mathematics classes. Yet students are often stymied in their efforts to solve it, simply because they don't understand it fully, or even in part. In order to remedy this oversight, P&oacute;lya taught teachers how to prompt each student with appropriate questions,&nbsp;depending on the situation, such as:</p>\r\n" + 
				"<ul>\r\n" + 
				"<li>What are you asked to find or show?</li>\r\n" + 
				"<li>Can you restate the problem in your own words?</li>\r\n" + 
				"<li>Can you think of a picture or a diagram that might help you understand the problem?</li>\r\n" + 
				"<li>Is there enough information to enable you to find a solution?</li>\r\n" + 
				"<li>Do you understand all the words used in stating the problem?</li>\r\n" + 
				"<li>Do you need to ask a question to get the answer?</li>\r\n" + 
				"</ul>\r\n" + 
				"<p>The teacher is to select the question with the appropriate level of difficulty for each student to ascertain if each student understands at their own level, moving up or down the list to prompt each student, until each one can respond with something constructive.</p>\r\n" + 
				"<h3>Second principle: Devise a plan</h3>\r\n" + 
				"<p>P&oacute;lya mentions that there are many reasonable ways to solve problems.<sup></sup> The skill at choosing an appropriate strategy is best learned by solving many problems. You will find choosing a strategy increasingly easy. A partial list of strategies is included:</p>\r\n" + 
				"<ul>\r\n" + 
				"<li>Guess and check<sup></sup></li>\r\n" + 
				"<li>Make an orderly list<sup></sup></li>\r\n" + 
				"<li>Eliminate possibilities<sup></sup></li>\r\n" + 
				"<li>Use symmetry<sup></sup></li>\r\n" + 
				"<li>Consider special cases<sup></sup></li>\r\n" + 
				"<li>Use direct reasoning</li>\r\n" + 
				"<li>Solve an equation<sup></sup></li>\r\n" + 
				"</ul>\r\n" + 
				"<p>Also suggested:</p>\r\n" + 
				"<ul>\r\n" + 
				"<li>Look for a pattern<sup></sup></li>\r\n" + 
				"<li>Draw a picture<sup></sup></li>\r\n" + 
				"<li>Solve a simpler problem<sup></sup></li>\r\n" + 
				"<li>Use a model<sup></sup></li>\r\n" + 
				"<li>Work backward<sup></sup></li>\r\n" + 
				"<li>Use a formula<sup></sup></li>\r\n" + 
				"<li>Be creative<sup></sup></li>\r\n" + 
				"<li>Use your head/noggin<sup></sup></li>\r\n" + 
				"</ul>\r\n" + 
				"<h3>Third principle: Carry out the plan</h3>\r\n" + 
				"<p>This step is usually easier than devising the plan.<sup></sup> In general, all you need is care and patience, given that you have the necessary skills. Persist with the plan that you have chosen. If it continues not to work, discard it and choose another. Don't be misled; this is how mathematics is done, even by professionals.</p>\r\n" + 
				"<h3>Fourth principle: Review/extend</h3>\r\n" + 
				"<p>P&oacute;lya mentions that much can be gained by taking the time to reflect and look back at what you have done, what worked and what didn't.<sup></sup><sup></sup> Doing this will enable you to predict what strategy to use to solve future problems, if these relate to the original problem.</p>"
				+ "</small></html>";
	}


}
