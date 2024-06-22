import * as Eta from "eta";
import fp from "fastify-plugin";

export async function etaPlugin(fastify, options) {
  Eta.configure({ views: "./views" });

  fastify.decorateReply("view", async function (view, data) {
    this.type("text/html");
    this.send(await Eta.renderFile(view, data));
  });
}

export default fp(etaPlugin);
