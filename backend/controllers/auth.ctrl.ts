import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import prisma from "../config/prisma";

export async function SignUp(req: FastifyRequest, res: FastifyReply) {
  const { name, email, password }: any = req.body;
  console.log({ name, email, password });
  if (!name || !email || !password) {
    return res.status(400).send();
  }
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (existingUser) {
    res.status(400);
    // return { message: "user already exist" };
  }
  const hashedPwd = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      password: hashedPwd,
      email,
    },
    omit: {
      password: true,
    },
  });
  await req.logIn(user);
  res.status(201);
  return user;
}
