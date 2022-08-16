package tdl.view.upcoming;

import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
import java.awt.font.TextAttribute;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.swing.DefaultListCellRenderer;
import javax.swing.JLabel;
import javax.swing.JList;

import tdl.model.Task;
import tdl.view.tree.TreeView;

@SuppressWarnings("serial")
public class TaskListRenderer extends DefaultListCellRenderer {
	
	private Font normalFont;
	private Font crossedFont;

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public TaskListRenderer () {
		Map attr = new HashMap();
		normalFont = new Font(attr);
		Map attrc = new HashMap();
		attrc.put(TextAttribute.STRIKETHROUGH, TextAttribute.STRIKETHROUGH_ON);
		crossedFont = new Font(attrc);
	}
	
	@Override
	public Component getListCellRendererComponent(JList<?> list, Object element, int index, boolean selected, boolean focus) {
		JLabel comp =  (JLabel) super.getListCellRendererComponent(list, element, index, selected, focus);
		
		if(element instanceof Task) {
			Task task = (Task) element;
			
			String datum = null;
			
			if(task.isCompleted()) {
				
				// font and color
				comp.setForeground(Color.lightGray);
				comp.setFont(crossedFont);
				
				// date
				Date completed = task.getCompleted();
				SimpleDateFormat f = new SimpleDateFormat("dd.MM.yy");
				datum = f.format(completed);
				
			} else {
				// font
				comp.setFont(normalFont);
				
				Date deadline = task.getDeadline();
				if(deadline != null) {
					
					// color
					Date now = new Date();
					long diff = deadline.getTime() - now.getTime();
					float diffDays =  diff / (24* 1000 * 60 * 60);
					if (diff <= 0) {
						comp.setForeground(new Color(128, 0, 0));
					} else if (diffDays <= 1) {
						comp.setForeground(new Color(255, 51, 0));
					} else if (diffDays <= 3) {
						comp.setForeground(new Color(255, 153, 51));
					}
					
					// date
					SimpleDateFormat f = new SimpleDateFormat("dd.MM.yy");
					datum = f.format(deadline);
					
				}else {
					datum = "... ongoing ...";
				}
			}
			
			
			// Set text
			String labelText = datum + " -- " + getPathString(task.getParent()) + "/  " + task.getTitle();
			comp.setText(labelText);
		}
		return comp;
	}

	private String getPathString(Task task) {
		if(task == null) return "";
		Task parent = task.getParent();
		String pathUpToHere = getPathString(parent);
		int length = Math.min(3, task.getTitle().length());
		String fullPath = pathUpToHere + "/" + task.getTitle().substring(0, length);
		return fullPath;
	}
}
