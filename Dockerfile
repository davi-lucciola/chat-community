# Build Frontend Stage
FROM node:22-alpine AS react-builder

WORKDIR /chat-community

COPY client/package.json client/package-lock.json ./

RUN npm install

COPY client/src ./src
COPY client/public ./public
COPY client/index.html client/vite.config.ts ./
COPY client/tsconfig.json client/tsconfig.app.json client/tsconfig.node.json ./

ARG VITE_API_URL='http://localhost:3333/api'
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Build Backend Stage
FROM node:22-alpine AS fastify-builder

WORKDIR /chat-community

COPY server/package.json server/package-lock.json ./

RUN npm install

COPY server/src ./src
COPY server/tsconfig.json ./

RUN npm run build

# Runtime Stage
FROM node:22-alpine AS runtime

WORKDIR /chat-community

COPY server/package.json server/package-lock.json ./

RUN npm install --omit=dev

COPY --from=react-builder /chat-community/dist ./dist
COPY --from=fastify-builder /chat-community/dist ./

EXPOSE 3333

ENTRYPOINT [ "node", "main.js" ]