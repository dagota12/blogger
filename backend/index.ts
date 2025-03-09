import type { SessionUser } from "./types/types.ts";
import fastify, { type FastifyReply, type FastifyRequest } from "fastify";

import cors from "@fastify/cors";
import middleware, { type NextFunction } from "@fastify/middie";
import passport from "./config/passport.ts";
import fastifyCookie from "@fastify/cookie";
import session from "@fastify/secure-session";
import { Strategy as LocalStrategy } from "passport-local";

import fp from "fastify-plugin";

//bun load's env no confing needed
import { ALLOWD_ORIGNS } from "./config/constants.ts";
import { postsRoute } from "./routes/post.route";
import { authRoute } from "./routes/auth.route";
import SQLiteStore from "connect-sqlite3";
import type { User } from "@prisma/client";
import prisma from "./config/prisma.ts";
import fastifySensible from "@fastify/sensible";
const PORT: number = Number(process.env.PORT) || 3002;
const app = fastify({
  logger: {
    transport: {
      target: "pino-pretty", // Pretty print logs
      options: {
        colorize: true, // Add colors to logs
        translateTime: "HH:MM:ss Z", // Format timestamp
        ignore: "hostname,req,reqId,res", // Ignore unnecessary fields
      },
    },
  },
});
app.register(fastifySensible);
app.decorate(
  "auth",
  function (req: FastifyRequest, res: FastifyReply, next: NextFunction) {
    console.log(req.user);
    if (!req.user?.id) {
      return res.unauthorized("login first");
    }
    // res.status(401).send();
    next();
    return;
  }
);
// app.setErrorHandler((error, request, reply) => {
//   console.error("🔥 Error:", error); // Logs the actual error
//   reply.send();
// });

app.register(middleware);

app.register(fastifyCookie);
app.register(session, {
  key: Buffer.from(process.env.SESSION_KEY ?? "", "hex"),

  cookie: {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, //day
    secure: true,
  },
});
//init passport
app.register(passport.initialize());
app.register(passport.secureSession());

//config cors
app.register(cors, {
  origin: ALLOWD_ORIGNS,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
});

//register route
app.register(postsRoute);
app.register(authRoute);

app.listen({ port: Number(PORT), host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
