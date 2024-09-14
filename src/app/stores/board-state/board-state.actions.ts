import {createAction, props} from '@ngrx/store';

import {StartParams} from "../../models/start-params.model";

export const init = createAction(
    '[Board State] init',
    props<{startParams: StartParams}>()
);

export const playerAttemptsMove = createAction(
    '[Board State] playerAttemptsMove',
    props<{move: number, onSouthSide: boolean}>()
);

export const comMove = createAction(
    '[Board State] comMove ',
    props<{move: number}>()
);

