import { config } from "../../../config.mjs";
import fp from "fastify-plugin";

const schema = {
  body: {
    type: "object",
    required: ["email"],
    properties: {
      email: { type: "string", format: "email" },
    },
  },
  response: {
    200: {
      properties: {
        message: { type: "string" },
      },
    },
    400: {
      properties: {
        message: { type: "string" },
      },
    },
    500: {
      properties: {
        message: { type: "string" },
      },
    },
  },
};

async function registerUser(fastify, email) {
  const user = await fastify.db.collection("users").findOne({ email });
  if (!user) {
    const userId = fastify.nanoid();
    const registrationTime = new Date().toISOString();
    await fastify.registrationQueue.add({ userId, email, registrationTime });
    return { status: 200, message: "You have successfully registered" };
  } else {
    return { status: 400, message: "User already exists" };
  }
}

async function handleRegistration(request, reply) {
  try {
    const { email } = request.body;
    const result = await registerUser(request.server, email);
    reply.code(result.status).send({ message: result.message });
  } catch (error) {
    request.log.debug(
      `User registration by email operation failed: ${error.message}`
    );
    reply
      .code(500)
      .send({
        message: "Internal error occurred during user registration by email",
      });
  }
}

async function apiRegistration(fastify, options) {
  fastify.route({
    method: "POST",
    url: "/api/registration",
    schema,
    handler: handleRegistration,
  });
}

export default fp(apiRegistration);
