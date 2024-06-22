import { config } from "../../config.mjs";
import fp from "fastify-plugin";
import Redis from "ioredis";
import Queue from "bull";

async function bullPlugin(fastify, options) {
  // Redis for Bull
  const redisBullClient = new Redis(config.redis_bull_url, {
    retryStrategy: function (times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: null,
  });

  const redisBullSubscriber = new Redis(config.redis_bull_url, {
    retryStrategy: function (times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: null,
  });

  // used for connection reuse on multiple queues
  const redisOpts = {
    createClient: function (type) {
      switch (type) {
        case "client":
          return redisBullClient;
        case "subscriber":
          return redisBullSubscriber;
        default:
          return new Redis(config.redis_bull_url);
      }
    },
  };

  // Initialize queues
  const jobQTest = new Queue("jobQTest", redisOpts);
  const jobQTest2 = new Queue("jobQTest2", redisOpts);
  const registrationQueue = new Queue("registrationQueue", redisOpts);
  const emailVerification = new Queue("emailVerification", redisOpts);

  // Decorate Fastify instance with queues
  fastify.decorate("jobQTest", jobQTest);
  fastify.decorate("jobQTest2", jobQTest2);
  fastify.decorate("registrationQueue", registrationQueue);
  fastify.decorate("emailVerification", emailVerification);
}

export default fp(bullPlugin);
