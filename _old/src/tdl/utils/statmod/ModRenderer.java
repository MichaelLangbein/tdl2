package tdl.utils.statmod;

import javax.swing.JPanel;

import tdl.model.Task;

public interface ModRenderer {
	public JPanel render();
	public String describeTask(Task task);
}
