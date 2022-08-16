package tdl.utils.network;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.Proxy;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;
import java.util.Properties;

import org.json.JSONObject;
import org.junit.Test;

import tdl.utils.localFiles.ConfigurationHelper;

public class RestUtilsTest {


	
	@Test
	public void testInternetWOProxy() throws MalformedURLException, IOException {
		
		URL url = new URL("https://www.google.com");
		
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		int respCode = connection.getResponseCode();
		
		assertTrue(respCode != 200);
	}
	
	@Test
	public void testInternet() throws MalformedURLException, IOException {
		
		URL url = new URL("https://www.google.com");
		
		Properties props = ConfigurationHelper.loadProperties();
		String proxyUrl = props.getProperty("proxy.url");
		int proxyPort = Integer.parseInt(props.getProperty("proxy.port"));
		Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyUrl, proxyPort));
		
		HttpURLConnection connection = (HttpURLConnection) url.openConnection(proxy);
		connection.setRequestMethod("GET");
		int respCode = connection.getResponseCode();
		
		assertTrue(respCode == 200);
	}
	
	@Test
	public void testExecureQuery() throws URISyntaxException, IOException {

		Properties props = ConfigurationHelper.loadProperties();
		String proxyUrl = props.getProperty("proxy.url");
		int proxyPort = Integer.parseInt(props.getProperty("proxy.port"));
		Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyUrl, proxyPort));


		URL path = new URL("http://hnd.bybn.de/bugzilla/rest/bug/35");
		HashMap<String, String> paras = new HashMap<String, String>();
		paras.put("include_fields", "summary,status,resolution");

		JSONObject response =  RestUtils.executeQuery(proxy, path, paras);
		
		assertNotNull(response);
	}
	
}
