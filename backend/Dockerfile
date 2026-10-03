FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=3275
EXPOSE 3275

CMD ["node", "server.js"]
