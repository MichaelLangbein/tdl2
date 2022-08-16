package tdl.model;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.UUID;
import java.util.function.Predicate;

public interface Task {

	public Task getParent();
	
	public ArrayList<Task> getChildren();

	public UUID getId();

	public String getTitle();

	public String getDescription();

	public boolean isCompleted();
	
	public Date getCreated();
	
	public Date getCompleted();

	public Date getDeadline();

	public ArrayList<File> getAttachments();

	public ArrayList<File> getAttachmentsInclParents();
	
	public long getSecondsActive();

	public long getSecondsActiveRecursive();

	public String printTree();
	
	public ArrayList<Task> searchChildren(Predicate<Task> pred);
	
	public Task searchChildrenUnique(Predicate<Task> pred);
	
	public int getChildCount();
	
	public int getChildCountRecursive();
	
	public int getHeight();
	
	public int getDepth();

	public boolean wasActiveDuring(Date from, Date to);

	public ArrayList<TimeSpan> getActivity();
}
