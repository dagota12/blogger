import type {
  FastifyHttpOptions,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import prisma from "../config/prisma";
import { COMMENT_SELECT_FIELDS, FAKE_USER_ID } from "../config/constants";
import { httpErrors } from "@fastify/sensible";
import type { NextFunction } from "@fastify/middie";

export async function postsRoute(app: FastifyInstance) {
  app.get("/posts", async (req, res) => {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        body: true,
      },
    });

    return posts;
  });
  app.post(
    "/posts",
    {
      preValidation: app.auth,
    },
    async (req, res) => {
      const { title, body }: any = req.body;
      if (!title || !body || !title.trim() || !body.trim()) {
        return res.status(400).send();
      }

      try {
        const post = prisma.post.create({
          data: {
            userId: req.user?.id ?? "",
            title,
            body,
          },
        });
        return post;
      } catch (err) {
        res.internalServerError("faild to create post");
      }
    }
  );
  //get post
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

    const likes = await prisma.commentLike.findMany({
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
  app.post(
    "/posts/:id/comments",
    {
      preValidation: app.auth,
    },
    async (req, res) => {
      const { message, parentId, postId }: any = req.body;
      if (!message || !message.trim()) {
        res.status(400);
        return { message: "message is required!" };
      }

      const comment = await prisma.comment.create({
        data: {
          userId: req.user?.id ?? "",
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
    }
  );

  //update comment
  app.put(
    "/posts/:postId/comments/:commentId",
    {
      preValidation: app.auth,
    },
    async (req, res) => {
      const { postId, commentId }: any = req.params;
      const { message }: any = req.body;
      if (!message || !message.trim()) {
        res.status(400);
        return { message: "message is required!" };
      }

      try {
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
      } catch (err) {
        res.internalServerError("Faild!");
      }
    }
  );

  //like comment
  app.post(
    "/posts/:postId/comments/:commentId/like",
    {
      preValidation: app.auth,
    },
    async (req, res) => {
      const { postId, commentId }: any = req.params;
      const userId = req.user?.id ?? "";

      try {
        const like = await prisma.commentLike.findUnique({
          where: {
            userId_commentId: { userId, commentId },
          },
        });

        if (like === null) {
          await prisma.commentLike.create({ data: { userId, commentId } });
          return { addLike: true };
        }

        await prisma.commentLike.delete({
          where: { userId_commentId: { userId, commentId } },
        });
      } catch (err) {
        res.internalServerError("Faild!");
      }
      return { addLike: false };
    }
  );

  //delete comment
  app.delete(
    "/posts/:postId/comments/:commentId",
    {
      preValidation: app.auth,
    },
    async (req, res) => {
      const { postId, commentId }: any = req.params;
      try {
        const comment = await prisma.comment.findUnique({
          where: { id: commentId },
          select: { userId: true },
        });
        if (!comment) throw Error("comment not found");
        if (comment?.userId !== req.user?.id) {
          res.status(403);
          return { message: "you cant perform this action" };
        }
      } catch (err: any) {
        console.log(err);
        return res.internalServerError(err.message);
      }

      return await prisma.comment.delete({
        where: { id: commentId, postId },
        select: { id: true },
      });
    }
  );
}
