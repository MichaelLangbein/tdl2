package tdl.view.tree;

import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;

import javax.swing.JMenuItem;
import javax.swing.JPopupMenu;


@SuppressWarnings("serial")
public class TreePopup extends JPopupMenu {

	@SuppressWarnings("unused")
	private TreeView treeView; 
	private JMenuItem addSubtaskItem;
	private JMenuItem completeTaskItem;
	private JMenuItem reactivateTaskItem;
	private JMenuItem deleteTaskItem;
	private TaskNode clickedNode;
	
	public TreePopup(TreeView treeView) {
		this.treeView = treeView;
		
		addSubtaskItem = new JMenuItem("Add subtask");
		addSubtaskItem.addMouseListener(new MouseListener() {
			@Override
			public void mousePressed(MouseEvent e) {
				treeView.onPopupAddSubtaskRequested(clickedNode);
			}
			@Override
			public void mouseReleased(MouseEvent e) {}
			@Override
			public void mouseExited(MouseEvent e) {}
			@Override
			public void mouseEntered(MouseEvent e) {}
			@Override
			public void mouseClicked(MouseEvent e) {}
		});
		add(addSubtaskItem);
		
		completeTaskItem = new JMenuItem("Task completed");
		completeTaskItem.addMouseListener(new MouseListener() {
			@Override
			public void mouseReleased(MouseEvent e) {
				treeView.onPopupTaskCompleteRequested(clickedNode);
			}
			@Override
			public void mouseClicked(MouseEvent arg0) {}
			@Override
			public void mouseEntered(MouseEvent e) {}
			@Override
			public void mouseExited(MouseEvent e) {}
			@Override
			public void mousePressed(MouseEvent e) {}
		});
		add(completeTaskItem);
		
		reactivateTaskItem = new JMenuItem("Reactivate task");
		reactivateTaskItem.addMouseListener(new MouseListener() {
			@Override
			public void mouseReleased(MouseEvent e) {
				treeView.onPopupReactivateTaskRequested(clickedNode);
			}
			@Override
			public void mouseClicked(MouseEvent arg0) {}
			@Override
			public void mouseEntered(MouseEvent e) {}
			@Override
			public void mouseExited(MouseEvent e) {}
			@Override
			public void mousePressed(MouseEvent e) {}
		});
		add(reactivateTaskItem);
		
		deleteTaskItem = new JMenuItem("Delete task");
		deleteTaskItem.addMouseListener(new MouseListener() {
			@Override
			public void mousePressed (MouseEvent e) {
				treeView.onPopupDeleteTaskRequested(clickedNode);
			}
			@Override
			public void mouseReleased(MouseEvent e) {}
			@Override
			public void mouseClicked(MouseEvent e) {}
			@Override
			public void mouseExited(MouseEvent e) {}
			@Override
			public void mouseEntered(MouseEvent e) {}
		});
		add(deleteTaskItem);
	}

	public void setClickedNode(TaskNode tn) {
		this.clickedNode = tn;
	}

}
