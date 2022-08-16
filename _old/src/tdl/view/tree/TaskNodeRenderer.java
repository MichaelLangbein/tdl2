package tdl.view.tree;


import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
import java.awt.font.TextAttribute;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.swing.JTree;
import javax.swing.tree.DefaultTreeCellRenderer;


@SuppressWarnings("serial")
public class TaskNodeRenderer extends DefaultTreeCellRenderer {
	
	private TreeView view;
	private Font normalFont;
	private Font crossedFont;

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public TaskNodeRenderer (TreeView view) {
		this.view = view;
		Map attr = new HashMap();
		normalFont = new Font(attr);
		Map attrc = new HashMap();
		attrc.put(TextAttribute.STRIKETHROUGH, TextAttribute.STRIKETHROUGH_ON);
		crossedFont = new Font(attrc);
	}

	@Override
	public Component getTreeCellRendererComponent(JTree tree, Object value, boolean selected, boolean expanded, boolean leaf, int row, boolean hasFocus) {
		Component component =  super.getTreeCellRendererComponent(tree, value, selected, expanded, leaf, row, hasFocus);
		if(value instanceof TaskNode) {
			TaskNode tn = (TaskNode) value;		
			
			if(tn.getTask().isCompleted()) {
				component.setForeground(Color.lightGray);
				component.setFont(crossedFont);
				
			} else {
				component.setFont(normalFont);
				Date deadline = tn.getDeadline();
				if(deadline != null) {
					Date now = new Date();
					long diff = deadline.getTime() - now.getTime();
					float diffDays =  diff / (24* 1000 * 60 * 60);
					if (diff <= 0) {
						component.setForeground(new Color(128, 0, 0));
					} else if (diffDays <= 1) {
						component.setForeground(new Color(255, 51, 0));
					} else if (diffDays <= 3) {
						component.setForeground(new Color(255, 153, 51));
					}					
				}
			}
			
			setToolTipText("<html>" + view.getHoverText(tn) + "</html>");
		}
		return component;
	}

}
