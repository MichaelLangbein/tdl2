import { Database } from 'sqlite';


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

export class CardService {
    constructor(private db: Database) {}

    public async init() {
        const topicTable = await this.db.get(`
            select name from sqlite_master where type='table' and name='card_topics';
        `);
        if (!topicTable) {
            await this.db.exec(`
                create table card_topics (
                    id              integer primary key autoincrement,
                    title           text    not null
                );
            `);
        }
        const cardTable = await this.db.get(`
            select name from sqlite_master where type='table' and name='card_data';
        `);
        if (!cardTable) {
            await this.db.exec(`
                create table card_data (
                    id          integer primary key autoincrement,
                    topicId     integer not null,
                    front       text,
                    back        text,
                    goodAnswers integer,
                    okAnswers   integer,
                    badAnswers  integer,
                    foreign key (topicId) references card_topics (id)
                );
            `);
        }
    }

    public async getLastInsertId() {
        const result = await this.db.get(`SELECT last_insert_rowid()`);
        return result['last_insert_rowid()'];
    }

    public async getTopic(id: number)  {
        const topic: TopicRow | undefined = await this.db.get(`
            select * from card_topics where id = $id;
        `, {
            '$id': id
        });
        return topic;
    }

    public async getTopics()  {
        const topics: TopicRow[] = await this.db.all(`
            select * from card_topics;
        `);
        return topics;
    }

    public async createTopic(title: string) {
        await this.db.run(`
            insert into card_topics (title)
            values ($title)
        `, {
            '$title': title
        });
        const id = await this.getLastInsertId();
        return await this.getTopic(id);
    }

    public async updateTopic(id: number, title: string) {
        await this.db.run(`
            update card_topics
            set title = $title
            where id = $id;
        `, {
            '$id': id,
            '$title': title
        });
        const updatedTopic = await this.getTopic(id);
        return updatedTopic!;
    }

    public async getCard(cardId: number) {
        const card: CardRow | undefined = await this.db.get(`
            select * from card_data where id = $id;
        `, {
            '$id': cardId
        });
        return card;
    }

    public async getCards(topicId: number) {
        const cards: CardRow[] = await this.db.all(`
            select * from card_data where topicId = $topicId;
        `, {
            '$topicId': topicId
        });
        return cards;
    }

    public async createCard(topicId: number, front: string, back: string) {
        await this.db.run(`
            insert into card_data (topicId, front, back)
            values ($topicId, $front, $back)
        `, {
            '$topicId': topicId,
            '$front': front,
            '$back': back
        });
        const id = await this.getLastInsertId();
        return await this.getCard(id);
    }

    public async updateCard(id: number, topicId: number, front: string, back: string, goodAnswers: number, okAnswers: number, badAnswers: number) {
        await this.db.run(`
            update card_data
            set 
                topicId = $topicId,
                front = $front,
                back = $back,
                goodAnswers = $goodAnswers,
                okAnswers = $okAnswers,
                badAnswers = $badAnswers
            where id = $id;
        `, {
            '$id': id,
            '$topicId': topicId,
            '$front': front,
            '$back': back,
            '$goodAnswers': goodAnswers,
            '$okAnswers': okAnswers,
            '$badAnswers': badAnswers
        });
        const updatedCard = await this.getCard(id);
        return updatedCard!;
    }
}