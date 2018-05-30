package tdl.utils.network;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.Proxy;
import java.net.URL;
import java.util.HashMap;
import java.util.Properties;
import java.util.function.Consumer;

import javax.naming.TimeLimitExceededException;

import org.json.JSONObject;
import org.junit.Test;

import tdl.plugins.bugzilla.BugzillaConnection;
import tdl.utils.localFiles.ConfigurationHelper;

public class RestThreadTest {
	
	private class Recipient implements RestRecipient {
		private JSONObject response;
		
		@Override
		public void handleRestResponse(JSONObject jo) {
			response = jo;
		}
		
		public JSONObject getResponse() {
			return response;
		}
		
	}

	
	@Test
	public void testThreadedRequest() throws FileNotFoundException, IOException, TimeLimitExceededException, InterruptedException {
		
		Properties props = ConfigurationHelper.loadProperties();
		
		String proxyUrl = props.getProperty("proxy.url");
		int proxyPort = Integer.parseInt(props.getProperty("proxy.port"));
		
		RestThread rt = new RestThread();
		rt.setProxy(proxyUrl, proxyPort);
		rt.startRestThread();
		
	
		URL path = new URL("http://hnd.bybn.de/bugzilla/rest/bug/35");
		HashMap<String, String> paras = new HashMap<String, String>();
		paras.put("include_fields", "summary,status,resolution");
		Recipient recipient = new Recipient();
		
		rt.enqueueQuery(path, paras, recipient);
		Thread.sleep(3000);
		
		assertNotNull(recipient.getResponse());
		
		
		rt.killRestThread();
	}
}
