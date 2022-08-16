package tdl.plugins.bugzilla;


import java.util.Date;

import tdl.model.MutableTask;


public class BugzillaTask extends MutableTask {
	
	private static final long serialVersionUID = -5886960186175406394L;
	private BugzillaConnection bugzillaConnection;
	private int bugzillaId;
	
	public BugzillaTask(BugzillaConnection bugzillaConnection, int bugzillaId, MutableTask parent, String title) {
		super(parent, title);
		this.bugzillaConnection = bugzillaConnection;
		this.bugzillaId = bugzillaId;
	}
	
	public BugzillaTask(BugzillaConnection bugzillaConnection, int bugzillaId, String title) {
		super(title);
		this.bugzillaConnection = bugzillaConnection;
		this.bugzillaId = bugzillaId;
	}

	@Override
	public void setCompleted(Date completed) {
		bugzillaConnection.complete(bugzillaId, getDescription());
		super.setCompleted(completed);
	}
	
}
