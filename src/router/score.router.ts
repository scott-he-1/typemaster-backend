import { Router } from "express";
import { prisma } from "../../prisma/db.setup";
import { sortScoreBy } from "../helper";
import { authMiddleware } from "../auth-utils";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { newDateFormatter } from "../helper";

const scoreController = Router();

scoreController.get("/scores", async (req, res) => {
  const order = String(req.query.order);
  let scores = await prisma.score.findMany();
  if (typeof order !== "undefined") {
    scores = sortScoreBy(scores, order);
  }
  return res.status(200).json(scores);
});

scoreController.post(
  "/scores",
  authMiddleware,
  validateRequest({
    body: z.object({
      score: z.number(),
    }),
  }),
  async (req, res) => {
    const scorer = await prisma.user.findFirst({
      where: {
        id: req.user?.id,
      },
    });
    if (!scorer) {
      return res.status(404).json({ message: "User not found" });
    }
    const newScore = await prisma.score.create({
      data: {
        score: req.body.score,
        userId: scorer.id,
        userEmail: scorer.email,
        createdOn: newDateFormatter(new Date()),
      },
      include: {
        user: true,
      },
    });
    if (newScore) {
      return res.status(200).json(newScore);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

export { scoreController };
