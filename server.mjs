import { config } from "./config.mjs";
import Fastify from "fastify";

//plugins
import { redisPlugin } from "./app/plugins/redis.mjs";
import { mongodbPlugin } from "./app/plugins/mongodb.mjs";
import { nanoidPlugin } from "./app/plugins/nanoid.mjs";
import { authPlugin } from "./app/plugins/auth.mjs";
import { bullPlugin } from "./app/plugins/bull.mjs";

const fastify = Fastify({ logger: true });

fastify.register(nanoidPlugin);
fastify.register(redisPlugin);
fastify.register(mongodbPlugin, { mongoUrl: config.mongoUrl, dbName: config.dbName });
fastify.register(bullPlugin);
fastify.register(authPlugin);

fastify.get('/', async (request, reply) => {
    return await reply.send({ "Super Rest API": "Works fine!" });
})


export async function start() {
    try {
        fastify.listen({ port: config.server_port, host: config.server_host });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}


