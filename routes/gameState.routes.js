import express from 'express';

import {
  addGameState,
  evaluateHand,
  getGameState,
  playerSittingOut,
  restartGame,
} from '../controllers/gameState.js';
import { forwardToBackend } from '../backendCall.js';

export const gameStateRouter = express.Router();

gameStateRouter.route('/:id').get(getGameState);

gameStateRouter.route('').post(addGameState);
gameStateRouter.route('/restart').post(restartGame);
gameStateRouter.route('/evaluate').post(evaluateHand);

gameStateRouter.route('/sitOut').patch(playerSittingOut);
gameStateRouter.route('/*').patch(forwardToBackend);
