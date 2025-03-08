import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { LoginUser } from "../controllers/auth.ctrl";
import passport from "../config/passport";

export function authRoute(app: FastifyInstance) {
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
    console.log(req.user);
    return { user: req.user };
  });
}
