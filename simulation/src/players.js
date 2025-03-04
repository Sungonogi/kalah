// Global variables for time limits
let STICKFISH_TIME_LIMIT = 100; // Example time limit for Stickfish
let ENGINE_TIME_LIMIT = 100; // Example time limit for Engine

const worker = new Worker("worker.js");

let stickfishResponseTime = 0;
let stickfishRequestCount = 0;

let engineResponseTime = 0;
let engineRequestCount = 0;

// Function to get a move from the backend (Stickfish)
async function getStickfishMove(boardPosition) {
    const request = {
        playerType: "Stickfish",
        boardPosition: boardPosition,
        timeLimit: STICKFISH_TIME_LIMIT
    };

    const startTime = performance.now();

    try {
        const response = await fetch("http://localhost:9090/api/computerMove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const endTime = performance.now();

        stickfishResponseTime += (endTime - startTime);
        stickfishRequestCount++;

        console.debug("Stickfish ", data.comment);

        return data;
    } catch (error) {
        console.error("Error when communicating with the backend:", error);
        return null;
    }
}

// Function to get a move from the web worker (Engine)
function getEngineMove(boardPosition, timeLimit = ENGINE_TIME_LIMIT) {
    return new Promise((resolve, reject) => {
        const request = {
            playerType: 'Hard Com',
            boardPosition: boardPosition,
            timeLimit
        };

        const startTime = performance.now();

        worker.onmessage = (event) => {
            const response = event.data;
            const endTime = performance.now();

            engineResponseTime += (endTime - startTime);
            engineRequestCount++;

            console.debug("Engine ", response.comment);

            resolve(response);
        };

        worker.onerror = (error) => {
            console.error("Error in web worker:", error);
            reject(error);
        };

        worker.postMessage(request);
    });
}

// Function to get the average response time for Stickfish
function getStickfishAvgResponseTime() {
    return stickfishRequestCount === 0 ? 0 : stickfishResponseTime / stickfishRequestCount;
}

// Function to get the average response time for Engine
function getEngineAvgResponseTime() {
    return engineRequestCount === 0 ? 0 : engineResponseTime / engineRequestCount;
}

// Export the functions for use in other files
export { getStickfishMove, getEngineMove, getStickfishAvgResponseTime, getEngineAvgResponseTime };