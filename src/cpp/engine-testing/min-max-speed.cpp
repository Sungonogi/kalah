#include "../board-position.cpp"
#include "../min-max.cpp"
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

    // Measure the time taken by doMinMaxWithMaxDepth
    auto start = high_resolution_clock::now();
    
    MinMaxAB mma = MinMaxAB();
    mma.doMinMaxWithMaxDepth(mockBoard, 12);

    auto end = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(end - start).count();

    // Print the result
    cout << "Time taken by minMax " << duration << " milliseconds" << endl;

    return 0;
}