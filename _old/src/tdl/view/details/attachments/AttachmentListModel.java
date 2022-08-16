package tdl.view.details.attachments;

import java.io.File;
import java.util.ArrayList;

import javax.swing.DefaultListModel;


@SuppressWarnings("serial")
public class AttachmentListModel extends DefaultListModel<File> {
	
	private ArrayList<File> files;

	public AttachmentListModel(ArrayList<File> files) {	
		this.files = files;
	}

	@Override
	public File getElementAt(int index) {
		return files.get(index);
	}

	@Override
	public int getSize() {
		return files.size();
	}
	
	public void setData(ArrayList<File> newfiles) {
		if(newfiles != null) {			
			this.files = newfiles;
			refresh();
		} 
	}
	
	public void refresh() {
		if(files.size() > 0) {			
			fireContentsChanged(this, 0, files.size());
		}else {
			fireIntervalRemoved(this, 0, 0);
		}
	}

	
}