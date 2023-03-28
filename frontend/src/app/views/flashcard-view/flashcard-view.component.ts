import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CardRow, CardService, TopicRow } from 'src/app/services/card.service';

@Component({
  selector: 'app-flashcard-view',
  templateUrl: './flashcard-view.component.html',
  styleUrls: ['./flashcard-view.component.css']
})
export class FlashcardViewComponent implements OnInit {
  
  public editing = false;
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
  public editCardForm = new FormGroup({
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
      this.orderCards();
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
    this.reveal = false;
    this.editing = false;
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

  public cardRated(card: CardRow, result: 'Good' | 'OK' | 'Bad') {
    switch (result) {
      case 'Good':
        card.goodAnswers += 1;
        break;
      case 'OK':
        card.okAnswers += 1;
        break;
      case 'Bad':
        card.badAnswers += 1;
        break;
    }
    this.cardSvc.updateCard(card).subscribe(updatedCard => this.setFromUpdated(updatedCard));
  }

  public setEditing(card: CardRow) {
    this.editing = true;
    this.editCardForm.controls["front"].setValue(card.front);
    this.editCardForm.controls["back"].setValue(card.back);
  }

  public updateCard() {
    const front = this.editCardForm.value.front;
    const back = this.editCardForm.value.back;
    const activeCard = this.activeCard;
    if (!activeCard || !front || !back) {
      console.error(`Couldn't update card ${activeCard} with ${front} and ${back}`);
      return;
    };
    activeCard.front = front;
    activeCard.back = back;
    this.cardSvc.updateCard(activeCard).subscribe(updated => this.setFromUpdated(updated));
    this.editing = false;
  }

  private setFromUpdated(updatedCard: CardRow) {
    const originalCard = this.cards.find(c => c.id === updatedCard.id);
    if (!originalCard) return;
    const index = this.cards.indexOf(originalCard);
    this.cards[index] = updatedCard;
    this.orderCards();
  }

  private orderCards() {
    this.cards.sort((a, b) => {
      const pointsA = getOrderingPoints(a);
      const pointsB = getOrderingPoints(b);
      return pointsA - pointsB;
    });
  }

}


function getOrderingPoints(card: CardRow): number {
  let points = 0;
  points -= 10 * card.badAnswers;
  points +=  1 * card.okAnswers;
  points += 10 * card.goodAnswers;
  points += (card.badAnswers + card.okAnswers + card.goodAnswers);
  return points;
}