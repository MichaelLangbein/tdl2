package tdl.messages;

public enum MessageType {
	FILE_DROPPED_IN, 
	UPDATED_TASK, 

	ADD_SUBTASK_REQUEST, 
	ADDED_SUBTASK, 
	
	NEW_TASK_ACTIVE_REQUEST, 
	NEW_TASK_ACTIVE,	
	
	SAVE_TASK_REQUEST,
	
	COMPLETE_TASK_REQUEST, 
	COMPLETED_TASK,
	
	DELETE_TASK_REQUEST, 
	DELETED_TASK,
	
	REACTIVATE_TASK_REQUEST, 
	REACTIVATED_TASK, 
	
	TASK_CHANGE_TITLE_REQUEST,
	TASK_CHANGE_DEADLINE_REQUEST,
	
	DELETE_FILE_REQUEST,
	PREPARE_DELETING_TASK,
	DELETED_FILE, 
	
	MOVE_TASK_REQUEST,
	MOVED_TASK,
	
	PREPARE_WINDOW_CLOSING, 
}
