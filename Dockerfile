FROM node:9 AS test

RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY .eslintrc.js /app/
COPY connector.js /app/
COPY test /app/test

FROM node:9 AS build
RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install --only=prod
COPY connector.js /app/

EXPOSE 8000
CMD ["node", "connector"]
