import axios from 'axios';

import { backEndUrl } from './backendCall.js';
import { socketIoServer } from './server.js';

export function socketListen(socket) {
  console.log('socket connected with id:', socket.id);

  socket.on('postMessage', ({ gameId, playerName, message }) =>
    socketIoServer.in(gameId).emit('newMessage', { playerName, message })
  );

  socket.on('disconnecting', async reason => {
    console.log(`disconnecting ${socket.id} due to :${reason}`);
    const [socketId, gameId] = [...socket.rooms]; // (rooms is a Set)
    if (gameId) {
      try {
        console.log('disconnection_SitOut');
        await axios({
          method: 'patch',
          url: backEndUrl + '/disconnection/sitOut',
          data: { gameId, socketId },
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        const { status, data } = error.response || {};
        console.log('🌞 disconnection SitOut error', { status, data });
      }
    }
    try {
      console.log('disconnection_LogOut');
      await axios({
        method: 'post',
        url: backEndUrl + '/user/logOut',
        data: { socketId },
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      const { status, data } = error.response || {};
      console.log(`🌞 disconnection logOut error`, { status, data });
    }
  });
}
