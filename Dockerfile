
## STAGE 1

# Use a lightweight Node.js image as a base for building the frontend
FROM node:20.9.0-alpine as frontend-builder

# Sets and creates the working directory inside the container to /app/frontend
WORKDIR /app/frontend

# Copy from local OS frontend package.json
# and package-lock.json to the working directory
COPY frontend/package*.json ./

# Install dependencies defined in package-lock.json
RUN npm install

# Copy all frontend source code to the working directory
# node_modules excluded (.dockerignore)
COPY frontend .

# Run the build script defined in package.json to build the frontend
# builds app/frontend/dist in the container
RUN npm run build

## STAGE 2

# Start a new build stage with the same lightweight Node.js image
FROM node:20.9.0-alpine

# Set the working directory inside the container to /app/backend
WORKDIR /app/backend

# Copy backend package.json and package-lock.json to the working directory
COPY backend/package*.json ./

# Install dependencies for the backend
RUN npm install

# Copy all backend source code to the working directory
COPY backend .

# Copy the built frontend files from the frontend-builder stage
# to the directory serving frontend files in the backend
COPY --from=frontend-builder /app/frontend/dist /app/backend/frontend/dist

# Inform Docker that the container listens on the specified network port at runtime
EXPOSE 8080

# Define the command to run the backend server
CMD ["npm", "start"]