import {createReducer, on} from '@ngrx/store';

import {BoardPosition} from "../../models/board-position.class";
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
        gameOver: false,
        playerSouth: startParams.playerSouth,
        playerNorth: startParams.playerNorth,
        boardPosition: new BoardPosition(startParams.pits, startParams.seeds)
    })
    ),
    on(playerAttemptsMove, (state, {move, onSouthSide}) => {
        if(!state.initialized){
            console.error('Game not initialized');
            return state;
        }

        if(state.gameOver){
            console.error('Game over');
            return state;
        }

        const player = onSouthSide ? state.playerSouth : state.playerNorth;
        if(player !== PlayerType.Local){
            console.error('Not your turn');
            return state;
        }

        const legal = state.boardPosition.checkLegalMove(move, onSouthSide);
        if(!legal){
            console.error('Illegal move');
            return state;
        }

        state.boardPosition.performLegalMove(move);

        const newPlayer = state.boardPosition.southTurn ? state.playerSouth : state.playerNorth;
        state.waitingForCPU = newPlayer !== PlayerType.Local;

        return state;
    }),
    on(comMove, (state) => state)
);
