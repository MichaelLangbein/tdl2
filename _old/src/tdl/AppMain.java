package tdl;


import tdl.controller.Controller;

public class AppMain {

	public static void main(String[] args) {
		try {
			Controller c = new Controller();
			c.run();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
