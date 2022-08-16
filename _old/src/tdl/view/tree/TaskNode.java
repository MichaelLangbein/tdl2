package tdl.view.tree;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;

import javax.swing.tree.DefaultMutableTreeNode;

import tdl.model.Task;

@SuppressWarnings("serial")
public class TaskNode extends DefaultMutableTreeNode {
	
	private Task task;

	public TaskNode(Task task) {
		super(task.getTitle());
		this.task = task;
		for(Task subtask : task.getChildren()) {
			TaskNode jsubtask = new TaskNode(subtask);
			this.add(jsubtask);
		}
	}
	
//	@Override <--- DO NOT override this!!!!!
//	public String toString() {
//		return task.getTitle();
//	}

	public Task getTask() {
		return task;
	}

	public String getTaskDescription() {
		return task.getDescription();
	}
	
	public Date getDeadline() {
		return task.getDeadline();
	}

	public ArrayList<File> getAttachmentList() {
		return task.getAttachments();
	}

	public TaskNode search(Task searchedTask) {
		TaskNode foundNode = null;
		if(this.task == searchedTask) {
			foundNode = this;
		} else {
			for(int i = 0; i < this.getChildCount(); i++) {
				TaskNode child = (TaskNode) this.getChildAt(i);
				TaskNode result = child.search(searchedTask);
				if(result != null) {
					foundNode = result;
					break;
				}
			}
		}
		return foundNode;
	}
}
