# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /app
ARG DATABASE_URL

COPY package.json bun.lockb ./
COPY prisma ./prsima/
RUN bun install
RUN bun run migrate:prod

COPY . .

ENV NODE_ENV=production


EXPOSE 3002
CMD [ "bun", "run", "index.ts" ]