import addRoles from "./migrations/addRoles";
import invitations from "./migrations/invitations";
import users from "./migrations/users";

import type { FastifyInstance } from "fastify";

const runMigrations = async (fastify: FastifyInstance) => {
  await fastify.slonik.connect(async (connection) => {
    await connection.query(users(fastify.config));
    await connection.query(invitations(fastify.config));
    await connection.query(addRoles(fastify.config));
  });
};

export default runMigrations;
