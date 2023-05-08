FROM node:16
WORKDIR /app/backend

COPY package.json .
RUN npm install

COPY . .
EXPOSE 4000
CMD [ "npm", "start" ]