import { createClient } from "redis";


export const redisClient = createClient();
redisClient.on('error', err =>{
    console.log('Redis client error', err);
})


await redisClient.connect();
