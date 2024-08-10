FROM --platform=linux/amd64 node:20.15-alpine
RUN apk update && apk add python3 make g++ libpq-dev git gcompat
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm i
COPY . .