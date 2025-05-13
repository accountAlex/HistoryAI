FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install js-cookie && npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
