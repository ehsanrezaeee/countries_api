ARG BASE_VERSION=latest
ARG RUNTIME_SLIM_VERSION=slim

# Use the official Node.js Docker image for building the app
FROM node:${BASE_VERSION} AS deps

# Create app directory
WORKDIR /home/app

# Copying package.json and package-lock.json
COPY package*.json ./

# Install pnpm globally
RUN npm install -g pnpm

# Install app dependencies ensuring the user has proper permissions
# If you're using a non-root user, you can remove the chown command
RUN pnpm install --loglevel verbose

# Copy the rest of your application's source code from your host to your image filesystem.
COPY . .

# Build the app (if your app requires a build step, e.g., TypeScript to JavaScript)
RUN pnpm build

# Use the official Node.js Docker slim image for running the app
FROM node:${RUNTIME_SLIM_VERSION} AS builder

# Create app directory
WORKDIR /home/app

# Copy only the necessary files from the build stage
# COPY --from=deps /home/app/node_modules ./node_modules
# COPY --from=deps /app/package*.json ./
COPY --from=deps /home/app/.next/standalone ./standalone
COPY --from=deps /home/app/public /home/app/standalone/public
COPY --from=deps /home/app/.next/static /home/app/standalone/.next/static

# Install PM2 globally
RUN npm install pm2 -g

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 3000

# Run the app using PM2 instead of the node command
CMD ["pm2-runtime", "./standalone/server.js"]
