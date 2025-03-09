import passport from "@fastify/passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { SessionUser } from "../types/types";
import bcrypt from "bcrypt";
import type { User } from "@prisma/client";
import { Strategy as GitHubStrategy } from "passport-github2";
import prisma from "./prisma";
import { useFunc } from "../dist";
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (user?.email !== email) {
        return done(null, false, { message: "incorrect crediential1" });
      }
      if (!user?.password)
        return done(null, false, { message: "u dont have pwd" });

      const verifyPwd = await bcrypt.compare(password, user.password);

      if (!verifyPwd)
        return done(null, false, { message: "incorrect crediential2" });

      return done(null, user);
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: "http://localhost:8080/auth/github/callback",
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) {
      console.log({ accessToken, refreshToken, em: profile });

      const data = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const emails = await data.json();
      const userEmail = emails.find(
        (email: any) => email.primary === true && email.verified === true
      )?.email;
      console.log(emails);

      if (!userEmail) {
        return done(false, { message: "don't have proper email" });
      }
      const existingUser = await prisma.user.findFirst({
        where: {
          email: userEmail,
        },
      });
      if (existingUser) {
        return done(null, { id: existingUser.id });
      }
      const createdUser = await prisma.user.create({
        data: {
          name: profile.displayName,
          email: userEmail,
          profile_img: profile.photos[0]?.value,
        },
      });
      console.log(userEmail);

      done(null, { id: createdUser.id });
    }
  )
);

passport.registerUserSerializer<User, SessionUser>(async function (user, req) {
  console.log("serial", user);

  return user;
});
//deserialize

passport.registerUserDeserializer(async (user, request) => {
  return user;
});

export default passport;
