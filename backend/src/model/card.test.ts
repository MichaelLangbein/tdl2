import { createDatabase } from '../db/db';
import { Database } from 'sqlite';
import { CardService } from './card.service';



let db: Database;
let cs: CardService;
beforeAll(async () => {
    db = await createDatabase(':memory:');
    cs = new CardService(db);
    await cs.init();
});

afterAll(async () => {
    db.close();
});


describe("Card service", () => {

    test("create", async () => {
        const topic = await cs.createTopic(`french`);
        expect(topic).toBeTruthy();
        const card = await cs.createCard(topic.id, `bonjour`, `hello`);
        expect(card).toBeTruthy();
    });

    test("read", async () => {
        const allTopics = await cs.getTopics();
        expect(allTopics.length).toBe(1);
        expect(allTopics[0].title).toBe(`french`);
        const allCards = await cs.getCards(allTopics[0].id);
        expect(allCards.length).toBe(1);
        expect(allCards[0].front).toBe(`bonjour`);
    });


    test("update", async () => {
        const updatedTask = await cs.updateCard(1, 1, `bonjour`, `hello`, 1, 0, 0);
        expect(updatedTask.goodAnswers).toBe(1);
        expect(updatedTask.okAnswers).toBe(0);
        expect(updatedTask.badAnswers).toBe(0);
    });

})