# monodog Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm && pnpm install --frozen-lockfile

EXPOSE 3000
CMD ["pnpm", "dev"]