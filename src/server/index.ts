import express, { Request, Response } from 'express';
import expressWs from 'express-ws';
import * as bodyParser from 'body-parser';
import { newWebSocketClient } from './api';

function logger(request: Request, response: Response, next: Function) {
  console.log(`${request.method} ${request.path}`);
  next();
}

const { app } = expressWs(express());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port: number = Number(process.env.PORT) || 80;

app.use(logger);
app.use(express.static('dist'));
app.get('/', (req, res) => {
  console.log('sending index.html');
  res.sendFile('/dist/index.html');
});
app.ws('/ws', newWebSocketClient);
app.listen(port);
console.log(`App listening on ${port}`);
