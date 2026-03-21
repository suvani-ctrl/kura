import { createClient } from "redis";


export const client = createClient();
client.on('error', err =>{
    console.log('Redis client error', err);
})


await client.connect();
