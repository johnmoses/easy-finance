# Dockerfile for Next.js application

# 1. Build Stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /web

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN yarn build

# 2. Production Stage
FROM node:18-alpine

# Set working directory
WORKDIR /web

# Copy built assets from the builder stage
COPY --from=builder /web/.next ./.next
COPY --from=builder /web/public ./public
COPY --from=builder /web/package.json ./package.json
COPY --from=builder /web/yarn.lock ./yarn.lock

# Install production dependencies
RUN yarn install --production

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start"]
