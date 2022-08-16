package tdl.controller;

import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Properties;
import java.util.UUID;

import javax.naming.TimeLimitExceededException;
import javax.swing.JFrame;

import tdl.model.MutableTask;
import tdl.model.Task;
import tdl.model.TimeSpan;
import tdl.plugins.bugzilla.BugzillaConnection;
import tdl.utils.localFiles.ConfigurationHelper;
import tdl.utils.localFiles.ResourceManager;
import tdl.utils.localFiles.Savior;
import tdl.utils.network.RestThread;
import tdl.utils.scheduler.ScheduleItem;
import tdl.utils.scheduler.Scheduler;
import tdl.utils.statmod.ModRenderer;
import tdl.utils.statmod.StatMod;
import tdl.utils.statmod.MeanBottomUpVariableStructure.Buvs;
import tdl.utils.statmod.TopDownStaticStructure.Tdss;
import tdl.utils.statmod.WeightedBottomUpVariableStructure.WBuvs;
import tdl.utils.statmod.ensemble.Ensemble;
import tdl.utils.statmod.ensemble.EnsembleRenderer;
import tdl.messages.Message;
import tdl.messages.MessageType;
import tdl.messages.MessageRecipient;
import tdl.view.overal.OveralView;
import tdl.view.stats.StatsView;
import tdl.view.calendar.CalendarView;
import tdl.view.details.DetailView;
import tdl.view.tree.TreeView;
import tdl.view.upcoming.UpcomingView;
import tdl.view.wisecrack.WiseCrackerView;


public class Controller implements MessageRecipient {

	// Configuration
	private Properties props;
	
	// Model
	private MutableTask baseTask;
	// Model - State
	private MutableTask currentTask;
	private TimeSpan currentTimeSpan;
	private BugzillaConnection bugzillaConnection;
	
	// Utilities
	private PrintStream logFile;
	private ResourceManager resourceManager;
	private Savior savior;

	// StatMod
	private StatMod statMod;
	private ModRenderer statModRenderer;
	private Scheduler scheduler;
	
	// Views
	private TreeView treeView;
	private UpcomingView upcomingView;
	private CalendarView calendarView;
	private DetailView detailView;
	private WiseCrackerView wiseCrackView;
	private OveralView overalView;
	private StatsView statsView;

	
	
	public Controller() throws ClassNotFoundException, IOException, NumberFormatException, URISyntaxException {
		props = ConfigurationHelper.loadProperties();
		
		// Utilities
		logFile = new PrintStream(props.getProperty("tdl.logfile", "sessionLog.txt"));
		//System.setOut(logFile);
		resourceManager = new ResourceManager();
		savior = new Savior();

		
		// Model
		baseTask = savior.loadTree(props.getProperty("tdl.savefile", "mytree.bin"));
		currentTask = baseTask;
		currentTimeSpan = new TimeSpan(new Date());
//		bugzillaConnection = new BugzillaConnection(
//				this,
//				props.getProperty("bugzilla.url"), 
//				props.getProperty("bugzilla.user"), 
//				props.getProperty("bugzilla.password"), 
//				props.getProperty("proxy.url"), 
//				Integer.parseInt(props.getProperty("proxy.port")) 
//		);
		// TODO: bugzillaConnection.getTasksAsync();


		// StatMods
		ArrayList<StatMod> models = new ArrayList<StatMod>();
		models.add(new Buvs());
		models.add(new WBuvs());
		models.add(new Tdss());
		statMod = new Ensemble(models);
		statMod.calculateModelParameters(baseTask);
		statModRenderer = new EnsembleRenderer((Ensemble) statMod);
		scheduler = new Scheduler(statMod, this);
		
		// Views
		treeView = new TreeView(this);
		upcomingView = new UpcomingView(this);
		calendarView = new CalendarView(this);
		detailView = new DetailView(this);
		statsView = new StatsView(this, statModRenderer);
		overalView = new OveralView("My Todo-List", treeView, detailView, upcomingView, calendarView, statsView);
		overalView.setOnCloseListener(new OnCloseListener(this));
		wiseCrackView = new WiseCrackerView(overalView.getJFrame());
	}

	public void run() {
		JFrame f = overalView.getJFrame();
		f.setVisible(true);
	}
	
	public Task getBaseTask() {
		return (Task) baseTask;
	}
	
	public Task getCurrentTask() {
		return (Task) currentTask;
	}
	
	public String getTaskDescription(Task t) {
		return statModRenderer.describeTask(t);
	}
	
	public ArrayList<ScheduleItem> getSchedule() {
		System.out.println("Controller now calling scheduler");
		return scheduler.makeSchedule(baseTask);
	}
	
	

