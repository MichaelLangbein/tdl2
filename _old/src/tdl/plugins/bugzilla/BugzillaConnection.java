package tdl.plugins.bugzilla;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.Proxy;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;

import javax.naming.TimeLimitExceededException;

import org.apache.http.client.utils.URIBuilder;
import org.json.JSONArray;
import org.json.JSONObject;

import tdl.controller.Controller;
import tdl.messages.Message;
import tdl.messages.MessageType;
import tdl.model.Task;
import tdl.utils.network.RestRecipient;
import tdl.utils.network.RestThread;
import tdl.utils.network.RestUtils;



/**
 * 
 * Originally intended to have this class use the RestThread to do the Internet-Stuff in 
 * a separate thread. BUT: the problem is not the time one get/bugs query takes, 
 * but the fact that for every but we need to also call get/big/<nr>/comments.
 * This would not have been mitigated by using RestThread. Instead, we'll make 
 * this connection its own thread, having it execute getTasksAsync in another thread. 
 * 
 * https://wiki.mozilla.org/Bugzilla:REST_API
 *
 */

public class BugzillaConnection extends Thread {

	private URL bugzillaUrl;
	private String userEmail;
	private String userPassword;
	private String token;
	private Proxy proxy;
	private Controller controller;

	
	/**
	 * Our access client to the bugzilla rest-api.
	 * 
	 * @param restThread 
	 * @param controller 
	 * 
	 * @param bugzillaUrl
	 * @param userEmail
	 * @param userPassword
	 * @throws IOException 
	 * @throws URISyntaxException 
	 */
	public BugzillaConnection(	Controller controller,  
								String bugzillaUrl, String userEmail, String userPassword, 
								String proxyUrl, int proxyPort) throws URISyntaxException, IOException {
		
		
		this.controller = controller;
		this.bugzillaUrl = new URL(bugzillaUrl);
		this.userEmail = userEmail;
		this.userPassword = userPassword;
		this.proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyUrl, proxyPort));
		this.token = authenticateGetToken(userEmail, userPassword);
		
	}
	
	
	public String authenticateGetToken(String userMail, String userPassword) throws URISyntaxException, IOException {
		URL path = new URL(bugzillaUrl.toString() + "/rest/login");
		HashMap<String, String> paras = new HashMap<String, String>();
		paras.put("login", userMail);
		paras.put("password", userPassword);
		JSONObject response = RestUtils.executeQuery(proxy, path, paras);
		String token = response.getString("token");
		return token;
	}
	

	/**
	 * Let bugzilla know that we have completed a task.
	 * http://bugzilla.readthedocs.io/en/latest/api/core/v1/bug.html#update-bug
	 * 
	 * @param bugzillaId
	 * @param description
	 */
	public void complete(int bugzillaId, String description) {
		// TODO Auto-generated method stub
		
	}
	

	/**
	 * TODO: better to call RestThread from this method. There are so many tasks it makes 
	 * little sense to fetch them all at once. 
	 * 
	 * @param baseTask
	 * @throws IOException 
	 * @throws URISyntaxException 
	 * @throws InterruptedException 
	 * @throws TimeLimitExceededException 
	 */
	public void getTasksAsync() throws URISyntaxException, IOException, TimeLimitExceededException, InterruptedException {
		
		URL path = new URL(bugzillaUrl.toString() + "/rest/bug");
		HashMap<String, String> paras = new HashMap<String, String>();
		paras.put("assigned_to", userEmail);

		// TODO
		
		
		
	}
	
	
	public Task getTask(int bugzillaId) throws URISyntaxException, IOException {
		
		URL path = new URL(bugzillaUrl.toString() +  "/rest/bug/" + bugzillaId);
		HashMap<String, String> paras = new HashMap<String, String>();
		JSONObject response = RestUtils.executeQuery(proxy, path, paras);
		
		JSONObject bug = response.getJSONArray("bugs").getJSONObject(0);
		int id = bug.getInt("id");
		String title = bug.getString("summary");
		BugzillaTask bt = new BugzillaTask(this, id, title);
		
		JSONArray comments = getComments(bugzillaId);
		String description = "";
		for(int i = 0; i < comments.length(); i++) {
			description += comments.getJSONObject(i).getString("text") + "\n";
		}
		bt.setDescription(description);
		
		return bt;
	}
	
	public JSONArray getComments(int bugzillaId) throws URISyntaxException, IOException {
		
		URL path = new URL(bugzillaUrl.toString() + "/rest/bug/" + bugzillaId + "/comment");
		HashMap<String, String> paras = new HashMap<String, String>();
		JSONObject response = RestUtils.executeQuery(proxy, path, paras);
		JSONArray comments = response.getJSONObject("bugs").getJSONObject("" + bugzillaId).getJSONArray("comments");
		
		return comments;
	}


	


}
