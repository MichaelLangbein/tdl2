package tdl.utils.localFiles;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

public class ConfigurationHelper {

	public static Properties loadProperties() throws FileNotFoundException, IOException {
		//String rootPath = Thread.currentThread().getContextClassLoader().getResource("").getPath();
		String appConfigPath = "app.properties";
		Properties appProps = new Properties();
		appProps.load(new FileInputStream(appConfigPath));
		return appProps;
	}
}
