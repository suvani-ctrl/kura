import express from 'express'
import {ENV} from "../src/lib/env.js"
import http,{Server} from "http"
import {Server as SocketIOServer} from 'socket.io'
import cors from 'cors'

const allowedOrigin = [
"http://localhost:5173",
ENV.CLIENT_URL
].filter(Boolean);

export const initializeSocketServer = async(server) =>{
  const io = new SocketIOServer(server,{
    cors:{
      origin:(origin,callback) =>{
        if(!origin || allowedOrigin.includes(origin)){
          callback(null,true)
        }else{
          callback(new Error('Not allowed by CORS'));
        }
      },
      method: ['GET','POST'],
      credentials: true
    }
  })
}

