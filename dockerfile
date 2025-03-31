FROM node:18-apline

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .

ENV host 0.0.0.0
EXPOSE 8000

CMD ['npm', 'run', 'start']