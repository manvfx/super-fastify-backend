import fp from "fastify-plugin";
import { V4 } from "paseto";
import { config } from "../../../config.mjs";

async function getUserProfile(userId) {
  // Implement your logic to fetch user profile from database or any other source
  // Example:
  // const user = await User.findById(userId);
  // return user;
  return { id: userId, name: "John Doe", email: "john.doe@example.com" };
}

async function userProfileHandler(request, reply) {
  try {
    // Get userId from authenticated request
    const userId = request.user;
    // Fetch user profile data
    const userProfile = await getUserProfile(userId);

    // Return the user profile
    reply.code(200).send(userProfile);
  } catch (error) {
    request.log.error(`Error fetching user profile: ${error.message}`);
    reply.code(500).send({ error: "Internal Server Error" });
  }
}

export async function apiUserProfile(fastify, options) {
  fastify.route({
    method: "GET",
    url: "/api/user/profile",
    preHandler: fastify.authPlugin,
    handler: userProfileHandler,
  });
}

export default fp(apiUserProfile);
