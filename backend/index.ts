import fastify from "fastify";

import cors from "@fastify/cors";
import { httpErrors } from "@fastify/sensible";
import prisma from "./cofig/prisma";

//bun load's env no confing needed
import { ALLOWD_ORIGNS } from "./cofig/constants";
import { userRoutes } from "./routes/post.route";

const PORT: number = Number(process.env.PORT) || 3002;

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

//register route
app.register(userRoutes);

app.register(cors, {
  origin: ALLOWD_ORIGNS,
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
          _count: {
            select: { likes: true },
          },
        },
      },
    },
  });

  const likes = await prisma.like.findMany({
    where: {
      userId: FAKE_USER_ID,
      commentId: {
        in: posts?.comments.map((post) => post.id),
      },
    },
  });

  return {
    ...posts,
    comments: posts?.comments.map((comment) => {
      const { _count, ...rest } = comment;
      return {
        ...rest,
        liked: likes.some((like) => like.commentId === comment.id),
        likeCount: _count.likes,
      };
    }),
  };
});

//get comments
app.post("/posts/:id/comments", async (req, res) => {
  const { message, parentId, postId }: any = req.body;
  if (!message || !message.trim()) {
    res.send(httpErrors.badRequest("message is required!"));
  }

  const comment = await prisma.comment.create({
    data: {
      userId: FAKE_USER_ID ?? "",
      message,
      parentId,
      postId,
    },
    select: COMMENT_SELECT_FIELDS,
  });

  return {
    ...comment,
    liked: false,
    likeCount: 0,
  };
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

app.post("/posts/:postId/comments/:commentId/like", async (req, res) => {
  const { postId, commentId }: any = req.params;
  const userId = FAKE_USER_ID ?? "";

  const like = await prisma.like.findUnique({
    where: {
      userId_commentId: { userId, commentId },
    },
  });

  if (like === null) {
    await prisma.like.create({ data: { userId, commentId } });
    return { addLike: true };
  }

  await prisma.like.delete({
    where: { userId_commentId: { userId, commentId } },
  });
  return { addLike: false };
});

//delete comment
app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId }: any = req.params;
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { userId: true },
  });

  if (comment?.userId !== FAKE_USER_ID) {
    return res.send(
      httpErrors.unauthorized(
        "You do not have permission to delete this message"
      )
    );
  }

  return await prisma.comment.delete({
    where: { id: commentId, postId },
    select: { id: true },
  });
});

app.listen({ port: PORT }, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("server started!");
});
