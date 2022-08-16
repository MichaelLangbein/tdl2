package tdl.view.details.attachments.popup;

import java.awt.Component;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.io.File;

import javax.swing.SwingUtilities;

import tdl.view.details.attachments.AttachmentView;



public class AttachmentPopupListener implements MouseListener {

	private AttachmentPopup popup;
	private AttachmentView av;
	
	public AttachmentPopupListener(AttachmentPopup ap, AttachmentView av) {
		popup = ap;
		this.av = av;
	}

	@Override
	public void mouseClicked(MouseEvent e) {
		if(SwingUtilities.isRightMouseButton(e)) {
			File file = av.getFileForEvent(e);
			popup.setClickedFile(file);
			Component list = e.getComponent();
			popup.show(list, e.getX(), e.getY());
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
