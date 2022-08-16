package tdl.view.tree;



import java.awt.Dimension;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Point;
import java.awt.dnd.DropTarget;
import java.awt.dnd.DropTargetAdapter;
import java.awt.dnd.DropTargetDropEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.util.HashMap;

import javax.swing.DropMode;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTree;
import javax.swing.SwingUtilities;
import javax.swing.ToolTipManager;
import javax.swing.TransferHandler;
import javax.swing.event.TreeModelEvent;
import javax.swing.event.TreeModelListener;
import javax.swing.event.TreeSelectionEvent;
import javax.swing.event.TreeSelectionListener;
import javax.swing.tree.DefaultMutableTreeNode;
import javax.swing.tree.DefaultTreeModel;
import javax.swing.tree.TreePath;
import javax.swing.tree.TreeSelectionModel;

import tdl.controller.Controller;
import tdl.messages.Message;
import tdl.messages.MessageType;
import tdl.messages.MessageRecipient;
import tdl.model.Task;

public class TreeView implements MessageRecipient {
	
	private Controller controller;
	private TaskNode baseTaskNode;
	private JLabel treeLabel;
	private JTree jtree;
	private JScrollPane treescrollpane;
	private JPanel jp;
	
	
	public TreeView(Controller controller) {
		
		this.controller = controller;
		this.baseTaskNode = new TaskNode(controller.getBaseTask());
		this.treeLabel = new JLabel("TaskTree");
		
		// JTree basic setup
		this.jtree = new JTree(baseTaskNode);
		jtree.getSelectionModel().setSelectionMode(TreeSelectionModel.SINGLE_TREE_SELECTION);
		jtree.setEditable(true);
		jtree.setDragEnabled(true);
		jtree.setDropMode(DropMode.USE_SELECTION);
		jtree.setCellRenderer(new TaskNodeRenderer(this));
		jtree.setSelectionPath(new TreePath(baseTaskNode));
		jtree.setDropTarget(new DropTarget(jtree, TransferHandler.MOVE, new MyDropTargetAdapter()));
		
		// Listeners
		jtree.addTreeSelectionListener(new FocusChangeListener() );
		ToolTipManager.sharedInstance().registerComponent(jtree);
		ToolTipManager.sharedInstance().setInitialDelay(2000);
		jtree.getModel().addTreeModelListener( new NodeEditListener() );
		TreePopup tp = new TreePopup(this);
		jtree.addMouseListener(new TreePopupListener(tp, this));
		
		// Layout
		treescrollpane = new JScrollPane(jtree);
		//treescrollpane.setPreferredSize(new Dimension(300, 400));
		
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
        GridBagConstraints extraConstraints = new GridBagConstraints();
        extraConstraints.gridx = 1; 
        extraConstraints.gridy = 0;
		
        jp.add(treeLabel, labelConstraints);
        jp.add(treescrollpane, bigFieldConstraints);
	}

	public JPanel getPanel() {
		return jp;
	}


	public TaskNode getCurrentNode() {
		return (TaskNode) jtree.getSelectionPath().getLastPathComponent();
	}
	
	
	//-------------------------------------------------------------//
	//-------- Methods for handling messages  ---------------------//
	//-------------------------------------------------------------//
	

	@Override
	public void receiveMessage(Message message) {
		System.out.println("TreeView now receiving " + message.getMessageType());
		switch(message.getMessageType()) {
		case NEW_TASK_ACTIVE:
			setCurrentTask( (Task) message.getHeaders().get("task") );
			break;
		case ADDED_SUBTASK:
			Task child = (Task) message.getHeaders().get("child");
			Task parent = (Task) message.getHeaders().get("parent");
			TaskNode parentNode = getNodeForTask(parent);
			TaskNode childNode = new TaskNode(child);
			addChild(parentNode, childNode);
			refresh();
			setCurrentTask(child);
			break;
		case UPDATED_TASK:
		case COMPLETED_TASK:
		case REACTIVATED_TASK:
			refresh();
			setCurrentTask((Task) message.getHeaders().get("task"));
			break;
		case PREPARE_DELETING_TASK:
			deleteNodeForTask( (Task) message.getHeaders().get("task") );
			break;
		case DELETED_TASK:
			refresh();
			break;
		case DELETED_FILE:
			break;
		case MOVED_TASK:
			Task task = (Task) message.getHeaders().get("task");
			Task oldParent = (Task) message.getHeaders().get("fromParent");
			Task newParent = (Task) message.getHeaders().get("toParent");
			moveTask(task, oldParent, newParent);
			break;
		default:
			break;
		}
	}

