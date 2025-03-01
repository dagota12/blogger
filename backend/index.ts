import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import dotenv from "dotenv";

import cors from "@fastify/cors";

dotenv.config();
const app = fastify({ logger: false });

app.register(cors, {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
});
const PORT: number = Number(process.env.PORT) || 3002;
const prisma = new PrismaClient();

app.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  return posts;
});
app.get("/posts/:id", async (req, res) => {
  const { id }: any = req.params;
  const posts = await prisma.post.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      body: true,
      title: true,
      comments: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          likes: true,
        },
      },
    },
  });

  return posts;
});

app.listen({ port: PORT }, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("server started!");
});
