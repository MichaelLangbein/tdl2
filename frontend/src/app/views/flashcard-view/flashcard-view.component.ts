import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CardRow, CardService, TopicRow } from 'src/app/services/card.service';

@Component({
  selector: 'app-flashcard-view',
  templateUrl: './flashcard-view.component.html',
  styleUrls: ['./flashcard-view.component.css']
})
export class FlashcardViewComponent implements OnInit {
  
  public reveal = false;
  public activeTopic: TopicRow | undefined;
  public activeCard: CardRow | undefined;
  public topics: TopicRow[] = [];
  public cards: CardRow[] = [];
  public createTopicForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2)])
  });
  public createCardForm = new FormGroup({
    front: new FormControl('', [Validators.required, Validators.minLength(2)]),
    back: new FormControl('', [Validators.required, Validators.minLength(2)])
  });

  constructor(private cardSvc: CardService) { }

  ngOnInit(): void {
    this.cardSvc.getTopics().subscribe(topics => {
      this.topics = topics;
    });
  }

  public setTopic(topic: TopicRow) {
    this.activeTopic = topic;
    this.cardSvc.getCards(topic.id).subscribe(cards => {
      this.cards = cards;
    });
  }

  public createTopic() {
    const topicTitle = this.createTopicForm.value.title;
    if (topicTitle) {
      this.cardSvc.createTopic(topicTitle).subscribe(topic => {
        this.createTopicForm.setValue({ title: '' });
        this.topics.push(topic);
        this.setTopic(topic);
      })
    }
  }

  public setCard(card: CardRow) {
    this.activeCard = card;
  }

  public createCard() {
    const front = this.createCardForm.value.front;
    const back = this.createCardForm.value.back;
    if (front && back && this.activeTopic) {
      this.cardSvc.createCard(this.activeTopic.id, front, back).subscribe(card => {
        this.createCardForm.setValue({ front: '', back: '' });
        this.cards.push(card);
        this.setCard(card);
      })
    }
  }

  public updateCard(card: CardRow, result: 'Good' | 'OK' | 'Bad') {
    console.log(`updating card`, card, result);
  }

}
