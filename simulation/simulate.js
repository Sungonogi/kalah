import { performLegalMove, generateBoards } from './src/board.js';
import { getStickfishMove, getEngineMove, getStickfishAvgResponseTime, getEngineAvgResponseTime } from './src/players.js';

document.getElementById("startButton").addEventListener("click", () => {
    const amount = parseInt(document.getElementById("simulationAmount").value);
    console.log("player1 is Stickfish, player2 is Engine");
    simulateGame(amount);
});


function updateWins(stickfishWins, engineWins, ties) {
    document.getElementById("stickfishWins").innerText = stickfishWins;
    document.getElementById("engineWins").innerText = engineWins;
    document.getElementById("ties").innerText = ties;
}

// Simulates 2*amount games between Stickfish and the Engine
async function simulateGame(amount) {
    let sWins = 0;
    let eWins = 0;
    let ties = 0;

    const boards = generateBoards(amount);

    for (let board of boards) {
        let move;

        while (!board.gameOver) {
            if (board.southTurn) {
                move = await getStickfishMove(board);
            } else {
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
            sWins++;
        } else if (board.northStore > board.southStore) {
            eWins++;
        } else {
            ties++;
        }

        updateWins(sWins, eWins, ties);
    }

    console.log(`Simulation complete. Stickfish wins: ${sWins}, Engine wins: ${eWins}, Ties: ${ties}`);

    console.log(`Average response time for Stickfish: ${getStickfishAvgResponseTime()} ms`);
    console.log(`Average response time for Engine: ${getEngineAvgResponseTime()} ms`);
}

