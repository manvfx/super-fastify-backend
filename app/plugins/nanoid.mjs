// import { config } from "../../config.mjs";
import fp from "fastify-plugin";
import { nanoid } from "nanoid";

export async function nanoidPlugin(fastify, options) {
  function nanoidCreate() {
    return nanoid();
  }
  fastify.decorate("nanoid", nanoidCreate);
}

export default fp(nanoidPlugin);
