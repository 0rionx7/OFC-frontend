import { createAdapter } from '@socket.io/mongo-adapter';
import { Server } from 'socket.io';
import debug from 'debug';

import { app } from './app.js';
import { adapterCollection } from './mongoConn.js';

const port = normalizePort(process.env.PORT || '3200');
app.set('port', port);

export const server = app.listen(app.get('port'), () =>
  console.log(`Express server listening on port:` + server.address().port)
);
export const socketIoServer = new Server(server, {
  connectionStateRecovery: { maxDisconnectionDuration: 1 * 60 * 1000 },
  pingInterval: 7000,
  pingTimeout: 40000,
  cors: { origin: '*' },
});
socketIoServer.adapter(
  createAdapter(adapterCollection, { addCreatedAtField: true })
);
socketIoServer.on('connection', socket => console.log(socket.id));

server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
