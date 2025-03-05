
#include <chrono>
#include <iostream>

#include "board-position.h"
#include "min-max.h"

// alpha beta and score 2 and early cutoff
class MinMaxABS3EC: public MinMax {
private:
    // just for tracking
    int depthSum = 0;
    int depthCount= 0;
    // variables for minMax
    int maxDepth, actualBestMove;
    bool maxDepthReached; // tells us if all nodes were explored

public: 
    // recursive min max function
    float minMax(BoardPosition &bp, int depth, float alpha, float beta) {

        float score = bp.getScore3();

        if(bp.gameOver || score == MAX_SCOREF || score == MIN_SCOREF){
            return score;
        }

        if(depth == maxDepth){
            maxDepthReached = false;
            return score;
        }

        int bestMove = -1;
        float bestScore = MIN_SCOREF;

        // since the game is not over we can always make a move
        for(int move : bp.getMoves()){
            if(move == -1){ // array is terminated with -1
                break;
            }

            BoardPosition bpCopy = bp;
            bpCopy.doMove(move);

            bool sideChanged = bp.southTurn != bpCopy.southTurn;

            float nAlpha = sideChanged ? -beta : alpha;
            float nBeta = sideChanged ? -alpha : beta;

            float tmpScore = minMax(bpCopy, depth + 1, nAlpha, nBeta);

            if(sideChanged) {
                tmpScore = -tmpScore;
            }

            if(tmpScore > bestScore || bestScore == MIN_SCOREF){
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

        maxDepth = 1;
        actualBestMove = bp.getMoves()[0]; // fallback to first move
        maxDepthReached = false;

        float score = bp.getScore2();

        // iterative deepening until 1 second is over or until all nodes are explored
        while(!maxDepthReached && getCurrentMillis() - startTime < milliseconds){
            maxDepthReached = true;
            score = minMax(bp, 0, MIN_SCOREF, MAX_SCOREF);
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

        float score = minMax(bp, 0, MIN_SCOREF, MAX_SCOREF);

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
