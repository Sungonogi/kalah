import {withStorageSync} from "@angular-architects/ngrx-toolkit";
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';

import {PlayerType} from "../../models/player-type.enum";

export interface StartParams {
    playerSouth: PlayerType
    playerNorth: PlayerType;
    seeds: number;
    pits: number;
}

const initialState: StartParams = {
    playerSouth: PlayerType.Local,
    playerNorth: PlayerType.EasyCom,
    seeds: 3,
    pits: 6
};

export const StartParamsStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods((store) => ({
        setStartParams(startParams: StartParams) {
            patchState(store, () => ({...startParams}));
        }
    })),
    withStorageSync({
        key: 'start-params',
        storage: () => localStorage
    })
);