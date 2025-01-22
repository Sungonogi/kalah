// can not find it in ide but it works
importScripts('engine.js');

// eslint-disable-next-line
let Module: any; 

let getBestMove: (arg0: string) => number;
const unhandledMessages: string[] = [];

Module.onRuntimeInitialized = () => {
    getBestMove = Module.cwrap('getBestMove', 'number', ['string']);
    unhandledMessages.forEach(handleMessage);
};

// Listen for messages from the main thread
addEventListener('message', (event) =>  {
    const message = event.data.message;

    if(getBestMove === undefined) {
        console.log('Module not loaded yet. Pushing message to queue.');
        unhandledMessages.push(message);
        return;
    } else {
        handleMessage(message);
    }
});

function handleMessage(message: string) {
    console.log('Message received in worker:', message);

    const result = getBestMove(message);

    self.postMessage({result});
}
