FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p logs

ENV NODE_ENV=production
EXPOSE 5500

CMD ["node", "index.js"]
