// import redis from "ioredis"
// import { ENV } from "../src/lib/env"


// const redisClient = new Redis({
//     port: ENV.REDIS_PORT,
//     host:ENV.REDIS_HOST,
//     maxRetriesPerRequest:null,
//     enableReadyCheck:false,
//     password:ENV.REDIS_PASSWORD

// });

// redisClient.on('connect', () =>{
//     console.log("Redis client has been connected succesfully");
// })

// redisClient.on('error', (error) =>{
//     console.error("redis connection error", error);
// })

// export default redisClient


import { createClient } from 'redis';

const client = createClient()
await client.connect()

client.on('error',(err) =>{
    console.log('Redis client error', err)
});

await client.set('key','value');
const value = await client.get('key');
client.destroy();