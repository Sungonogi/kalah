// src/app/workers/engine.worker.ts
importScripts("engine.js");
var Module;
var getBestMove;
var unhandledRequest = void 0;
Module.onRuntimeInitialized = () => {
  getBestMove = Module.getBestMove;
  if (unhandledRequest) {
    handleRequest(unhandledRequest);
  }
};
addEventListener("message", (event) => {
  const request = event.data;
  if (getBestMove === void 0) {
    console.log("Module not loaded yet. Pushing message to queue.");
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
