import type { FastifyReply, FastifyRequest } from "fastify";

export function LoginUser(req: FastifyRequest, res: FastifyReply) {
  return { message: "logged in" };
}
