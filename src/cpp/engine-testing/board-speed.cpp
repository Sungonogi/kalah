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
    int seeds = 12;
    for(int i = 0; i < mockBoard.pits; i++){
        mockBoard.southPits[i] = seeds;
        mockBoard.northPits[i] = seeds;
    }
    mockBoard.seedsToWin = (mockBoard.pits * seeds) / 2 + 1;

    // Measure the time taken by copy
    auto start = high_resolution_clock::now();
    for(int i = 0; i < 1000 * 1000; i++){
        BoardPosition cpy = mockBoard;
    }
    auto end = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(end - start).count();

    // Print the result
    cout << "Time taken by copy: " << duration << " milliseconds" << endl;


    // Measure the time taken by doMove
    int move = 2; 

    start = high_resolution_clock::now();
    for(int i = 0; i < 1000 * 1000; i++){
        BoardPosition cpy = mockBoard;
        cpy.doMove(move);
    }
    end = high_resolution_clock::now();
    duration = duration_cast<milliseconds>(end - start).count();

    // Print the result
    cout << "Time taken by doMove: " << duration << " milliseconds" << endl;

    return 0;
}