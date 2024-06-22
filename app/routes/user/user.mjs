import fp from "fastify-plugin";
import { ObjectId } from "mongodb";
import UserService from "../../services/user.service.mjs";
import userSchema from "../../schema/user.schema.mjs";

async function apiUser(fastify, options) {
  const userService = new UserService(fastify.mongo.db);

  // Create user
  fastify.post("/users", {
    schema: {
      body: userSchema,
      response: {
        201: {
          description: "User created successfully",
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { username, email, password } = request.body;

      try {
        const userId = await userService.createUser(username, email, password);

        reply.code(201).send({
          id: userId,
          username,
          email,
        });
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({ error: "User creation failed" });
      }
    },
  });

  // Get all users
  fastify.get("/users", async (request, reply) => {
    try {
      const users = await userService.getAllUsers();
      reply.send(users);
    } catch (err) {
      fastify.log.error(err);
      reply.code(500).send({ error: "Failed to get users" });
    }
  });

  // Get user by id
  fastify.get("/users/:id", async (request, reply) => {
    const { id } = request.params;

    try {
      const user = await userService.getUserById(id);

      if (!user) {
        reply.code(404).send({ error: "User not found" });
        return;
      }

      reply.send(user);
    } catch (err) {
      fastify.log.error(err);
      reply.code(500).send({ error: "Failed to get user" });
    }
  });

  // Update user
  fastify.put("/users/:id", {
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
        },
      },
      body: {
        type: "object",
        properties: {
          username: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const { username, email, password } = request.body;

      try {
        const success = await userService.updateUser(
          id,
          username,
          email,
          password
        );

        if (!success) {
          reply.code(404).send({ error: "User not found" });
          return;
        }

        reply.send({ message: "User updated successfully" });
      } catch (err) {
        fastify.log.error(err);
        reply.code(500).send({ error: "Failed to update user" });
      }
    },
  });

  // Delete user
  fastify.delete("/users/:id", async (request, reply) => {
    const { id } = request.params;

    try {
      const success = await userService.deleteUser(id);

      if (!success) {
        reply.code(404).send({ error: "User not found" });
        return;
      }

      reply.send({ message: "User deleted successfully" });
    } catch (err) {
      fastify.log.error(err);
      reply.code(500).send({ error: "Failed to delete user" });
    }
  });
}

export default fp(apiUser);
