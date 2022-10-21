import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const UserRouter = express.Router();

function generateAccessToken(user: any) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

UserRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.users.findFirst({ where: { username } });
    if (!user) {
      return res.sendStatus(401);
    }
    const isAuthorized = await bcrypt.compare(password, user.password);
    if (!isAuthorized) {
      return res.sendStatus(401);
    }
    return res.sendStatus(200);

    // const accessToken = generateAccessToken(user);
    // res.json({ accessToken: accessToken });
  } catch (e) {
    return next();
  }
});

UserRouter.post("/", async (req, res, next) => {
  try {
    const { username, firstName, lastName, password, email } = req.body;

    if (!username) {
      return res.sendStatus(400).send("username required");
    }

    if (firstName) {
      return res.sendStatus(400).send("firstName required");
    }

    if (!lastName) {
      return res.sendStatus(400).send("lastName required");
    }

    if (!password) {
      return res.sendStatus(400).send("password required");
    }
    if (!email) {
      return res.sendStatus(400).send("email required");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.users.create({
      data: {
        firstName,
        username,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    delete user.password;
    return res.json({ record: user });
  } catch (e) {
    return next(e);
  }
});
