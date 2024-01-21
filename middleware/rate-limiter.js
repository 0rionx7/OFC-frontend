import { RateLimiterMongo } from 'rate-limiter-flexible';
import { defaultConnection } from '../mongoConn.js';

const opts = {
  storeClient: defaultConnection,
  points: 10, // Number of points
  duration: 1, // Per second(s)
  blockDuration: 10, // secs
};

const rateLimiter = new RateLimiterMongo(opts);
export const rateLimiterMiddleWare = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip, 2);
    next();
  } catch (error) {
    console.log('Too Many Requests');
    res.status(557).json('Too Many Requests');
    next('blocked');
  }
};
