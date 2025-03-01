#ifndef MINMAX_H
#define MINMAX_H

#include <chrono>
#include "board-position.h"

/* 
    To document some (obvious) speed improvements I made:
    - 80ms to 38ms: enable -O2 flag for emcc compiler optimization 
        - I also tested O3 with average 42ms
        - but O2 took 38ms on average (I did 5 runs for both)
*/

struct MinMaxResult {
    int score;
    int move;
    int maxDepth;
};

// Iterative deepening Minimax with a time limit
MinMaxResult doMinMaxWithTimeLimit(BoardPosition &bp, int milliseconds);

MinMaxResult doMinMaxWithMaxDepth(BoardPosition &bp, int maxDepth);

#endif