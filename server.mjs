import { config } from "./config.mjs";
import Fastify from "fastify";

//plugins
import { redisPlugin } from "./app/plugins/redis.mjs";
import mongodbPlugin from "./app/plugins/mongodb.mjs";
import { nanoidPlugin } from "./app/plugins/nanoid.mjs";
import { authPlugin } from "./app/plugins/auth.mjs";
import bullPlugin from "./app/plugins/bull.mjs";
import { kavenegarPlugin } from "./app/plugins/kavenegar.mjs";

//routes
import apiAuthByEmail from "./app/routes/auth/authUserByEmail.mjs";
import apiRegistration from "./app/routes/registration/authUserByEmail.mjs";
import apiToolsCaptcha from "./app/routes/tools/captcha.mjs";
import apiEmailVerification from "./app/routes/tools/emailVerification.mjs";
import apiUserProfile from "./app/routes/auth/authProfile.mjs";
// import apiUser from "./app/routes/user/user.mjs";

const fastify = Fastify({ logger: true });

fastify.register(apiAuthByEmail);
fastify.register(apiRegistration);
fastify.register(apiToolsCaptcha);
fastify.register(apiEmailVerification);
fastify.register(apiUserProfile);
// fastify.register(apiUser);

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
fastify.register(kavenegarPlugin, { apiKey: config.kavenegarApiKey });

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


//workers

fastify.get('/testbull', async (request, reply) => {
  let job = await fastify.jobQTest.add({ test: 'test' });
  // console.log(job);
  return await reply.send({ "Botly Rest API": "Bull Works fine!" });
})

fastify.get('/testemail', async (request, reply) => {
  try {
    const job = await fastify.registrationQueue.add({ userId: '1000', email: 'manvfx@gmail.com', registrationTime: "asdasdasd" });
    return await reply.send({ "Super Fastify Email": "Email Works fine!",jobId:job.id, data: job.data });
  } catch (error) {
    fastify.log.error('Failed to add job:', error);
    reply.status(500).send({ error: 'Failed to add job' });
  }
})

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
