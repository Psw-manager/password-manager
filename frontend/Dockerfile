# Use the official Node.js image as a base
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the Next.js application
RUN npm run build

# Check if the build was successful
RUN ls -al .next  # This should list the contents of the .next directory

# Use a new image for serving the built application
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the build output from the previous stage
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Start the application
CMD ["npm", "start"]
