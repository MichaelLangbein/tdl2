package tdl.utils.scheduler;

import java.util.Date;

import tdl.model.Task;

public class ScheduleItem {

	private Date from;
	private Date to;
	private Task task;
	
	public ScheduleItem(Date from, Date to, Task task) {
		this.from = from;
		this.to = to;
		this.task = task;
	}
	
	public Date getFrom() {
		return from;
	}
	public void setFrom(Date from) {
		this.from = from;
	}
	public Date getTo() {
		return to;
	}
	public void setTo(Date to) {
		this.to = to;
	}
	public Task getTask() {
		return task;
	}
	public void setTask(Task task) {
		this.task = task;
	}
	
	
}
