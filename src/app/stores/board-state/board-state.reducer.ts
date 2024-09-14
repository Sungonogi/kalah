import {createReducer, on} from '@ngrx/store';

import {checkLegalMove, initBoardPosition, performLegalMove} from "../../models/board-position.model";
import {BoardState} from "../../models/board-state.model";
import {PlayerType} from "../../models/player-type.enum";
import {comMove, init, playerAttemptsMove} from "./board-state.actions";


export const initialState: BoardState = {
    initialized: false,
} as BoardState;

export const boardStateReducer = createReducer(
    initialState,
    on(init, (_state, {startParams}) => ({
        initialized: true,
        waitingForCPU: false,
        playerSouth: startParams.playerSouth,
        playerNorth: startParams.playerNorth,
        boardPosition: initBoardPosition(startParams.pits, startParams.seeds)
    })),
    on(playerAttemptsMove, (state, {move, onSouthSide}) => {
        if(!state.initialized){
            console.error('Game not initialized');
            return state;
        }

        if(state.boardPosition.gameOver){
            console.error('Game over');
            return state;
        }

        const player = onSouthSide ? state.playerSouth : state.playerNorth;
        if(player !== PlayerType.Local){
            console.error('Not your turn');
            return state;
        }

        const legal = checkLegalMove(state.boardPosition, move, onSouthSide);
        if(!legal){
            console.error('Game over or illegal move');
            return state;
        }

        state.boardPosition = performLegalMove(state.boardPosition, move);

        const newPlayer = state.boardPosition.southTurn ? state.playerSouth : state.playerNorth;
        state.waitingForCPU = newPlayer !== PlayerType.Local;

        return state;
    }),
    on(comMove, (state) => state)
);
