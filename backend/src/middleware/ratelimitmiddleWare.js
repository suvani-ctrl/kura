import Redis from "ioredis"
const redis = new Redis()

export const IPrateLimitor = async(ip, maxRequests, windowSeconds) => {
  const current_time = Date.now();
  const total_Time_in_MS = windowSeconds * 1000;

  const current_block_start_id = Math.floor(current_time / total_Time_in_MS) * total_Time_in_MS;
  const previous_block_start_id = current_block_start_id - total_Time_in_MS;

  const time_passed_since_last_request = current_time - current_block_start_id;
  const timeRemaining = total_Time_in_MS - time_passed_since_last_request;

  const current_key = `Rate: IP:${ip}:${current_block_start_id}`;
  const previous_key = `Rate: IP:${ip}:${previous_block_start_id}`;

  const pipeline = redis.pipeline();
  pipeline.incr(current_key);
  pipeline.expire(current_key, total_Time_in_MS * 2);

  const results = await pipeline.exec();
  const currentCount = results[0][1]

  const previousCount = parseInt(await redis.get(previous_key)) || 0;
  const weightedCount = previousCount * (timeRemaining / total_Time_in_MS) + currentCount; 

  if (weightedCount > maxRequests) {
    return { limited: true, message: "Too many requests" };
  } else {
    return { limited: false, message: "Request allowed" };
  }
}

export const bruteforceLimitor = async(userId, maxRequests, windowSeconds) => {

  const user_identifier = userId;
  const current_time = Date.now();
  const total_Time_in_MS = windowSeconds * 1000;

  const current_block_start_id = Math.floor(current_time / total_Time_in_MS) * total_Time_in_MS;
  const previous_block_start_id = current_block_start_id - total_Time_in_MS;

  const time_passed_in_current_block = current_time - current_block_start_id
  const time_remaining = total_Time_in_MS - time_passed_in_current_block
  
  const current_key = `Rate: USER:${user_identifier}:${current_block_start_id}` 
  const previous_key = `Rate: USER:${user_identifier}:${previous_block_start_id}`

  const pipeline = redis.pipeline();
  pipeline.incr(current_key);
  pipeline.expire(current_key, total_Time_in_MS * 2)

  const results = await pipeline.exec();
  const currentCount = results[0][1];

  const previous_count = parseInt(await redis.get(previous_key) || 0 );

  const weightedCount = previous_count * (time_remaining / total_Time_in_MS) + currentCount // Renamed variable for clarity

  if (weightedCount > maxRequests) {
    return { limited: true, message: 'Too many requests' }
  } else {
    return { limited: false, message: 'Request allowed' }
  }
}