	@Override
	public void receiveMessage(Message message) {
		System.out.println("Controller received " + message.getMessageType());
		switch(message.getMessageType()) {
		case FILE_DROPPED_IN:
			addFileToTask(message);
			break;
		case NEW_TASK_ACTIVE_REQUEST:
			changeCurrentTask(message);
			break;
		case ADD_SUBTASK_REQUEST:
			addSubtask(message);
			break;
		case COMPLETE_TASK_REQUEST:
			completeTask(message);
			break;
		case DELETE_TASK_REQUEST:
			deleteTask(message);
			break;
		case REACTIVATE_TASK_REQUEST:
			reactivateTask(message);
			break;
		case DELETE_FILE_REQUEST:
			deleteFile(message);
			break;
		case PREPARE_WINDOW_CLOSING:
			prepareWindowClosing(message);
			break;
		case TASK_CHANGE_TITLE_REQUEST:
			changeTitle(message);
			break;
		case TASK_CHANGE_DEADLINE_REQUEST:
			changeDeadline(message);
			break;
		case MOVE_TASK_REQUEST:
			moveTask(message);
			break;
		case SAVE_TASK_REQUEST:
			// TODO;
			break;
		default:
			break;
		}
	}


	private void moveTask(Message message) {
		Task task = (Task) message.getHeaders().get("task");
		Task oldParent = (Task) message.getHeaders().get("fromParent");
		Task newParent = (Task) message.getHeaders().get("toParent");
		
		saveDetailsToTask();
		
		MutableTask mtask = fetchMutableTask(task);
		MutableTask moldParent = fetchMutableTask(oldParent);
		MutableTask mnewParent = fetchMutableTask(newParent);
		
		System.out.println("Controller now moving " + task.getTitle() + " from " + oldParent.getTitle() + " to " + newParent.getTitle());
		moldParent.deleteChild(mtask);
		mnewParent.addChild(mtask);

		statMod.calculateModelParameters(baseTask);
		
		Message response = new Message(MessageType.MOVED_TASK);
		response.addHeader("task", (Task) mtask);
		response.addHeader("fromParent", (Task) moldParent);
		response.addHeader("toParent", (Task) mnewParent);
		broadcast(response);
	}

	private void changeTitle(Message message) {
		Task t = (Task) message.getHeaders().get("task");
		MutableTask mt = fetchMutableTask(t); 
		String title = (String) message.getHeaders().get("title");
		mt.setTitle(title);
		
		saveDetailsToTask();
		
		Message response = new Message(MessageType.UPDATED_TASK);
		response.addHeader("task", (Task) mt);
		broadcast(response);
	}
	

	private void changeDeadline(Message message) {
		Task t = (Task) message.getHeaders().get("task");
		MutableTask mt = fetchMutableTask(t);
		Date newDeadline = (Date) message.getHeaders().get("deadline");
		mt.setDeadline(newDeadline);
		
		saveDetailsToTask();
		
		Message response = new Message(MessageType.UPDATED_TASK);
		response.addHeader("task", (Task) mt);
		broadcast(response);
	}

	private void deleteFile(Message message) {
		File f = (File) message.getHeaders().get("file");
		Task t = (Task) message.getHeaders().get("task");
		String title = t.getTitle();
		MutableTask task = fetchMutableTask(t);
		task.deleteAttachment(f);
		Message response = new Message(MessageType.DELETED_FILE);
		response.addHeader("task", t);
		System.out.println("Controller deleted file " +title+ " from task " + t.getTitle());
		broadcast(response);
	}

	private void reactivateTask(Message message) {
		MutableTask task = fetchMutableTask((Task) message.getHeaders().get("task"));
		task.setCompleted(null);
		
		statMod.calculateModelParameters(baseTask);
		
		Message response = new Message(MessageType.REACTIVATED_TASK);
		response.addHeader("task", (Task) task);
		System.out.println("Controller reactivated task " +task.getTitle());
		broadcast(response);
	}

	private void deleteTask(Message message) {
		
		MutableTask taskToDelete = (MutableTask) message.getHeaders().get("task");
		MutableTask parent = fetchMutableTask(taskToDelete.getParent());

		// Give everyone a change to prepare
		Message response1 = new Message(MessageType.PREPARE_DELETING_TASK);
		response1.addHeader("task", (Task) taskToDelete);
		broadcast(response1);
		
		// Set parent active instead of soon-to-be deleted node
		Message response2 = new Message(MessageType.NEW_TASK_ACTIVE_REQUEST);
		response2.addHeader("task", (Task) parent);
		changeCurrentTask(response2);
		
		// Delete node
		UUID id = taskToDelete.getId();
		String title = taskToDelete.getTitle();
		parent.deleteChild(taskToDelete);

		// Tell everyone that node was deleted
		Message response3 = new Message(MessageType.DELETED_TASK);
		response3.addHeader("taskId", id);
		System.out.println("Controller deleted task " + title);
		broadcast(response3);
	}

