import { config } from "../../config.mjs";
import fp from "fastify-plugin";
import { default as Redis } from "ioredis";

export async function redisPlugin(fastify, options) {
    // Redis for General purpose
    const redis = new Redis(config.redis_url, {
        retryStrategy: function (times) {
            var delay = Math.min(times * 50, 2000);
            return delay;
        },
        autoResubscribe: false,
        autoResendUnfulfilledCommands: false,
        maxRetriesPerRequest: null
    });

    redis.on('connect', function () {
        console.log('Redis connected');
    });

    // Redis Connection for Verification (like captcha and email verification,  etc)
    const redisVerification = new Redis(config.redis_verification_url, {
        retryStrategy: function (times) {
            var delay = Math.min(times * 50, 2000);
            return delay;
        },
        autoResubscribe: false,
        autoResendUnfulfilledCommands: false,
        maxRetriesPerRequest: null
    });

    redisVerification.on('connect', function () {
        console.log('RedisVerification connected');
    });

    fastify.decorate('redis', redis);
    fastify.decorate('redisVerification', redisVerification);
}

export default fp(redisPlugin);
