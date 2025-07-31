FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm
RUN pnpm i

COPY . .

CMD ["pnpm", "start:dev", "user"]


