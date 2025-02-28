#include "../board-position.cpp"
#include <iostream>
#include <chrono>

using namespace std;
using namespace std::chrono;

int main() {
    // Create a mock BoardPosition object
    BoardPosition mockBoard;
    mockBoard.pits = 6;
    mockBoard.gameOver = false;

    // Measure the time taken by doMove
    int move = 2; // Example move
    auto start = high_resolution_clock::now();
    for(int i = 0; i < 1000 * 1000; i++){
    mockBoard.southTurn = true;

        mockBoard.southPits = {4, 4, 4, 4, 4, 4};
        mockBoard.northPits = {4, 4, 4, 4, 4, 4};
        mockBoard.southStore = 0;
        mockBoard.northStore = 0;
        mockBoard.doMove(move);
    }
    auto end = high_resolution_clock::now();

    // Calculate the duration
    auto duration = duration_cast<milliseconds>(end - start).count();

    // Print the result
    cout << "Time taken by doMove: " << duration << " milliseconds" << endl;

    return 0;
}