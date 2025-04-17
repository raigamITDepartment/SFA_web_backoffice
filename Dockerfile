# Use Node.js for building the React app
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source
COPY . .

# Build the application
RUN npm run build

# Use Nginx to serve the built app
FROM nginx:1.23.1-alpine

# Copy the built app from the builder stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
