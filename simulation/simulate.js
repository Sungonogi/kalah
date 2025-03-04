import { performLegalMove, generateBoards } from './src/board.js';
import { getStickfishEngineMove, getHardComMove, getStickfishAvgResponseTime, getEngineAvgResponseTime } from './src/players.js';

document.getElementById("startButton").addEventListener("click", () => {
    const amount = parseInt(document.getElementById("simulationAmount").value);
    console.log("player1 is Stickfish, player2 is Engine");
    simulateGame(amount, getStickfishEngineMove, getHardComMove);
});


function updateWins(stickfishWins, engineWins, ties) {
    document.getElementById("stickfishWins").innerText = stickfishWins;
    document.getElementById("engineWins").innerText = engineWins;
    document.getElementById("ties").innerText = ties;
}

// Simulates 2*amount games between Stickfish and the Engine
async function simulateGame(amount, p1, p2) {
    let p1Wins = 0;
    let p2Wins = 0;
    let ties = 0;

    const boards = generateBoards(amount);

    for (let board of boards) {
        let move;

        while (!board.gameOver) {
            if (board.southTurn) {
                move = await p1(board);
            } else {
                move = await p2(board);
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
            p1Wins++;
        } else if (board.northStore > board.southStore) {
            p2Wins++;
        } else {
            ties++;
        }

        updateWins(p1Wins, p2Wins, ties);
    }

    console.log(`Simulation complete. Stickfish wins: ${p1Wins}, Engine wins: ${p2Wins}, Ties: ${ties}`);

    console.log(`Average response time for Stickfish: ${getStickfishAvgResponseTime()} ms`);
    console.log(`Average response time for Engine: ${getEngineAvgResponseTime()} ms`);
}

