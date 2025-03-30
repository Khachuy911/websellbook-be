FROM node:18-apline

RUN mkdir /app
WORKDIR /app

ADD ./ /app

RUN npm install

ENV host 0.0.0.0
EXPOSE 8000

CMD ['npm', 'run', 'start']