package tdl.plugins.bugzilla;

import org.json.JSONObject;
import org.junit.Test;

import tdl.model.Task;
import tdl.utils.localFiles.ConfigurationHelper;
import tdl.utils.network.RestThread;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.Proxy;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Properties;



public class BugzillaConnectionTest {
	
	
	
	@Test
	public void authenticateGetTokenTest() throws FileNotFoundException, IOException, URISyntaxException {
		
		Properties props = ConfigurationHelper.loadProperties();
		BugzillaConnection conn = new BugzillaConnection(
				null, 
				props.getProperty("bugzilla.url"), 
				props.getProperty("bugzilla.user"), 
				props.getProperty("bugzilla.password"), 
				props.getProperty("proxy.url"), 
				Integer.parseInt(props.getProperty("proxy.port")) 
		);
		
		String token = conn.authenticateGetToken(props.getProperty("bugzilla.user"), props.getProperty("bugzilla.password"));
		System.out.println("Token is " + token);
		assertNotNull(token);
	}
	

	@Test
	public void getTasksTest() throws URISyntaxException, IOException {
		
		Properties props = ConfigurationHelper.loadProperties();
		BugzillaConnection conn = new BugzillaConnection(
				null, 
				props.getProperty("bugzilla.url"), 
				props.getProperty("bugzilla.user"), 
				props.getProperty("bugzilla.password"), 
				props.getProperty("proxy.url"), 
				Integer.parseInt(props.getProperty("proxy.port")) 
		);
		// TODO
		//ArrayList<Task> tasks = conn.getTasks();
		//assertNotNull(tasks);
	}
}
