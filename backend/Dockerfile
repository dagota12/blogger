# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /app
ARG DATABASE_URL

COPY package.json bun.lockB ./
COPY prisma ./prsima
RUN bun install


COPY . .

ENV NODE_ENV=production


EXPOSE 3002
CMD [ "bun", "run", "index.ts" ]