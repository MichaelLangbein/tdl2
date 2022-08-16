package tdl.model;

import java.util.ArrayList;

public class WiseCracker {

	private ArrayList<String> wiseStuff;

	public WiseCracker() {
		wiseStuff = new ArrayList<String>();
		wiseStuff.add("We're all goofy.");
		wiseStuff.add("If you're not feeling stupid, you're not learning.");
		wiseStuff.add("Perfection is reached not when there is nothing more to add, but when there is nothing more to subtract.");
		wiseStuff.add("You can easily stay focused on your task, not by power of will, but by understanding that you don't need to do any of those distracting things, and that they won't make you happy.");
		wiseStuff.add("You sometimes get distracted by things that are more interesting. If that happens, just put on a youtube-video to listen to in the background. It will draw your subconscious away from what distracted you.");
		wiseStuff.add("Resistance against a task takes up tons of energy. Instead of resisting, focus on the aspects of a task that you like.");
		wiseStuff.add("A small skill perfected is better than a large skill half-baked.");
		wiseStuff.add("Bad: 'Im glad its over!'. Good: 'Oh, so sad its over!'");
		wiseStuff.add("Having a technical job doesn't mean that you don't need any social skills.");
		wiseStuff.add("Explore and discover");
		wiseStuff.add("Nach oben hin ist Platz.");
		wiseStuff.add("Sure I can do this for you! While you're there, could you do .... ");
		wiseStuff.add("Eleminieren, automatisieren, delegieren");
		wiseStuff.add("Pausen: es gibt besseres als browsen! Hoere Musik und schreibe dem wise man. Ideal: schreibe zusammen was gerade zu tun ist, ohne es gleich zu tun.");
		wiseStuff.add("For people to like you, you should be a person that you like yourself.");
		wiseStuff.add("Programmers that get unmotivated usually suffer from simple things: not enough water, not enough sleep, not enough exercise.");
		wiseStuff.add("You know you're not the smartest man in the universe. The art is to do things with the potential that you have, however little it may be. That is not so much about brains as it is about heart.");
		wiseStuff.add("Ich bin nicht so sehr ein Informatiker als vielmehr ein Spielzeugmacher.");
		wiseStuff.add("If as a programmer you need more time, ask your client for details, example-data, use-cases, tests etc.");
		wiseStuff.add("At work, you should'nt ask yourself: what do I need to do? You should ask yourself: What can I do to add to my achievement list?");
		wiseStuff.add("You will always be dealing with legacy code. Here is how to work with it without going mental: 1. add really good, on demand logging. 2. add a repl like testenvironment 3. add unit tests when you change things");
		wiseStuff.add("Fight is better than flight.");
		wiseStuff.add("If your app depends on a db, make sure it immediately breaks when the db-structure changes. This is an overlooked advantage of orm.");
		wiseStuff.add("Selbstbewusstsein und Empathie");
		wiseStuff.add("Trag dein Zuhause in dir");
		wiseStuff.add("A person is very much defined by his surroundings. You may have a rich inner life, but if you dont expose it, others wont know about it, you miss the feedback of your ideas interacting with others, you will be forgotten when you leave.");
		wiseStuff.add("Learn to laugh at yourself in public. Teamwork is the most important part of programming. Personal failure is the most intense part of teamwork.");
		wiseStuff.add("In shared projects, avoid architecture decisions - in fact, avoid architecture as much as possible. The flatter, the better.");
		wiseStuff.add("Any time you want to procrastinate, it's because something's not right. Find out why.");
	}

	public String getWiseStuff(int i) {
		return wiseStuff.get(i);
	}

	public int wiseStuffCount() {
		return wiseStuff.size();
	}
}
