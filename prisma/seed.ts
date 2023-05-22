import { encryptPassword } from "../src/auth-utils";
import { newDateFormatter } from "../src/helper";
import { prisma } from "./db.setup";

// Clears entire database and fills it with dummy data

const clearDb = async () => {
  await prisma.score.deleteMany();
  await prisma.user.deleteMany();
  await prisma.text.deleteMany();
};

const addQuotesToDatabase = async () => {
  await fetch("https://zenquotes.io/api/quotes")
    .then((response) => response.json())
    .then(async (data) => {
      for (const quote of data) {
        await prisma.text.create({
          data: {
            text: quote.q,
          },
        });
      }
    });
};

const seed = async () => {
  console.log("seeding database...");
  await clearDb();

  const testUser = await prisma.user.create({
    data: {
      email: "test@test.com",
      passwordHash: await encryptPassword("password"),
    },
  });

  const testUser2 = await prisma.user.create({
    data: {
      email: "test2@test.com",
      passwordHash: await encryptPassword("password"),
    },
  });

  const score1 = await prisma.score.create({
    data: {
      score: 2000,
      userId: testUser.id,
      userEmail: testUser.email,
      createdOn: newDateFormatter(new Date()),
    },
  });

  const score2 = await prisma.score.create({
    data: {
      score: 900,
      userId: testUser.id,
      userEmail: testUser.email,
      createdOn: newDateFormatter(new Date()),
    },
  });

  const score3 = await prisma.score.create({
    data: {
      score: 610,
      userId: testUser.id,
      userEmail: testUser.email,
      createdOn: newDateFormatter(new Date()),
    },
  });

  addQuotesToDatabase();
};

seed()
  .then(() => console.log("Seeding complete"))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