	private void completeTask(Message message) {
		saveDetailsToTask();
		
		MutableTask task = fetchMutableTask((Task) message.getHeaders().get("task"));
		currentTimeSpan.complete();
		try {
			task.appendActivity(currentTimeSpan);
		} catch (Exception e) {
			e.printStackTrace();
		}
		task.setCompletedRecursive(new Date());
		currentTimeSpan = new TimeSpan(new Date());
		
		saveDetailsToTask();
		statMod.calculateModelParameters(baseTask);
		
		Message response = new Message(MessageType.COMPLETED_TASK);
		response.addHeader("task", (Task) task);
		System.out.println("Controller completed task " +task.getTitle());
		broadcast(response);
		
		Message internalMessage = new Message(MessageType.NEW_TASK_ACTIVE_REQUEST);
		internalMessage.addHeader("task", (Task) task.getParent());
		changeCurrentTask(internalMessage);
	}

	private void addSubtask(Message message) {
		saveDetailsToTask();
		
		MutableTask parent = fetchMutableTask((Task) message.getHeaders().get("task"));
		MutableTask child = new MutableTask(parent, "new task");

		statMod.calculateModelParameters(baseTask);
		
		Message response = new Message(MessageType.ADDED_SUBTASK);
		response.addHeader("child", child);
		response.addHeader("parent", parent);
		System.out.println("Controller added child " +child.getTitle()+ " to parent " + parent.getTitle());
		broadcast(response);
		
		Message internalMessage = new Message(MessageType.NEW_TASK_ACTIVE_REQUEST);
		internalMessage.addHeader("task", (Task) child);
		changeCurrentTask(internalMessage);
	}

	private void changeCurrentTask(Message message) {
		MutableTask newCurrentTask = fetchMutableTask((Task) message.getHeaders().get("task"));
		
		if(newCurrentTask == currentTask) {
			System.out.println("Controller does not change active task, because current and new active tasks are the same: " + currentTask.getTitle());
			return; 
		}
		
		System.out.println("Controller changing active task from " + currentTask.getTitle() + " to " + newCurrentTask.getTitle());
		
		currentTimeSpan.complete();
		try {
			currentTask.appendActivity(currentTimeSpan);
		} catch (Exception e) {
			e.printStackTrace();
		}
		currentTimeSpan = new TimeSpan(new Date());
		
		saveDetailsToTask();
		currentTask = newCurrentTask;
		
		Message response = new Message(MessageType.NEW_TASK_ACTIVE);
		response.addHeader("task", (Task) newCurrentTask);
		broadcast(response);
	}
	
	// This is an unfortunate special case, where the controller has to go out to the view and fetch the changes.
	private void saveDetailsToTask() {
		System.out.println("Controller fetches and saves details to task " + currentTask.getTitle() + ": " + detailView.getDescription());
		currentTask.setDescription( detailView.getDescription() );
	}

	private void addFileToTask(Message message) {
		saveDetailsToTask();
		
		HashMap<String, Object> headers = message.getHeaders();
		File f = (File) headers.get("file");
		Task t = (Task) headers.get("task");
		MutableTask mt = fetchMutableTask(t);	
		
		File savedFile = null;
		try {
			savedFile = resourceManager.saveToResources(f);
		} catch (IOException e) {
			e.printStackTrace();
		}
		mt.addAttachment(savedFile);
		
		Message response = new Message(MessageType.UPDATED_TASK);
		response.addHeader("task", t);
		System.out.println("Controller added file " +f.getName() +" to task " +t.getTitle());
		broadcast(response);
	}

	private void broadcast(Message message) {
		System.out.println("Controller now broadcasting "+ message.getMessageType());
		treeView.receiveMessage(message);
		upcomingView.receiveMessage(message);
		detailView.receiveMessage(message);
		wiseCrackView.receiveMessage(message);
		calendarView.receiveMessage(message);
		statsView.receiveMessage(message);
	}

	private MutableTask fetchMutableTask(Task t) {
		Task foundTask = baseTask.searchChildrenUnique(testedTask -> testedTask.getId() == t.getId());
		return (MutableTask) foundTask;
	}
	
	
	private void prepareWindowClosing(Message message) {
		System.out.println("Controller is saving data before shutdown.");
		currentTimeSpan.complete();
		try {
			currentTask.appendActivity(currentTimeSpan);
		} catch (Exception e) {
			e.printStackTrace();
		}
		saveDetailsToTask();
		saveModelToFile();
		logFile.close();
	}

	private void saveModelToFile() {
		try {
			savior.saveTree(baseTask, props.getProperty("tdl.savefile", "mytree.bin"));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}


	private void addNewTasksToBugzillaTree(ArrayList<Task> newBugzillaTasks) {
		// TODO Auto-generated method stub
		
	}
	
}
