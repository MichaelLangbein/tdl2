package tdl.view.details.attachments;

import java.awt.Color;
import java.awt.Component;
import java.io.File;
import java.util.ArrayList;

import javax.swing.DefaultListCellRenderer;
import javax.swing.JLabel;
import javax.swing.JList;

import tdl.model.Task;


public class AttachmentListCellRenderer extends DefaultListCellRenderer{

	private static final long serialVersionUID = 1L;
	private AttachmentView view;

	public AttachmentListCellRenderer(AttachmentView view) {
		this.view = view;
	}

	@Override
	public Component getListCellRendererComponent(JList<?> list, Object value, int index, boolean isSelected, boolean cellHasFocus) {
		JLabel label = (JLabel) super.getListCellRendererComponent(list, value, index, isSelected, cellHasFocus);
		
		File renderedFile = (File) value;
		Task currentTask = view.getCurrentTask();
		ArrayList<File> lowestLevelFiles = currentTask.getAttachments();
		
		if(! lowestLevelFiles.contains(renderedFile)) {
			label.setForeground(Color.GRAY);
		}
		
		return label;
	}

}
