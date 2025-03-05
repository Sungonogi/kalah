
#include <chrono>
#include <iostream>
#include <unordered_map>
#include <array>

#include "board-position.h"
#include "min-max.h"


// alpha beta pruning with iterative deepening, advanced evaluation and move ordering, storing getMoves in a map and adjusting their order
class HardComMM: public MinMax {
private:

    // variables for minMax
    int maxDepth;
    bool maxDepthReached; // tells us if all nodes were explored

    int actualBestMove;

public: 
    int minMax(BoardPosition &bp, int depth, int alpha, int beta) {

        int score = bp.getPointDiff();

        if(bp.gameOver || score == MAX_SCORE || score == MIN_SCORE){
            return score;
        }

        if(depth >= maxDepth){
            maxDepthReached = false;
            return score;
        }

        // since the game is not over we can always make a move
        int bestMove = -1;
        int bestScore = MIN_SCORE;

        for(int move : bp.getMovesVector()){

            BoardPosition bpCopy = bp;
            bpCopy.doMove(move);

            bool sideChanged = bp.southTurn != bpCopy.southTurn;

            int nAlpha = sideChanged ? -beta : alpha;
            int nBeta = sideChanged ? -alpha : beta;

            int tmpScore = minMax(bpCopy, depth + 1, nAlpha, nBeta);

            if(sideChanged) {
                tmpScore = -tmpScore;
            }

            if(tmpScore > bestScore || bestScore == MIN_SCORE){
                bestScore = tmpScore;
                bestMove = move;
            }

            if(bestScore >= beta){
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

    MinMaxResult doMinMaxWithTimeLimit(BoardPosition &bp, int milliseconds) override {


        int startTime = getCurrentMillis();

        maxDepth = 5; // we are fast enough to get there in < 1ms
        actualBestMove = bp.getMoves()[0]; // fallback to first move
        maxDepthReached = false;

        int score = bp.getPointDiff();

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

    MinMaxResult doMinMaxWithMaxDepth(BoardPosition &bp, int maxDepth) override {

        this->maxDepth = maxDepth;
        actualBestMove = bp.getMovesVector()[0]; // fallback to first move
        maxDepthReached = false;

        int score = minMax(bp, 0, MIN_SCORE, MAX_SCORE);

        MinMaxResult result;
        result.score = score;
        result.move = actualBestMove;
        result.maxDepth = maxDepth;

        return result;
    }

};
