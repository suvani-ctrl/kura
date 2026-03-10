import express from 'express'
import http, { Server } from 'http'
import {Server as SocketIOServer} from 'socket.io'
import { ENV } from '../src/lib/env.js'
import cors from 'cors'


const allowedOrigins = [
  'http://localhost:5173',
  ENV.CLIENT_URL
].filter(Boolean);

export function initializeSocketServer(server){

  const io = new SocketIOServer(server,{
  cors:{
  origin: (origin,callback) => {
    if (!origin || allowedOrigins.includes(origin)){
      callback(null,true)
    }else{
      callback(new Error('Blocked By CORS..!!!'))
    }
  },
  method: ['GET','POST'],
  credentials:true
}
}
)
} 

const app = express();
