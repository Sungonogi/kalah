import {signal} from '@angular/core';

import {PlayerType} from "../models/player-type.enum";

export const startParamsStoreMock = jasmine.createSpyObj(
    "StartParamsStore",
    ["readFromStorage"],
    {
        playerSouth: signal(PlayerType.Local),
        playerNorth: signal(PlayerType.EasyCom),
        seeds: signal(3),
        pits: signal(6),
    }
);

export const boardServiceMock = jasmine.createSpyObj(
    "BoardService",
    ["resetBoard", "resetCallbacks"],
    {
        boardPosition: signal(null),
        animatedBoardPosition: signal({gameOver: false}),
    }
);

export const mockBoardPosition = {
    pits: 6,
    southPits: Array(6).fill(3),
    northPits: Array(6).fill(3),
    southStore: 0,
    northStore: 0,
    southTurn: true,
    gameOver: false,
};