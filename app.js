import express from 'express';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { rateLimiterMiddleWare } from './middleware/rate-limiter.js';
import { gameStateRouter } from './routes/gameState.routes.js';
import { forgotPassword } from './controllers/gameState.js';
import { forwardToBackend } from './backendCall.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();
app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH,  OPTIONS'
  );
  res.setHeader('Access-Control-Expose-Headers', '*');
  next();
});
app.set('etag', false); // for avoiding 304 not changed response
app.disable('x-powered-by'); // for hiding being an express
// app.use(rateLimiterMiddleWare);

app.use((req, res, next) => {
  if ('OPTIONS' === req.method) res.sendStatus(200);
  else {
    console.log('Requset method and url : ', req.method, req.originalUrl);
    console.log('Requset body:', req.body);
    next();
  }
});

app.use('/gameState', gameStateRouter);
app.use('/user/forgot', forgotPassword);
app.use('/disconnection/sitOut', forwardToBackend);
app.use('/requests', forwardToBackend);
app.use('/tables', forwardToBackend);
app.use('/user', forwardToBackend);
app.use('/payments', forwardToBackend);

app.use(express.static(path.join(__dirname, 'build')));
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});
