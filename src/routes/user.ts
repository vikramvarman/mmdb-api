import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "./middleware";

const prisma = new PrismaClient();
export const UserRouter = express.Router();

function generateAccessToken(user: any) {
  return jwt.sign(user, process.env.JWT_SECRET);
}

UserRouter.post("/test", authenticate(), async (req, res, next) => {
  res.send("ok");
});

UserRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.users.findFirst({ where: { username } });

    if (!user) {
      return res.send("401");
    }
    const isAuthorized = await bcrypt.compare(password, user.password);
    if (!isAuthorized) {
      return res.send("401");
    }

    const accessToken = generateAccessToken(user);
    return res.json({
      accessToken: accessToken,
      id: user.id,
      username: user.username,
    });
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

UserRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res.status(400).send("username required");
    }

    if (!password) {
      return res.status(400).send("password required");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    delete user.password;
    return res.json({ record: user });
  } catch (e) {
    return next(e);
  }
});
