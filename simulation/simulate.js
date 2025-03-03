import { performLegalMove, generateBoards } from './src/board.js';
import { getStickfishMove, getEngineMove, getStickfishAvgResponseTime, getEngineAvgResponseTime } from './src/players.js';

document.getElementById("startButton").addEventListener("click", () => {
    const amount = parseInt(document.getElementById("simulationAmount").value);
    simulateGame(amount);
});


function updateWins(stickfishWins, engineWins, ties) {
    document.getElementById("stickfishWins").innerText = stickfishWins;
    document.getElementById("engineWins").innerText = engineWins;
    document.getElementById("ties").innerText = ties;
}

// Simulates 2*amount games between Stickfish and the Engine
async function simulateGame(amount) {
    let stickfishWins = 0;
    let engineWins = 0;
    let ties = 0;

    const boards = generateBoards(amount);

    for (let board of boards) {
        let move;

        while (!board.gameOver) {
            if (board.southTurn) {
                // Get move from Stickfish (backend)
                move = await getStickfishMove(board);
            } else {
                // Get move from Engine (web worker)
                move = await getEngineMove(board);
            }

            if (move === null) {
                console.error("Failed to get a move. Ending simulation.");
                break;
            }

            // Apply the move to the board position
            board = performLegalMove(board, move);
        }

        // Determine the winner
        if (board.southStore > board.northStore) {
            stickfishWins++;
        } else if (board.northStore > board.southStore) {
            engineWins++;
        } else {
            ties++;
        }

        updateWins(stickfishWins, engineWins, ties);
    }

    console.log(`Simulation complete. Stickfish wins: ${stickfishWins}, Engine wins: ${engineWins}, Ties: ${ties}`);

    console.log(`Average response time for Stickfish: ${getStickfishAvgResponseTime()} ms`);
    console.log(`Average response time for Engine: ${getEngineAvgResponseTime()} ms`);
}

