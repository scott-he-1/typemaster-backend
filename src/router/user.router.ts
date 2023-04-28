import { Router } from "express";
import { prisma } from "../../prisma/db.setup";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { createTokenForUser, encryptPassword } from "../auth-utils";

const userController = Router();

userController.get("/user/:id/scores", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "Id should be a number" });
  }
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
    include: {
      scores: true,
    },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
});

userController.post(
  "/user",
  validateRequest({
    body: z.object({ email: z.string().email(), password: z.string() }),
  }),
  async (req, res) => {
    const emailExists = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (emailExists) {
      return res.status(401).json({ message: "Email Already Exists" });
    }
    const newUser = await prisma.user.create({
      data: {
        email: req.body.email,
        passwordHash: await encryptPassword(req.body.password),
      },
    });

    const userToken = createTokenForUser(newUser);
    return res.status(200).json(userToken);
  }
);

export { userController };
