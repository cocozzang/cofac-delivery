FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm i -g pnpm
RUN pnpm i

COPY apps/user apps/user
COPY libs libs
COPY proto proto
COPY types types

RUN pnpm build user

CMD ["pnpm", "start:dev", "user"]

FROM node:22-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=development /app/dist ./dist

COPY proto proto

CMD ["node", "dist/apps/user/main"]




