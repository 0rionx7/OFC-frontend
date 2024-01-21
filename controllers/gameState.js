import { socketIoServer } from '../server.js';
import { backendCall } from '../backendCall.js';
import { sendEmail } from '../nodmailer.js';

export const getGameState = async (req, res) => {
  try {
    const gameState = await backendCall(req);
    res.send(gameState);
  } catch (error) {
    console.log(`🌞 ${req.originalUrl} controler error`, error);
    res.status(500).json(error.data);
  }
};
export const restartGame = async (req, res) => {
  try {
    const { tableName } = await backendCall(req);
    const gameId = req.body.gameId.toString();
    res.status(201).send({ tableName, gameId });
  } catch (error) {
    console.log(`🌞 ${req.originalUrl} controler error`, error);
    res.status(500).json(error.data);
  }
};
export const addGameState = async (req, res) => {
  try {
    const response = await backendCall(req);
    res.status(201).send(response);
  } catch (error) {
    console.log(`🌞 ${req.originalUrl} controler error`, error);
    res.status(500).json(error.data);
  }
};
export const evaluateHand = async (req, res) => {
  try {
    const evaluatedHand = await backendCall(req);
    res.send(evaluatedHand);
  } catch (error) {
    console.log(`🌞 ${req.originalUrl} controler error`, error);
    res.status(400).json(error.data);
  }
};
export const playerSittingOut = async (req, res) => {
  try {
    await backendCall(req);
    if (!req.body.timedout) {
      const socket = socketIoServer.sockets.sockets.get(req.body.socketId);
      if (socket)
        [...socket.rooms].slice(1).forEach(room => socket.leave(room));
    }
    const gameId = req.body.gameId;
    res.send({ gameId, id: gameId, tableName: req.body.tableName });
  } catch (error) {
    console.log(`🌞 ${req.originalUrl} controler error`, error);
    res.status(500).json('🌞 Server Error');
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { tempPassword } = await backendCall(req);
    sendEmail(tempPassword);
    res.status(200).json('check your email');
  } catch (error) {
    console.log('🌞 forgotPassword controller error', error);
    res.status(500).send(error.data);
  }
};
