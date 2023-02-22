FROM cypress/base:14.21.1

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install

RUN $(npm bin)/cypress verify
CMD npm run e2e-server