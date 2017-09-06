package tdl2.controller.detailcontroller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import tdl2.controller.Controller;
import tdl2.utils.FileDrop.Listener;

public class MyAttachmentListener implements Listener {

	private Controller controller;

	public MyAttachmentListener(Controller controller) {
		this.controller = controller;
	}

	@Override
	public void filesDropped(File[] files) {
		ArrayList<File> savedFiles = new ArrayList<File>();
		for(int i = 0; i < files.length; i++) {
			File savedFile = null;
			try {
				savedFile = controller.getResourceManager().saveToResources(files[i]);
			} catch (IOException e) {
				e.printStackTrace();
			}
			savedFiles.add(savedFile);
		}
		controller.getTreeView().getCurrentNode().getTask().addAttachments(savedFiles);
		controller.getDetailView().getAttachmentView().refresh();
	}

}