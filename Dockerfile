FROM node:10-alpine
ENV NODE_ENV production
ENV IS_PROXY 1

RUN apk --update add --no-cache git

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

WORKDIR /app
COPY . .
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000
CMD npm start
