package tdl.model;

import java.util.ArrayList;

public class WiseCracker {

	private ArrayList<String> wiseStuff;
	
	public WiseCracker() {
		wiseStuff = new ArrayList<String>();
		wiseStuff.add("We're all goofy.");
		wiseStuff.add("If you're not feeling stupid, you're not learning.");
		wiseStuff.add("Perfection is reached not when there is nothing more to add, but when there is nothing more to substract.");
		wiseStuff.add("You can easily stay focused on your task, not by power of will, but by understanding that you don't need to do any of those distracting things, and that they won't make you happy.");
		wiseStuff.add("A small skill perfected is always better than a large skill half-baked.");
		wiseStuff.add("Bad: 'Im glad its over!'. Good: 'Oh, so sad its over!'");
		wiseStuff.add("Having a technical job doesn't mean that you don't need any social skills.");
		wiseStuff.add("Explore and discover");
	}
	
	public String getWiseStuff(int i) {
		return wiseStuff.get(i);
	}
	
	public int wiseStuffCount() {
		return wiseStuff.size();
	}
}