// Global variables for time limits
const STICKFISH_TIME_LIMIT = 10; // Example time limit for Stickfish
const ENGINE_TIME_LIMIT = 10; // Example time limit for Engine

const worker = new Worker("worker.js");

// Function to get a move from the backend (Stickfish)
async function getStickfishMove(boardPosition) {
    const request = {
        playerType: "Stickfish",
        boardPosition: boardPosition,
        timeLimit: STICKFISH_TIME_LIMIT
    };

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
        return data.move;
    } catch (error) {
        console.error("Error when communicating with the backend:", error);
        return null;
    }
}

// Function to get a move from the web worker (Engine)
function getEngineMove(boardPosition) {
    return new Promise((resolve, reject) => {
        const request = {
            playerType: "Hard Com",
            boardPosition: boardPosition,
            timeLimit: ENGINE_TIME_LIMIT
        };

        worker.onmessage = (event) => {
            const response = event.data;
            resolve(response.move);
        };

        worker.onerror = (error) => {
            console.error("Error in web worker:", error);
            reject(error);
        };

        worker.postMessage(request);
    });
}

// Export the functions for use in other files
export { getStickfishMove, getEngineMove };