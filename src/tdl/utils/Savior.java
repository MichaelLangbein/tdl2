package tdl.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInput;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;

import tdl.model.MutableTask;
import tdl2.model.Task;

public class Savior {

	public void saveTree(MutableTask baseNode, String filename) throws IOException {
		saveToFile(baseNode, filename);
	}
	
	public MutableTask loadTree(String filename) throws ClassNotFoundException, IOException {
		return loadFromFile(filename);
	}

	private MutableTask loadFromFile(String filename) throws IOException, ClassNotFoundException {
		MutableTask tree = null;
		InputStream file;
		try {
			file = new FileInputStream(filename);
		}catch(FileNotFoundException e) {
			System.out.println(filename + " not found. Creating a new empty task-tree.");
			MutableTask baseTask = new MutableTask("Base task");
			saveToFile(baseTask, filename);
			file = new FileInputStream(filename);
		}
		InputStream buffer = new BufferedInputStream(file);
		ObjectInput input = new ObjectInputStream(buffer);
		tree = (MutableTask) input.readObject();			
//			Task oldTree = (Task) input.readObject();
//			tree = translateOldTreeToNew(oldTree);
		input.close();
		checkIntegrity(tree);
		return tree;
	}

	private void saveToFile(MutableTask baseNode, String filename) throws IOException {
		OutputStream file = new FileOutputStream(filename);
		OutputStream buffer = new BufferedOutputStream(file);
		ObjectOutput output = new ObjectOutputStream(buffer);
		output.writeObject(baseNode);
		output.close();
	}

	private void checkIntegrity(MutableTask tree) {
		if(tree.getAttachments() == null) {
			tree.setAttachments(new ArrayList<File>());
		}
		for(MutableTask child : tree.getMutableChildren()) {
			checkIntegrity(child);
		}
	}
	
	private MutableTask translateOldTreeToNew(Task oldTree) {
		MutableTask tree = new MutableTask();
		
		passFieldsToNewTask(tree, oldTree);
		
		for(Task oldChild : oldTree.getChildren()) {
			MutableTask subTree = translateOldTreeToNew(oldChild);
			tree.addChild(subTree);
		}
		
		return tree;
	}

	private void passFieldsToNewTask(MutableTask tree, Task oldTree) {
		tree.setAttachments(oldTree.getAttachments());
		tree.setDeadline(oldTree.getDeadline());
		if(oldTree.isCompleted()) {
			tree.setCompleted(oldTree.getDeadline());			
		}
		tree.setDescription(oldTree.getDescription());
		tree.setTitle(oldTree.getTitle());
	}
}
