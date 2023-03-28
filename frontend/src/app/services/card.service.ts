import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


export interface TopicRow {
  id: number,
  title: string
}

export interface CardRow {
  id: number,
  topicId: number,
  front: string,
  back: string,
  goodAnswers: number,
  okAnswers: number,
  badAnswers: number
}


@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }

  public getTopics() {
    return this.http.get<TopicRow[]>(`http://localhost:1410/cards/topics`);
  }

  createTopic(title: string) {
    return this.http.post<TopicRow>("http://localhost:1410/cards/topics/new", { title });
  }

  public getCards(topicId: number) {
    return this.http.get<CardRow[]>(`http://localhost:1410/cards/topics/${topicId}/cards`);
  }

  public createCard(topicId: number, front: string, back: string) {
    return this.http.post<CardRow>(`http://localhost:1410/cards/topics/${topicId}/cards/new`, { front, back });
  }

  public updateCard(card: CardRow) {
    return this.http.patch<CardRow>(`http://localhost:1410/cards/topics/${card.topicId}/cards/${card.id}/update`, card);
  }
}
