import type { SessionUser } from "./types/types.ts";
import fastify from "fastify";

import cors from "@fastify/cors";
import middleware from "@fastify/middie";
import passport from "@fastify/passport";
import fastifyCookie from "@fastify/cookie";
import session from "@fastify/secure-session";
import { Strategy as LocalStrategy } from "passport-local";

//bun load's env no confing needed
import { ALLOWD_ORIGNS } from "./cofig/constants";
import { postsRoute } from "./routes/post.route";
import { authRoute } from "./routes/auth.route";
import SQLiteStore from "connect-sqlite3";
import type { User } from "@prisma/client";
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

app.setErrorHandler((error, request, reply) => {
  console.error("🔥 Error:", error); // Logs the actual error
  reply
    .status(500)
    .send({ error: "Internal Server Error", message: error.message });
});

app.register(middleware);

app.register(fastifyCookie);
app.register(session, {
  key: Buffer.from(process.env.SESSION_KEY ?? "", "hex"),

  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, //day
    secure: false,
  },
});
app.register(passport.initialize());
app.register(passport.secureSession());
//init passport

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, passowrd, done) => {
    if (email === "bob") {
      return done(null, { username: "bob", id: 1 });
    }
    return done(null, false, { message: "east side" });
  })
);
passport.registerUserSerializer<User, SessionUser>(async function (user, req) {
  return { id: 2, email: user.email, name: "abe" };
});
//deserialize

passport.registerUserDeserializer(async (id, request) => {
  return { username: "bob", id: 1 };
});

//config cors
app.register(cors, {
  origin: ALLOWD_ORIGNS,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
});

//register route
app.register(postsRoute);
app.register(authRoute);

app.post(
  "/login",
  {
    preValidation: passport.authenticate("local", {
      authInfo: true,
    }),
  },
  () => {
    return { message: "login success" };
  }
);
app.post("/logout", async (req, res) => {
  try {
    await req.logOut();
    res.clearCookie("session", { path: "/" });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});
app.get("/me", (req, res) => {
  console.log(req.user);
  return { user: req.user };
});
app.listen({ port: PORT }, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("server started!");
});
