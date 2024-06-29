import { config } from "../../config.mjs";
import Queue from "bull";
import axios from "axios";
import { Eta } from "eta";
import { MongoClient } from "mongodb";

const client = new MongoClient(config.mongoUrl);

const eta = new Eta({ views: "./templates" });

// Initiating the Queue
const queue = new Queue("registrationQueue", config.redis_bull_url);

async function registrationUserData({ userId, email, registrationTime }) {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB worker");

    const db = client.db(config.dbName);
    const collection = db.collection("users");

    const insertResult = await collection.insertOne({
      _id: userId,
      email,
      plan: "regular",
      planExpireTs: null,
      authResetTs: new Date().toISOString(),
      createdAt: registrationTime,
      status: "active",
      nickname: email.split("@")[0], // Assign nickname from email
      bio: "",
      public: true,
      subscribable: false,
      exchanges: [], // empty list
    });

    console.log("Inserted documents =>", insertResult);

    // Send email and configure template engine
    const html = await eta.renderFileAsync("welcomeLetter.html", { email });

    await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: {
          name: "Super Api",
          email: "noreply@manvfx.trade",
        },
        to: [{ email }],
        subject: "Welcome to Botly",
        htmlContent: html,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": config.sendinblueApiKey,
          Accept: "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error during registration user data processing:", error);
  } finally {
    await client.close();
  }
}

queue.process(async (job, done) => {
  try {
    console.log("Worker Started.");
    console.log("Worker job.", job);
    const { userId, email, registrationTime } = job.data;
    await registrationUserData({ userId, email, registrationTime });
    done();
  } catch (error) {
    console.error("Error in job processing:", error);
    done(error);
  }
});
