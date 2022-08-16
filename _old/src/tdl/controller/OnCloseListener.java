package tdl.controller;

import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

import tdl.messages.Message;
import tdl.messages.MessageType;

public class OnCloseListener extends WindowAdapter {
	
	private Controller controller;

	public OnCloseListener(Controller controller) {
		this.controller = controller;
	}
	
	@Override
	public void windowClosing(WindowEvent e) {
		Message m = new Message(MessageType.PREPARE_WINDOW_CLOSING);
		controller.receiveMessage(m);
		super.windowClosing(e);
	}
}
