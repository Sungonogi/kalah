#ifndef MINMAX_H
#define MINMAX_H

#include <chrono>
#include "board-position.h"

struct MinMaxResult {
    int score;
    int move;
    int maxDepth;
};

// Iterative deepening Minimax with a time limit
MinMaxResult doMinMaxWithTimeLimit(BoardPosition &bp, int milliseconds);

#endif