	/*
	 * deletes all branches that have lost their reference to a task
	 */
//	private void pruneTree(TaskNode base) {
//		if(base.getTask() == null) {
//			removeNode(base);
//		}else {
//			int I = base.getChildCount();
//			TaskNode[] children = new TaskNode[I];
//			for(int i = 0; i < I; i++) {
//				children[i] = (TaskNode) base.getChildAt(i);
//			}
//			for(TaskNode child : children) {
//				pruneTree(child);
//			}
//		}
//	}

	private void moveTask(Task task, Task oldParent, Task newParent) {
		TaskNode movedNode = getNodeForTask(task);
		TaskNode sourceParentNode = getNodeForTask(oldParent);
		TaskNode targetParentNode = getNodeForTask(newParent);
		
		sourceParentNode.remove(movedNode);
		targetParentNode.add(movedNode);
	}

	private void deleteNodeForTask(Task task) {
		TaskNode nodeToDelete = getNodeForTask(task);
		removeNode(nodeToDelete);
	}

	private void refresh() {
		DefaultTreeModel model = (DefaultTreeModel) jtree.getModel();
		model.reload();
		setCurrentTask(controller.getCurrentTask());
	}

	private void setCurrentTask(Task currentTask) {
		TaskNode tn = getNodeForTask(currentTask);
		TreePath path = new TreePath(tn.getPath());
		jtree.setSelectionPath(path);
		jtree.scrollPathToVisible(path);
	}
	
	private TaskNode getNodeForTask(Task currentTask) {
		TaskNode tn = baseTaskNode.search(currentTask);
		return tn;
	}
	
	private TaskNode getNodeForPath(TreePath path) {
		TaskNode tn = (TaskNode) path.getLastPathComponent();
		return tn;
	}
	
	public TaskNode getNodeForEvent(MouseEvent e) {
		TaskNode node = null;
		TreePath path = jtree.getPathForLocation(e.getX(), e.getY());
		if(path != null) {
			node = getNodeForPath(path);
		}
		return node;
	}

	private void addChild(TaskNode parent, TaskNode child) {
		DefaultTreeModel dtm = (DefaultTreeModel) jtree.getModel();
		dtm.insertNodeInto(child, parent, parent.getChildCount());
	}
	
	private void removeNode(TaskNode node) {
		DefaultTreeModel dtm = (DefaultTreeModel) jtree.getModel();
		dtm.removeNodeFromParent(node);
	}

	
	private class NodeEditListener implements TreeModelListener {
		@Override
		public void treeNodesChanged(TreeModelEvent e) {
			TaskNode parent = (TaskNode) (e.getTreePath().getLastPathComponent());
			TaskNode editedNode = getCurrentNode(); // is there no better way to get the just edited node?!
			Message m = new Message(MessageType.TASK_CHANGE_TITLE_REQUEST);
			m.addHeader("task", editedNode.getTask());
			m.addHeader("title", editedNode.getUserObject());
			controller.receiveMessage(m);
		}
		@Override
		public void treeNodesInserted(TreeModelEvent e) {}
		@Override
		public void treeNodesRemoved(TreeModelEvent e) {}
		@Override
		public void treeStructureChanged(TreeModelEvent e) {}
	}
	
	
	private class FocusChangeListener implements TreeSelectionListener {
		@Override
		public void valueChanged(TreeSelectionEvent e) {
			TreePath newPath = e.getPath();
			if(newPath != null) {
				TaskNode newNode = (TaskNode) newPath.getLastPathComponent();
				Message m = new Message(MessageType.NEW_TASK_ACTIVE_REQUEST);
				m.addHeader("task", newNode.getTask());
				controller.receiveMessage(m);
			}
		}
	}
	
	private class TreePopupListener implements MouseListener {
		
		TreePopup tp;
		private TreeView tv;

		public TreePopupListener(TreePopup tp, TreeView tv) {
			this.tp = tp;
			this.tv = tv;
		}

		@Override
		public void mouseClicked(MouseEvent e) {
			if(SwingUtilities.isRightMouseButton(e)) {
				TaskNode tn = tv.getNodeForEvent(e);
				if(tn != null) {					
					tp.setClickedNode(tn);
					tp.show(e.getComponent(), e.getX(), e.getY());
				}
			}
		}
		
		@Override
		public void mousePressed(MouseEvent e) {}
		@Override
		public void mouseEntered(MouseEvent e) {}
		@Override
		public void mouseExited(MouseEvent e) {}
		@Override
		public void mouseReleased(MouseEvent e) {}
	}
		
