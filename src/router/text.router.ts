import { Router } from "express";
import { prisma } from "../../prisma/db.setup";
import { authMiddleware } from "../auth-utils";

const textController = Router();

textController.get("/text", async (req, res) => {
  const allText = await prisma.text.findMany();
  return res.status(200).json(allText);
});

textController.get("/text/random", authMiddleware, async (req, res) => {
  const allText = await prisma.text.findMany();
  const randomText = allText[Math.floor(Math.random() * allText.length)];
  return res.status(200).json(randomText);
});

textController.post("/text", async (req, res) => {
  await prisma.text.deleteMany();
  const quotes = await fetch("https://zenquotes.io/api/quotes")
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
  return res.status(200).json(quotes);
});

export { textController };
