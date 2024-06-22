import { config } from "./config.mjs";
import Fastify from "fastify";

//plugins
import { redisPlugin } from "./app/plugins/redis.mjs";
import { mongodbPlugin } from "./app/plugins/mongodb.mjs";
import { nanoidPlugin } from "./app/plugins/nanoid.mjs";
import { authPlugin } from "./app/plugins/auth.mjs";
import { bullPlugin } from "./app/plugins/bull.mjs";

const fastify = Fastify({ logger: true });

//setup swagger
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

await fastify.register(swagger, {
  swagger: {
    info: {
      title: "Super Backend API",
      description: "API documentation",
      version: "1.0.0",
    },
  },
});
await fastify.register(swaggerUi, {
  routePrefix: "/documentation",
  theme: {
    title: "Super Api docs",
  },
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

fastify.register(nanoidPlugin);
fastify.register(redisPlugin);
fastify.register(mongodbPlugin, {
  mongoUrl: config.mongoUrl,
  dbName: config.dbName,
});
fastify.register(bullPlugin);
fastify.register(authPlugin);

fastify.get("/", {
  schema: {
    description: "Home Endpoint",
    tags: ["Default"],
    summary: "An home endpoint",
    response: {
      200: {
        description: "Successful response",
        type: "object",
        properties: {
          hello: { type: "string" },
        },
      },
    },
  },
  handler: async (request, reply) => {
    return { hello: "world" };
  },
});

export async function start() {
  try {
    fastify.listen({ port: config.server_port, host: config.server_host });
    await fastify.ready();
    fastify.swagger();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
