# Stage 1: Build
FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm start

# Stage 2: Run
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/frontend/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