	private class MyDropTargetAdapter extends DropTargetAdapter {
		@Override
		public void drop(DropTargetDropEvent evt) {
			
			Point dropLocation = evt.getLocation();
			
			TreePath selectionPath = jtree.getSelectionPath();
            TreePath sourcePath = selectionPath.getParentPath();
            TreePath targetPath = jtree.getClosestPathForLocation(dropLocation.x, dropLocation.y);
            TaskNode selectedNode = (TaskNode) selectionPath.getLastPathComponent();
            TaskNode targetParentNode = (TaskNode) targetPath.getLastPathComponent();
            TaskNode sourceParentNode = (TaskNode) sourcePath.getLastPathComponent();
            
            if (isDropAllowed(sourcePath, targetPath, selectedNode)) {
                
            	System.out.println("TreeView requesting to move " + selectedNode.getTask().getTitle() + " under " + targetParentNode.getTask().getTitle());
                Message m = new Message(MessageType.MOVE_TASK_REQUEST);
                m.addHeader("task", selectedNode.getTask());
                m.addHeader("toParent", targetParentNode.getTask());
                m.addHeader("fromParent", sourceParentNode.getTask());
                controller.receiveMessage(m);
          
//          	This is done on receiveMessage      
//              sourceParentNode.remove(selectedNode);
//              targetParentNode.add(selectedNode);
                
                evt.dropComplete(true);
                jtree.updateUI();
            } else {
            	System.out.println("drop: rejected");
                evt.rejectDrop();
                evt.dropComplete(false);
            }
		}

		private boolean isDropAllowed(TreePath sourcePath, TreePath targetPath, DefaultMutableTreeNode selectedNode) {
			Task sourceNode = getNodeForPath(sourcePath).getTask();
			Task targetNode = getNodeForPath(targetPath).getTask();
			Task movingNode = ((TaskNode)selectedNode).getTask();
			
			// Don't allow if target = movingNode
			if(targetNode.getId() == movingNode.getId()) {
				System.out.println("Not allowed to move node into itself");
				return false;
			}
			
//			// Don't allow if target = source <-- yes, do allow! makes for reordering
//			if(targetNode.getId() == sourceNode.getId()) {
//				System.out.println("Not allowed to move node into itself");
//				return false;
//			}
			
			// Don't allow if target under source
			Task foundAgain = movingNode.searchChildrenUnique(testedTask -> testedTask.getId() == targetNode.getId());
			if(foundAgain != null) {
				System.out.println("Not allowed to move node into its own subtree");
				return false;
			}
			
			return true; 
		}
	}
	
	
	//-------------------------------------------------------------//
	//-------- Methods for handling popup events ------------------//
	//-------------------------------------------------------------//
	
	public void onPopupAddSubtaskRequested(TaskNode clickedNode) {
		Message m = new Message(MessageType.ADD_SUBTASK_REQUEST);
		m.addHeader("task", clickedNode.getTask());
		System.out.println("TreeView now messaging " + m.getMessageType() + " for task "+ clickedNode.getTask().getTitle());
		controller.receiveMessage(m);
	}

	public void onPopupTaskCompleteRequested(TaskNode clickedNode) {
		Message m = new Message(MessageType.COMPLETE_TASK_REQUEST);
		m.addHeader("task", clickedNode.getTask());
		System.out.println("TreeView now messaging " + m.getMessageType() + " for task "+ clickedNode.getTask().getTitle());
		controller.receiveMessage(m);
	}

	public void onPopupDeleteTaskRequested(TaskNode clickedNode) {
		Message m = new Message(MessageType.DELETE_TASK_REQUEST);
		m.addHeader("task", clickedNode.getTask());
		System.out.println("TreeView now messaging " + m.getMessageType() + " for task "+ clickedNode.getTask().getTitle());
		controller.receiveMessage(m);
	}

	public void onPopupReactivateTaskRequested(TaskNode clickedNode) {
		Message m = new Message(MessageType.REACTIVATE_TASK_REQUEST);
		m.addHeader("task", clickedNode.getTask());
		System.out.println("TreeView now messaging " + m.getMessageType() + " for task "+ clickedNode.getTask().getTitle());
		controller.receiveMessage(m);
	}
	
	
	// wird verwendet von taskNodeRenderer
	public String getHoverText(TaskNode node) {
		String text = controller.getTaskDescription(node.getTask());
		return text;
	}
	

}