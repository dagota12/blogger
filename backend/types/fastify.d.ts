import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface PassportUser {
    id: string;
  }
  interface FastifyInstance {
    auth: (req: FastifyRequest, res: FastifyReply, next: NextFunction) => void;
  }
}
