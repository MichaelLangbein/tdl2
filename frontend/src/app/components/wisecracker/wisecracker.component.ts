import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-wisecracker',
  templateUrl: './wisecracker.component.html',
  styleUrls: ['./wisecracker.component.css']
})
export class WisecrackerComponent implements OnInit {

  public wiseThings = [
    "We're all goofy.",
		"If you're not feeling stupid, you're not learning.",
		"Perfection is reached not when there is nothing more to add, but when there is nothing more to subtract.",
		"You can easily stay focused on your task, not by power of will, but by understanding that you don't need to do any of those distracting things, and that they won't make you happy.",
		"You sometimes get distracted by things that are more interesting. If that happens, just put on a youtube-video to listen to in the background. It will draw your subconscious away from what distracted you.",
		"Resistance against a task takes up tons of energy. Instead of resisting, focus on the aspects of a task that you like.",
		"A small skill perfected is better than a large skill half-baked.",
		"Bad: 'Im glad its over!'. Good: 'Oh, so sad its over!'",
		"Having a technical job doesn't mean that you don't need any social skills.",
		"Explore and discover",
		"Nach oben hin ist Platz.",
		"Sure I can do this for you! While you're there, could you do .... ",
		"Eleminieren, automatisieren, delegieren",
		"Pausen: es gibt besseres als browsen! Hoere Musik und schreibe dem wise man. Ideal: schreibe zusammen was gerade zu tun ist, ohne es gleich zu tun.",
		"For people to like you, you should be a person that you like yourself.",
		"Programmers that get unmotivated usually suffer from simple things: not enough water, not enough sleep, not enough exercise.",
		"You know you're not the smartest man in the universe. The art is to do things with the potential that you have, however little it may be. That is not so much about brains as it is about heart.",
		"Ich bin nicht so sehr ein Informatiker als vielmehr ein Spielzeugmacher.",
		"If as a programmer you need more time, ask your client for details, example-data, use-cases, tests etc.",
		"At work, you should'nt ask yourself: what do I need to do? You should ask yourself: What can I do to add to my achievement list?",
		"You will always be dealing with legacy code. Here is how to work with it without going mental: 1. add really good, on demand logging. 2. add a repl like testenvironment 3. add unit tests when you change things",
		"Fight is better than flight.",
		"If your app depends on a db, make sure it immediately breaks when the db-structure changes. This is an overlooked advantage of orm.",
		"Selbstbewusstsein und Empathie",
		"Trag dein Zuhause in dir",
		"A person is very much defined by his surroundings. You may have a rich inner life, but if you dont expose it, others wont know about it, you miss the feedback of your ideas interacting with others, you will be forgotten when you leave.",
		"Learn to laugh at yourself in public. Teamwork is the most important part of programming. Personal failure is the most intense part of teamwork.",
		"In shared projects, avoid architecture decisions - in fact, avoid architecture as much as possible. The flatter, the better.",
		"Any time you want to procrastinate, it's because something's not right. Find out why.",
  ];
  public wiseThing$ = new BehaviorSubject<string>("");

  constructor() { }

  ngOnInit(): void {
    const loop = () => {
      const i = Math.floor(Math.random() * this.wiseThings.length);
      const newContent = this.wiseThings[i];
      this.wiseThing$.next(newContent);
      setTimeout(loop, 10000);
    }
    loop();
  }

}
