package tdl.utils.localFiles;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;

public class ResourceManager {

	private File resourceDir;
	
	public ResourceManager() {
		resourceDir = new File("resources");
		if(! resourceDir.exists() ) {
			System.out.println("Resources nicht gefunden. Ordner wird erzeugt.");
			resourceDir.mkdir();
		}
	}
	
	public File getResourceDir() {
		return resourceDir;
	}

	/**
	 * Not only saves file, but also prepends a timestamp to the name to avoid overwrite on duplicate.
	 * 
	 * @param sourceFile
	 * @return
	 * @throws IOException
	 */
	public File saveToResources(File sourceFile) throws IOException {
		String timeStamp = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss.SSS").format(new java.util.Date());
		File savedFile = new File(resourceDir, timeStamp + "_" + sourceFile.getName());
		copyFileUsingStream(sourceFile, savedFile);
		return savedFile;
	}

	public void deleteFileFromResources(File file) {
		file.delete();
	}
	
	private void copyFileUsingStream(File source, File dest) throws IOException {
	    InputStream is = null;
	    OutputStream os = null;
	    try {
	        is = new FileInputStream(source);
	        os = new FileOutputStream(dest);
	        byte[] buffer = new byte[1024];
	        int length;
	        while ((length = is.read(buffer)) > 0) {
	            os.write(buffer, 0, length);
	        }
	    } finally {
	        is.close();
	        os.close();
	    }
	}
	
}
