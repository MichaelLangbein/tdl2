package tdl.view.upcoming.popup;

import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;

import javax.swing.SwingUtilities;

import tdl.model.Task;
import tdl.view.upcoming.UpcomingView;


public class UpcomingPopupListener implements MouseListener {
	
	private UpcomingPopup up;
	private UpcomingView uv;

	public UpcomingPopupListener(UpcomingPopup up, UpcomingView uv) {
		this.up = up;
		this.uv = uv;
	}

	@Override
	public void mouseClicked(MouseEvent e) {
		if(SwingUtilities.isRightMouseButton(e)) {
			Task t = uv.getTaskForEvent(e);
			up.setClickedTask(t);
			up.show(e.getComponent(), e.getX(), e.getY());
		}
	}

	@Override
	public void mousePressed(MouseEvent e) {}
	@Override
	public void mouseEntered(MouseEvent e) {}
	@Override
	public void mouseExited(MouseEvent e) {}
	@Override
	public void mouseReleased(MouseEvent e) {}
}
