package tdl.utils.network;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.Proxy;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;

import org.apache.http.client.utils.URIBuilder;
import org.json.JSONObject;

public class RestUtils {

	public static JSONObject executeQuery(Proxy proxy, URL path, HashMap<String, String> paras) throws URISyntaxException, IOException {
		
		// Create URI from parameters
		URIBuilder ub = new URIBuilder(path.toString());
		for(String key : paras.keySet()) {
			String value = paras.get(key);
			ub.addParameter(key, value);
		}
		String urlString = ub.build().toString();
		
		// get String by execureGet
		System.out.println("Now executing Query: " + urlString);
		JSONObject jo = executeJsonRestCall(urlString, proxy);
		
		return jo;
	}
	
	public static JSONObject executeJsonRestCall(String requestString, Proxy proxy) throws IOException {

		URL url = new URL(requestString);
		HttpURLConnection connection = (HttpURLConnection) url.openConnection(proxy);
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("Accept", "application/json");
		
		int respCode = connection.getResponseCode();
		if(respCode != 200) throw new IOException("Kein gültiger Aufruf! ResponseCode = " + respCode);
		
		BufferedReader br = new BufferedReader(new InputStreamReader((connection.getInputStream())));
		StringBuilder sb = new StringBuilder();
		String output;
		while ((output = br.readLine()) != null) {
			sb.append(output);
		}
		
		JSONObject jo = new JSONObject(sb.toString());
		
		return jo;
	}
	
	
	/**
	 * @param requestString
	 * @return
	 * @throws IOException 
	 */
	public static String executeGet(String requestString, Proxy proxy) throws IOException {

		URL url = new URL(requestString);
		HttpURLConnection connection = (HttpURLConnection) url.openConnection(proxy);
		connection.setRequestMethod("GET");
		int respCode = connection.getResponseCode();
		if(respCode != 200) throw new IOException("Kein gültiger Aufruf! ResponseCode = " + respCode);
		
		BufferedReader br = new BufferedReader(new InputStreamReader((connection.getInputStream())));
		StringBuilder sb = new StringBuilder();
		String output;
		while ((output = br.readLine()) != null) {
			sb.append(output);
		}
		return sb.toString();
		
	}
	
	
}
