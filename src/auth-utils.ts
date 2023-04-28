import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma/db.setup";
import dotenv from "dotenv";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

dotenv.config();

export const encryptPassword = (password: string) => {
  return bcrypt.hash(password, 11);
};

export const getNonsensitiveDataFromUser = (user: User) => ({
  email: user.email,
  id: user.id,
});

export const createTokenForUser = (user: User) => {
  return jwt.sign(
    getNonsensitiveDataFromUser(user),
    process.env.JWT_SECRET as string
  );
};

const jwtInfoSchema = z.object({
  email: z.string().email(),
  iat: z.number(),
});

export const getDataFromAuthToken = (token?: string) => {
  if (!token) return null;
  try {
    return jwtInfoSchema.parse(
      jwt.verify(token, process.env.JWT_SECRET as string)
    );
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [, token] = req.headers.authorization?.split(" ") || [];
  const myJwtData = getDataFromAuthToken(token);
  if (!myJwtData) {
    return res.status(401).json({ message: "Invalid token" });
  }
  const userFromJwt = await prisma.user.findFirst({
    where: {
      email: myJwtData.email,
    },
  });
  if (!userFromJwt) {
    return res.status(404).json({ message: "User not found" });
  }
  req.user = userFromJwt;
  next();
};
