import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "./middleware";
import { v4 as uuidv4 } from "uuid";
import { nextTick } from "process";

const prisma = new PrismaClient();
export const MovieRouter = express.Router();

MovieRouter.post("/test", authenticate(), async (req, res, next) => {
  res.send("ok");
});

MovieRouter.get("/all", authenticate(), async (req: any, res, next) => {
  try {
    const userId = req.user.id;

    const movies = await prisma.movie.findMany({ where: { userId } });
    return res.send({ movies });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

MovieRouter.post("/", authenticate(), async (req: any, res, next) => {
  try {
    const { name, rating, cast, genre, release } = req.body;

    const date = new Date(release);
    const isoDate = date.toISOString();

    const movie = await prisma.movie.create({
      data: {
        id: uuidv4(),
        name,
        rating,
        castMembers: cast,
        genre,
        release: isoDate,
        userId: req.user.id,
      },
    });
    res.send(movie);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

MovieRouter.put("/:movieId", authenticate(), async (req: any, res, next) => {
  try {
    console.log(req.params.movieId);
    const { name, rating, cast, genre, release } = req.body;
    const date = new Date(release);
    const isoDate = date.toISOString();

    const userId = req.user.id;
    const movieOld = await prisma.movie.findFirst({
      where: {
        id: req.params.movieId,
      },
    });
    if (movieOld.userId != userId) {
      return res.status(401).send("Unauthorized");
    }

    const movie = await prisma.movie.update({
      data: {
        name,
        rating,
        castMembers: cast,
        genre,
        release: isoDate,
      },
      where: {
        id: req.params.movieId,
      },
    });

    return res.send(movie);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

MovieRouter.delete("/:movieId", authenticate(), async (req: any, res, next) => {
  try {
    const userId = req.user.id;

    const movieOld = await prisma.movie.findFirst({
      where: {
        id: req.params.movieId,
      },
    });
    if (movieOld.userId != userId) {
      return res.status(401).send("Unauthorized");
    }

    const movies = await prisma.movie.delete({
      where: { id: req.params.movieId },
    });
    res.send({ movies });
  } catch (e) {
    console.error(e);
    return next(e);
  }
});
