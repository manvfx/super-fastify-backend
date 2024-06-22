import { config } from "../../../config.mjs";
import fp from "fastify-plugin";

const schema = {
  body: {
    type: "object",
    required: ["email", "captchaId", "captchaText"],
    properties: {
      email: { type: "string", format: "email" },
      captchaId: { type: "string" },
      captchaText: { type: "string" },
    },
  },
  response: {
    200: {
      content: {
        "application/json": {
          schema: {
            message: { type: "string" },
          },
        },
      },
    },
    403: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

async function verifyCaptcha(fastify, captchaId, captchaText) {
  const storedCaptchaText = await fastify.redis.get(`CAPTCHA:${captchaId}`);
  return storedCaptchaText === captchaText;
}

async function handleEmailVerification(request, reply) {
  try {
    const { email, captchaId, captchaText } = request.body;

    const isCaptchaValid = await verifyCaptcha(
      request.server,
      captchaId,
      captchaText
    );
    if (isCaptchaValid) {
      await request.server.emailVerification.add({ email });
      reply.code(200).send({ message: "The verification code was emailed" });
    } else {
      reply.code(403).send({ message: "Forbidden response" });
    }
  } catch (error) {
    request.log.error(`Email verification failed: ${error.message}`);
    reply
      .code(500)
      .send({ message: "Internal error occurred during email verification" });
  }
}

async function apiEmailVerification(fastify, options) {
  fastify.route({
    method: "POST",
    url: "/api/tools/emailVerificationRequest",
    schema,
    handler: handleEmailVerification,
  });
}

export default fp(apiEmailVerification);
