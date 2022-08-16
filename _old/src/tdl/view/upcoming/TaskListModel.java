package tdl.view.upcoming;


import java.io.File;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.regex.Pattern;

import javax.swing.AbstractListModel;

import tdl.model.Task;

@SuppressWarnings("serial")
public class TaskListModel extends AbstractListModel<Task> {
	
	private Task[] tasks;

	public TaskListModel(Task baseTask) {
		Task[] tasks = getDateSortedTasks(baseTask);
		this.tasks = tasks;
		
	}

	private Task[] getDateSortedTasks(Task baseTask) {
		ArrayList<Task> tasksList = treeToArray(baseTask);
		ArrayList<Task> tasksSorted = sort(tasksList);
		//ArrayList<Task> tasksSortedFiltered = filter(tasksSorted);
		Task[] tasksSortedArray = tasksSorted.toArray(new Task[tasksSorted.size()]);
		return tasksSortedArray;
	}
	


	private ArrayList<Task> filter(ArrayList<Task> tasksSorted) {
		ArrayList<Task> filtered = new ArrayList<Task>();
		for(Task t : tasksSorted) {
			if((!t.isCompleted()) && (t.getDeadline() != null) ) {
				filtered.add(t);
			}
		}
		return filtered;
	}

	private ArrayList<Task> sort(ArrayList<Task> tasksList) {
		tasksList.sort(new Comparator<Task>() {
			@Override
			public int compare(Task t1, Task t2) {
				Date date1 = null;
				Date date2 = null;
				
				if(t1.isCompleted()) {
					date1 = t1.getCompleted();
				}else {
					date1 = t1.getDeadline();
				}
				
				if(t2.isCompleted()) {
					date2 = t2.getCompleted();
				}else {
					date2 = t2.getDeadline();
				}
				
				if(date1 != null && date2 == null) return 1;
				if(date1 == null && date2 != null) return -1;
				if(date1 == null && date2 == null) return 0;
				else return date1.compareTo(date2);
			}
		});
		return tasksList;
	}

	private ArrayList<Task> treeToArray(Task task) {
		ArrayList<Task> tasks = new ArrayList<Task>();
		tasks.add(task);
		for(Task child : task.getChildren()) {
			tasks.addAll(treeToArray(child));
		}
		return tasks;
	}

	@Override
	public Task getElementAt(int index) {
		return tasks[index];
	}

	@Override
	public int getSize() {
		return tasks.length;
	}

	public void setData(Task baseTask) {
		this.tasks = getDateSortedTasks(baseTask);
		fireContentsChanged(this, 0, tasks.length);
	}
	
	public void filterTasksByText(String searchedText) {
		
		ArrayList<Task> newTasks = new ArrayList<Task>();
		
		String[] searchWords = searchedText.split(";");
		for(String searchWord : searchWords) {
			
			Pattern regex = Pattern.compile(Pattern.quote(searchWord), Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);	
			for(Task task : this.tasks) {
				
				String title = task.getTitle();
				String body = task.getDescription();
				if( regex.matcher(title).find() || regex.matcher(body).find() ) {
					newTasks.add(task);
				} else {
					ArrayList<File> attachments = task.getAttachments();
					for(File attachment : attachments) {
						if( regex.matcher( attachment.getName() ).find() ) {
							newTasks.add(task);
							break;
						}
					}
				}
				
			}
			
		}
		
		Task[] tasks = newTasks.toArray(new Task[0]);
		this.tasks = tasks;
	}

	public void refreshView() {
		fireContentsChanged(this, 0, tasks.length);
	}
}
