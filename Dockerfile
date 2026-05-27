# Multi-stage build: build assets with npm, then run the server from the build output
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . ./
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
RUN npm ci --only=production --legacy-peer-deps
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","dist/server.cjs"]
