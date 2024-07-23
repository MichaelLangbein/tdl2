

import { Injectable } from "@angular/core";

import { ApiService } from "./api.service";


export interface TopicRow {
  id: number;
  title: string;
}

export interface CardRow {
  id: number;
  topicId: number;
  front: string;
  back: string;
  goodAnswers: number;
  okAnswers: number;
  badAnswers: number;
}

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private api: ApiService) {}

  public getTopics() {
    return this.api.get<TopicRow[]>(`/cards/topics`);
  }

  createTopic(title: string) {
    return this.api.post<TopicRow>(`/cards/topics/new`, { title });
  }

  public getCards(topicId: number) {
    return this.api.get<CardRow[]>(`/cards/topics/${topicId}/cards`);
  }

  public createCard(topicId: number, front: string, back: string) {
    return this.api.post<CardRow>(`/cards/topics/${topicId}/cards/new`, {
      front,
      back,
    });
  }

  public updateCard(card: CardRow) {
    return this.api.patch<CardRow>(
      `/cards/topics/${card.topicId}/cards/${card.id}/update`,
      card
    );
  }
}
