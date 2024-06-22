import fp from "fastify-plugin";
import { tokenGenerator } from "../../libs/auth/tokenGenerator.mjs";

const schema = {
  body: {
    type: "object",
    required: ["email", "emailVerificationCode"],
    properties: {
      email: { type: "string", format: "email" },
      emailVerificationCode: { type: "string" },
    },
  },
  response: {
    200: {
      properties: {
        token: { type: "string" },
      },
    },
    401: {
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

async function verifyEmailCode(fastify, email, emailVerificationCode) {
  const emailKeys = await fastify.redisVerification.keys(
    `EMAILVERIFY:${email}:*`
  );
  if (emailKeys.length > 0) {
    const values = await fastify.redisVerification.mget(emailKeys);
    return values.every((value) => value === emailVerificationCode);
  }
  return false;
}

async function handleAuthUserByEmail(request, reply) {
  try {
    const { email, emailVerificationCode } = request.body;

    const isVerified = await verifyEmailCode(
      request.server,
      email,
      emailVerificationCode
    );
    if (isVerified) {
      const token = await tokenGenerator(email);
      const userId = request.server.nanoid();
      const registrationTime = new Date().toISOString();
      await request.server.registrationQueue.add({
        userId,
        email,
        registrationTime,
      });

      reply.code(200).send({ token });
    } else {
      reply.code(401).send({ message: "Unauthorized" });
    }
  } catch (error) {
    request.log.debug(`Auth user by email operation failed: ${error.message}`);
    reply
      .code(500)
      .send({ message: "Internal error occurred during auth user by email" });
  }
}

async function apiAuthByEmail(fastify, options) {
  fastify.route({
    method: "POST",
    url: "/api/auth/authUserByEmail",
    schema,
    handler: handleAuthUserByEmail,
  });
}

export default fp(apiAuthByEmail);
