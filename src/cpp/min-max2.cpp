
#include <chrono>
#include <iostream>

#include "board-position.h"
#include "min-max.h"

class MinMaxDumb: public MinMax {
private:
    // just for tracking
    int depthSum = 0;
    int depthCount= 0;
    // variables for minMax
    int maxDepth, actualBestMove;
    bool maxDepthReached; // tells us if all nodes were explored

public: 
    // recursive min max function
    int minMax(BoardPosition &bp, int depth) {

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

            int tmpScore = minMax(bpCopy, depth + 1);

            if(sideChanged) {
                tmpScore = -tmpScore;
            }

            if(tmpScore > bestScore || bestScore == MIN_SCORE){
                bestScore = tmpScore;
                bestMove = move;
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

        maxDepth = 1;
        actualBestMove = bp.getMoves()[0]; // fallback to first move
        maxDepthReached = false;

        int score = bp.getScore();

        // iterative deepening until 1 second is over or until all nodes are explored
        while(!maxDepthReached && getCurrentMillis() - startTime < milliseconds){
            maxDepthReached = true;
            score = minMax(bp, 0);
            maxDepth++;
        }

        if(!maxDepthReached){
            depthSum += maxDepth;
            depthCount++;
        }

        MinMaxResult result;
        result.score = score;
        result.move = actualBestMove;
        result.maxDepth = maxDepth;

        return result;
    }

    MinMaxResult doMinMaxWithMaxDepth(BoardPosition &bp, int maxDepth) override {

        this->maxDepth = maxDepth;
        actualBestMove = bp.getMoves()[0]; // fallback to first move
        maxDepthReached = false;

        int score = minMax(bp, 0);

        MinMaxResult result;
        result.score = score;
        result.move = actualBestMove;
        result.maxDepth = maxDepth;

        return result;
    }


    float getAvgDepth() override {
        return depthCount == 0 ? 0.0 : (float) depthSum / depthCount;
    }
};
