import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {StartParams} from '../../models/start-params.model';
import {PlayerType} from "../../models/player-type.enum";

interface StartParamsState {
    defined: boolean;
    startParams: StartParams;
};

const initialState: StartParamsState = {
    defined: false,
    startParams: {
        playerSouth: PlayerType.Local,
        playerNorth: PlayerType.EasyCPU,
        seeds: 4,
        pits: 6
    }
};

export const StartParamsStore = signalStore(
        {providedIn: 'root'},
        withState(initialState),
        withMethods((store) => ({
            setStartParams(startParams: StartParams){
                patchState(store, () => ({ defined: true, startParams: startParams}));
            }
        }))
);