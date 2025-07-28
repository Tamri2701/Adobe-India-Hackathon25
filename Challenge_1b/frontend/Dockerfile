# 1. Build frontend
FROM node:18-alpine as build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# 2. Serve using nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Optionally override nginx config for SPA routing:
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
