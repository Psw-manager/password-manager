# Use the official Node.js 18 image as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if it exists) to the working directory
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set the command to start the Next.js application
CMD ["npm", "run", "dev"]
