import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { LoginUser } from "../controllers/auth.ctrl";

export function authRoute(app: FastifyInstance) {
  app.post("/auth/login", LoginUser);
}
