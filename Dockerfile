FROM node:14.10.1-stretch AS test

RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY .eslintrc.js /app/
COPY webhook.js /app/
COPY utils/ /app/utils/
COPY test /app/test

FROM node:14.10.1-stretch AS build
RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install --only=prod
COPY webhook.js /app/

EXPOSE 5000
CMD ["node", "webhook"]
