importScripts('engine.js');

let getBestMove;

let unhandledMessages = [];

Module.onRuntimeInitialized = () => {
    getBestMove = Module.cwrap('getBestMove', 'number', ['string']);
    unhandledMessages.forEach(handleMessage);
}


// Listen for messages from the main thread
self.addEventListener('message', (event) =>  {

    const message = event.data.message;

    if(getBestMove === undefined) {
        console.log('Module not loaded yet. Pushing message to queue.');
        unhandledMessages.push(message);
        return;
    } else {
        handleMessage(message);
    }

});


const handleMessage = (message) => {
    console.log('Message received in worker:', message);

    const result = getBestMove(message);

    self.postMessage({ result });
}

