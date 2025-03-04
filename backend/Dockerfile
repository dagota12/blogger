# Use official Bun image
FROM oven/bun:1 AS base

WORKDIR /app

# Set the database URL as an environment variable
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Copy package files first for better caching
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy Prisma files correctly
COPY prisma ./prisma/

# Generate Prisma Client
RUN bunx prisma generate

# Copy the rest of the app
COPY . .

# Expose the port
EXPOSE 3002

# Set production environment
ENV NODE_ENV=production

# Run the application
CMD ["bun", "run", "index.ts"]
