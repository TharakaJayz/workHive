FROM node:20-alpine

WORKDIR /app

COPY package.json tsconfig.json prisma.config.ts ./
COPY prisma ./prisma
COPY generated ./generated
COPY src ./src

RUN npm install
RUN npx prisma generate --schema=prisma/schema.prisma

EXPOSE 8080

CMD ["npm", "run", "start"]
