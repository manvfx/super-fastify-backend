import fp from "fastify-plugin";
import { Eta } from "eta";

export async function etaPlugin(fastify, options) {
  const eta = new Eta({ views: "./../templates" });
  
  fastify.decorateReply("view", async function (view, data) {
    this.type("text/html");
    this.send(await eta.renderFile(view, data));
  });
}

export default fp(etaPlugin);
