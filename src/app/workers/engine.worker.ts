import {ComMoveRequest, ComMoveResponse} from '../models/COM.models';

// can not find it in ide but it works
// eslint-disable-next-line
// @ts-ignore
importScripts('engine.js');

let getBestMove: (arg0: string) => string;
let unhandledRequest: ComMoveRequest | undefined = undefined;

// can not find it in the id because it gets Module from engine.js
// eslint-disable-next-line
// @ts-ignore
self.Module.onRuntimeInitialized = () => {

    // eslint-disable-next-line
    // @ts-ignore
    getBestMove = self.Module.getBestMove;

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
