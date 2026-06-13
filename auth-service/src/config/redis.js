const Redis = require('ioredis');

let redisClient;

const connectRedis = async () => {
  redisClient = new Redis(
    process.env.REDIS_URL
  );

  redisClient.on('connect', () => {
    console.log('Redis Connected');
  });

  redisClient.on('error', (err) => {
    console.error(
      'Redis Error:',
      err.message
    );
  });

  return redisClient;
};

const getRedisClient = () =>
  redisClient;

module.exports = connectRedis;
module.exports.getRedisClient =
  getRedisClient;