// @ts-ignore
import express from 'express';
import * as bodyParser from 'body-parser';
import logger from './middleware';
import api from './api';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port: number = Number(process.env.PORT) || 80;

app.use(logger);
app.use(express.static('dist'));
app.get('/', (req, res) => {
  console.log('sending index.html');
  res.sendFile('/dist/index.html');
});

app.use('/api', api);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`App listening on ${port}`);
