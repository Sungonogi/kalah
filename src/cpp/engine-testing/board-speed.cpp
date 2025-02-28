#include "../board-position.cpp"
#include <iostream>
#include <chrono>

using namespace std;
using namespace std::chrono;

int main() {
    // Create a mock BoardPosition object
    BoardPosition mockBoard;
    mockBoard.pits = 6;
    mockBoard.southStore = 0;
    mockBoard.northStore = 0;
    mockBoard.southTurn = true;
    mockBoard.gameOver = false;
    for(int i = 0; i < mockBoard.pits; i++){
        mockBoard.southPits[i] = 3;
        mockBoard.northPits[i] = 3;
    }
    mockBoard.seedsToWin = (mockBoard.pits * 3) / 2 + 1;

    // Measure the time taken by copy
    int move = 2; // Example move
    auto start = high_resolution_clock::now();
    for(int i = 0; i < 1000 * 1000; i++){
        BoardPosition cpy = mockBoard;
    }
    auto end = high_resolution_clock::now();

    // Calculate the duration
    auto duration = duration_cast<milliseconds>(end - start).count();

    // Print the result
    cout << "Time taken by copy: " << duration << " milliseconds" << endl;

    return 0;
}