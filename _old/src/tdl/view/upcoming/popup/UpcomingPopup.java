package tdl.view.upcoming.popup;

import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;

import javax.swing.JMenuItem;
import javax.swing.JPopupMenu;

import tdl.model.Task;
import tdl.view.upcoming.UpcomingView;

@SuppressWarnings("serial")
public class UpcomingPopup extends JPopupMenu {
	
	@SuppressWarnings("unused")
	private UpcomingView view;
	private JMenuItem focusOnSubtaskItem;
	private Task clickedTask;
	
	public UpcomingPopup(UpcomingView view) {
		this.view = view;
		
		focusOnSubtaskItem = new JMenuItem("Focus on subtask");
		focusOnSubtaskItem.addMouseListener(new MouseListener() {
			@Override
			public void mousePressed(MouseEvent e) {
				view.onPopupSetActiveRequested(clickedTask);
			}
			@Override
			public void mouseReleased(MouseEvent e) {}
			@Override
			public void mouseExited(MouseEvent e) {}
			@Override
			public void mouseEntered(MouseEvent e) {}
			@Override
			public void mouseClicked(MouseEvent e) {}
		});
		add(focusOnSubtaskItem);
		
	}

	public void setClickedTask(Task t) {
		this.clickedTask = t;
	}
}
