import express, { Router } from 'express'
import { UserRouter } from './routes/user'
const router = Router()

router.use('/user', UserRouter)

export default router


