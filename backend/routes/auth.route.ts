import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { SignUp } from "../controllers/auth.ctrl";
import passport from "../config/passport";
import prisma from "../config/prisma";

export function authRoute(app: FastifyInstance) {
  app.post("/auth/signup", SignUp);
  app.post(
    "/auth/login",
    {
      preValidation: passport.authenticate("local", {
        authInfo: true,
      }),
    },
    () => {
      return { message: "login success" };
    }
  );
  app.get(
    "/auth/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );

  app.get(
    "/auth/github/callback",
    {
      preValidation: passport.authenticate("github", { authInfo: true }),
    },
    function () {
      return { message: "success" };
    }
  );

  app.post("/auth/logout", async (req, res) => {
    try {
      await req.logOut();
      res.clearCookie("session", { path: "/" });
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  });
  app.get("/auth/me", (req, res) => {
    if (!req.user?.id) {
      res.status(401);
      return { message: "Unauthorized" };
    }

    const user = prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
      omit: {
        password: true,
      },
    });
    return user;
  });
}
