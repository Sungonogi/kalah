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
        waitingForCPU: true,
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
            console.error('Not your side');
            return state;
        }

        if(state.boardPosition.southTurn !== onSouthSide){
            console.error('Not your turn');
            return state;
        }

        const legal = checkLegalMove(state.boardPosition, move, onSouthSide);
        if(!legal){
            console.error('Illegal move');
            return state;
        }

        const newBoardPosition = performLegalMove(state.boardPosition, move);

        const newPlayer = newBoardPosition.southTurn ? state.playerSouth : state.playerNorth;
        const newWaitingForCPU = newPlayer !== PlayerType.Local;

        return {
            ...state,
            boardPosition: newBoardPosition,
            waitingForCPU: newWaitingForCPU
        };
    }),
    on(comMove, (state, {move}) => {
        const newBoardPosition = performLegalMove(state.boardPosition, move);
        const newPlayer = newBoardPosition.southTurn ? state.playerSouth : state.playerNorth;
        const newWaitingForCPU = newPlayer !== PlayerType.Local;
        return {
            ...state,
            boardPosition: newBoardPosition,
            waitingForCPU: newWaitingForCPU
        };
    })
);
