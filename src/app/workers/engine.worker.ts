import {ComMoveRequest, ComMoveResponse} from '../models/COM.models';

// can not find it in ide but it works
importScripts('engine.js');

// eslint-disable-next-line
let Module: any; 
let getBestMove: (arg0: string) => string;

let unhandledRequest: ComMoveRequest | undefined = undefined;

Module.onRuntimeInitialized = () => {
    getBestMove = Module.cwrap('getBestMove', 'string', ['string']);

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

    const result = getBestMove(JSON.stringify(request));
    const response = JSON.parse(result) as ComMoveResponse;

    self.postMessage(response);
}
