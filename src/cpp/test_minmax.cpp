#include <iostream>
#include "engine.cpp" // Include the implementation file

void testMinMax() {
    // Create a sample BoardPosition
    BoardPosition bp;
    bp.southTurn = true;
    bp.gameOver = false;
    bp.southStore = 0;
    bp.northStore = 0;
    bp.pits = 6;
    bp.southPits = {4, 4, 4, 4, 4, 4};
    bp.northPits = {4, 4, 4, 4, 4, 4};

    // Set global variables
    maxDepth = 3;
    seedsToWin = 25;
    maxDepthReached = false;

    // Call minMax function
    int score = minMax(bp, 0);

    // Print the result
    std::cout << "Best score: " << score << std::endl;
    std::cout << "Best move: " << actualBestMove << std::endl;
}

int main() {
    testMinMax();
    return 0;
}