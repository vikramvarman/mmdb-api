import express from "express";
import jwt from 'jsonwebtoken';

export const UserRouter = express.Router()

function generateAccessToken(user:any) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  }

UserRouter.post('/login', (req, res) => {
    // Authenticate User
  
    const username = req.body.username
    const user = { name: username }
  
    const accessToken = generateAccessToken(user)
    
    res.json({ accessToken: accessToken })
  })
