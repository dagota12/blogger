import passport from "@fastify/passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { SessionUser } from "../types/types";
import type { User } from "@prisma/client";

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

export default passport;
