import fp from "fastify-plugin";
import { MongoClient } from "mongodb";
import { asyncWait } from "../libs/asyncWait.mjs";

export async function mongodbPlugin(fastify, options) {
  fastify.decorate("mongo", null);
  fastify.decorate("db", null);

  async function mongodbConnection() {
    try {
      const mongo = new MongoClient(options.mongoUrl);
      await mongo.connect();
      console.log("Connected successfully to MongoDB");
      const db = mongo.db(options.dbName);

      fastify.mongo = mongo;
      fastify.db = db;
    } catch (err) {
      console.error(err);
    }
  }

  async function mongodbWatchDog() {
    // console.log("Mongodb Watchdog");
    let status;
    try {
      let count = await fastify.db.collection("connectionTest").findOne({});
      status = true;
    } catch (err) {
      status = false;
    }

    if (!status) {
      try {
        await fastify.mongo.close();
      } catch (err) {
        console.error("Error closing MongoDB connection:", err);
      }
      await mongodbConnection();
    }
    await asyncWait(5000);
    await mongodbWatchDog();
  }

  await mongodbConnection();
  mongodbWatchDog();
}

export default fp(mongodbPlugin);
