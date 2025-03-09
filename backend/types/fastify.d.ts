import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface PassportUser {
    id: string;
  }
}
