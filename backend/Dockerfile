FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL:-postgresql://postgres:postgres@db:5432/jobdb}

RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "start"]