import {ComMoveRequest, ComMoveResponse} from '../models/COM.models';

// can not find it in ide but it works
importScripts('engine.js');

// eslint-disable-next-line
let Module: any; 
let getBestMove: (arg0: string) => number;

let unhandledRequest: ComMoveRequest | undefined = undefined;

Module.onRuntimeInitialized = () => {
    getBestMove = Module.cwrap('getBestMove', 'number', ['string']);

    if(unhandledRequest) {
        handleRequest(unhandledRequest);
    }
};

// Listen for messages from the main thread
addEventListener('message', (event) =>  {
    const request = event.data as ComMoveRequest;

    if(getBestMove === undefined) {
        console.log('Module not loaded yet. Pushing message to queue.');
        unhandledRequest = request;
        return;
    } else {
        handleRequest(request);
    }
});

function handleRequest(request: ComMoveRequest) {
    console.log('Request received by worker', request);

    const result = getBestMove(JSON.stringify(request));

    const response: ComMoveResponse = {
        move: result,
        comment: 'Move calculated by worker'
    };

    self.postMessage(response);
}
