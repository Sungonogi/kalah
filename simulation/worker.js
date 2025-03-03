
// Overwrite the locateFile function to change the path of the wasm file
self.Module = {
    locateFile: function(path, scriptDirectory) {
        if (path === 'engine.wasm') {
            return '../public/' + path;
        }
        return scriptDirectory + path;
    }
};

// engine.js now looks at ../public/engine.wasm
importScripts('../public/engine.js');

let getBestMove;
let unhandledRequest = undefined;



// Initialize the Module from engine.js
self.Module.onRuntimeInitialized = () => {
    getBestMove = self.Module.getBestMove;

    if (unhandledRequest) {
        handleRequest(unhandledRequest);
    }
};

// Listen for messages from the main thread
addEventListener('message', (event) => {
    const request = event.data;

    if (getBestMove === undefined) {
        console.log('Module not loaded yet. Pushing message to queue.');
        unhandledRequest = request;
        return;
    } else {
        handleRequest(request);
    }
});

function handleRequest(request) {
    const result = getBestMove(JSON.stringify(request));
    const response = JSON.parse(result);

    self.postMessage(response);
}