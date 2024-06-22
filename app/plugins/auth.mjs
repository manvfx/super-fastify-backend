import fp from "fastify-plugin";
import { V4 } from "paseto";
import { config } from "../../config.mjs"; // Ensure config is imported

export async function authPlugin(fastify, options) {
  fastify.decorateRequest("user", null);
  fastify.decorateRequest("role", null);
  fastify.decorateReply("accessDenied", function () {
    return this.status(401).send({ error: "Access denied" });
  });
  fastify.decorate("accessDeniedIfRoleNotIn", function (permittedRoles) {
    return function (request, reply, done) {
      if (!permittedRoles.includes(request.role)) {
        return reply.accessDenied();
      }
      done();
    };
  });

  fastify.addHook("onRequest", async (request, reply) => {
    if (request.headers.hasOwnProperty("auth")) {
      try {
        let token = request.headers.auth;
        let payload = await V4.verify(token, config.pasetoSecret);
        request.user = payload.user;
        request.role = payload.role;
      } catch (err) {
        console.error("Error verifying token:", err);
        // Handle invalid signature or other errors as needed
      }
    }
  });
}

export default fp(authPlugin);
