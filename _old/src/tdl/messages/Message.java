package tdl.messages;

import java.util.HashMap;

public class Message {

	private MessageType messageType;
	private HashMap<String,Object> headers;
	
	public Message(MessageType messageType) {
		this.messageType = messageType;
		this.headers = new HashMap<String, Object>();
	}
	
	public HashMap<String,Object> getHeaders() {
		return headers;
	}
	
	public void addHeader(String key,  Object val) {
		headers.put(key, val);
	}
	
	public MessageType getMessageType() {
		return messageType;
	}
}
