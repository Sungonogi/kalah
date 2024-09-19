import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';

import {PlayerType} from "../../models/player-type.enum";
import {StartParams} from '../../models/start-params.model';

const initialState: StartParams = {
    playerSouth: PlayerType.Local,
    playerNorth: PlayerType.EasyCom,
    seeds: 4,
    pits: 6
};

export const StartParamsStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods((store) => ({
        setStartParams(startParams: StartParams) {
            patchState(store, () => ({...startParams}));
        }
    }))
);