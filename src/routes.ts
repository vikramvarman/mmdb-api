import express, { Router } from "express";
import { MovieRouter } from "./routes/movie";
import { UserRouter } from "./routes/user";
const router = Router();

router.use("/user", UserRouter);

router.use("/movie", MovieRouter);

export default router;
