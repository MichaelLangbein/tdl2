# Prisma

- `npm install prisma`
- `npx prisma init --datasource-provider sqlite`
- `.env` now contains DATABASE_URL and potentially credentials
- `schema.prisma`
- `npx prisma migrate myDbFileName --name myMigrationName`

## Schema

```prisma
model User {
    id Int @id @default(autoincrement())
    email String @unique
    name String?
    birthday DateTime @default(now()) @db.Timestamptz(6)
    articles Article[]
}

model Article {
    id Int @id @default(autoincrement())
    title String
    body String?

    // author: not a db-column
    // matches this table's `Article.authorId` to `User.id`
    author User @relation(fields: [authorId], references: [id])
    // authorId: a real db-column; automatically gets foreign-key (if applicable)?
    authorId Int
}
```

## API

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const user = await prisma.user.create({
  data: {
    name: 'Michael',
    email: 'fdafs@fdafsd.com',
  },
});

const allUsers = await prisma.user.findMany({
  where: {
    birthday: {
      lte: new Date('2022-01-01'),
      gte: new Date('1900-01-01'),
    },
  },
  include: {
    articles: true, // resolves and attaches the users articles
  },
});

const article = await prisma.article.create({
  data: {
    title: 'da',
    body: 'dffdas',
    author: {
      connect: { id: 1 },
    },
  },
});

const userWithNewArticle = await prisma.user.create({
  data: {
    name: 'fdsafs',
    email: 'fdafs@fdsafs.com',
    articles: {
      create: {
        // creates article on the fly and associates it
        title: 'dsfads',
        body: 'fdsafsd',
      },
    },
  },
});

const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'New name' },
});

const deletedArticle = await prisma.article.delete({
  where: { id: 2 },
});

await prisma.$disconnect();
```
