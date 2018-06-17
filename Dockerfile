FROM node:10-alpine
ENV NODE_ENV production

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000
CMD npm start
