import { config } from "../../config.mjs";
import { default as Queue } from "bull";
import axios from "axios";
import { Eta } from "eta";
import { default as Redis } from "ioredis";
import { nanoid } from "nanoid";

const eta = new Eta({ views: "./templates" });
// Redis Connection for Verification (like captcha and email verification,  etc)
const redisVerification = new Redis(config.redis_verification_url, {
  retryStrategy: function (times) {
    var delay = Math.min(times * 50, 2000);
    return delay;
  },
  autoResubscribe: false,
  autoResendUnfulfilledCommands: false,
  maxRetriesPerRequest: null,
});

redisVerification.on("connect", function () {
  console.log("RedisVerification job worker connected");
});

// Initiating the Queue
const sendMailQueue = new Queue("emailVerification", config.redis_bull_url);

async function sendMail(email) {
  try {
    // configure template engine
    let code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    let html = await eta.renderFileAsync("emailVerification.html", {
      code: code,
    });
    // Generated email id
    const generateEmailId = nanoid();
    // store in redis
    await redisVerification.set(
      `EMAILVERIFY:${email}:${generateEmailId}`,
      email,
      "EX",
      config.emailVerificationExpiration
    );
    //call sendinblue api
    await axios({
      method: "POST",
      url: "https://api.sendinblue.com/v3/smtp/email",
      headers: {
        "Content-Type": "application/json",
        "api-key": config.sendinblueApiKey,
        Accept: "application/json",
      },
      data: {
        sender: {
          name: "Botly",
          email: "info@botly.trade",
        },
        to: [
          {
            email,
          },
        ],
        subject: "Botly Email Verification",
        htmlContent: html,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

sendMailQueue.process(async (job) => {
  console.log("Email Worker Started.");
  return await sendMail(job.data.email);
});
