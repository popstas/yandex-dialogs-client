FROM node:10-alpine
ENV NODE_ENV production
ENV IS_PROXY 1

WORKDIR /app
COPY . .
RUN apk --update add --no-cache git
RUN npm install
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000
CMD npm start
