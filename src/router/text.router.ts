import { Router } from "express";
import { prisma } from "../../prisma/db.setup";
import { authMiddleware } from "../auth-utils";

const textController = Router();

textController.get("/text", authMiddleware, async (req, res) => {
  const allText = await prisma.text.findMany();
  return res.status(200).json(allText);
});

textController.get("/text/random", authMiddleware, async (req, res) => {
  const allText = await prisma.text.findMany();
  const randomText = allText[Math.floor(Math.random() * allText.length)];
  return res.status(200).json(randomText);
});

export { textController };
