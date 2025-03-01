
#include <chrono>

#include "board-position.h"
#include "min-max.h"

int getCurrentMillis(){
    auto now = std::chrono::system_clock::now().time_since_epoch();
    return std::chrono::duration_cast<std::chrono::milliseconds>(now).count();
}

// variables for minMax
int maxDepth, actualBestMove;
bool maxDepthReached; // tells us if all nodes were explored

// recursive min max function
int minMax(BoardPosition &bp, int depth, int alpha, int beta) {

    int score = bp.getScore();

    if(bp.gameOver || score == MAX_SCORE || score == MIN_SCORE){
        return score;
    }

    if(depth == maxDepth){
        maxDepthReached = false;
        return score;
    }

    int bestMove = -1;
    int bestScore = MIN_SCORE;

    // since the game is not over we can always make a move
    for(int move : bp.getMoves()){
        if(move == -1){ // array is terminated with -1
            break;
        }

        BoardPosition bpCopy = bp;
        bpCopy.doMove(move);

        bool sideChanged = bp.southTurn != bpCopy.southTurn;

        int nAlpha = sideChanged ? -beta : alpha;
        int nBeta = sideChanged ? -alpha : beta;

        int tmpScore = minMax(bpCopy, depth + 1, nAlpha, nBeta);

        if(sideChanged) {
            tmpScore = -tmpScore;
        }

        if(tmpScore >= bestScore){
            bestScore = tmpScore;
            bestMove = move;
        }

        
        if(bestScore > beta){
            break;
        }

        if(bestScore > alpha){
            alpha = bestScore;
        }

    }

    // if we are at the root node we need to remember the best move
    if(depth == 0){
        actualBestMove = bestMove;
    }

    return bestScore;
}


MinMaxResult doMinMaxWithTimeLimit(BoardPosition &bp, int milliseconds){

    int startTime = getCurrentMillis();

    maxDepth = 1;
    actualBestMove = bp.getMoves()[0]; // fallback to first move
    maxDepthReached = false;

    int score = bp.getScore();

    // iterative deepening until 1 second is over or until all nodes are explored
    while(!maxDepthReached && getCurrentMillis() - startTime < milliseconds){
        maxDepthReached = true;
        score = minMax(bp, 0, MIN_SCORE, MAX_SCORE);
        maxDepth++;
    }

    MinMaxResult result;
    result.score = score;
    result.move = actualBestMove;
    result.maxDepth = maxDepth;

    return result;
}