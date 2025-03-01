import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import dotenv from "dotenv";

import cors from "@fastify/cors";
import { httpErrors } from "@fastify/sensible";

dotenv.config(); //load env

const PORT: number = Number(process.env.PORT) || 3002;
const prisma = new PrismaClient();

const FAKE_USER_ID = (await prisma.user.findFirst({ where: { name: "Kyle" } }))
  ?.id;

const COMMENT_SELECT_FIELDS = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

const app = fastify({ logger: false });
app.register(cors, {
  origin: [
    process.env.CLIENT_ORIGIN || "http://localhost:5173",
    "http://10.240.89.22:5173/",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
});

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
        select: {
          ...COMMENT_SELECT_FIELDS,
        },
      },
    },
  });

  return posts;
});
app.post("/posts/:id/comments", async (req, res) => {
  const { message, parentId, postId }: any = req.body;
  if (!message || !message.trim()) {
    res.send(httpErrors.badRequest("message is required!"));
  }

  return await prisma.comment.create({
    data: {
      userId: FAKE_USER_ID,
      message,
      parentId,
      postId,
    },
    select: COMMENT_SELECT_FIELDS,
  });
});

app.put("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId }: any = req.params;
  const { message }: any = req.body;

  if (!message || !message.trim()) {
    res.send(httpErrors.badRequest("message is required!"));
  }

  return await prisma.comment.update({
    where: {
      id: commentId,
      postId: postId,
    },
    data: {
      message,
    },
    select: {
      message: true,
    },
  });
});
app.listen({ port: PORT }, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("server started!");
});
