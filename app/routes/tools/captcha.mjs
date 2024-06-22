import { config } from "../../../config.mjs";
import fp from "fastify-plugin";
import svgCaptcha from "svg-captcha";

const CAPTCHA_OPTIONS = {
  size: 6,
  noise: 2,
  color: true,
  background: "#cc9966",
  width: 150,
  height: 50,
  fontSize: 50,
  ignoreChars: "0o1i",
};

const REDIS_CAPTCHA_PREFIX = "CAPTCHA:";

async function generateCaptcha() {
  return svgCaptcha.create(CAPTCHA_OPTIONS);
}

async function saveCaptchaToRedis(fastify, captchaText, captchaId) {
  await fastify.redis.set(
    `${REDIS_CAPTCHA_PREFIX}${captchaId}`,
    captchaText,
    "EX",
    config.captchaExpiration
  );
}

async function captchaHandler(request, reply) {
  try {
    const captcha = await generateCaptcha();
    const captchaId = request.server.nanoid();

    await saveCaptchaToRedis(request.server, captcha.text, captchaId);

    request.log.trace("Captcha saved and created successfully");
    console.log(captcha.text);

    return {
      captchaSVG: captcha.data,
      captchaId: captchaId,
    };
  } catch (error) {
    request.log.error(`Captcha operation failed: ${error.message}`);
    throw {
      statusCode: 500,
      message: "Internal error occurred during Captcha generation",
    };
  }
}

async function apiToolsCaptcha(fastify, options) {
  fastify.route({
    method: "GET",
    url: "/api/tools/captcha",
    handler: captchaHandler,
  });
}

export default fp(apiToolsCaptcha);
