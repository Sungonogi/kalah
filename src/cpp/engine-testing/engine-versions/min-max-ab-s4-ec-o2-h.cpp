
#include <chrono>
#include <iostream>
#include <unordered_map>
#include <array>

#include "board-position.h"
#include "min-max.h"


// alpha beta and score 2 and early cutoff, getMoves2 and hashing
class MinMaxABS4ECO2H: public MinMax {
private:
    // just for tracking
    int depthSum = 0;
    int depthCount= 0;
    // variables for minMax
    int maxDepth;
    bool maxDepthReached; // tells us if all nodes were explored

    int8_t actualBestMove;

    // for hashing the right move order
    const int maxHashDepth = 6;
    std::unordered_map<int, std::array<int8_t, MAX_PIT_SIZE + 1>> moveOrder;

public: 
    // recursive min max function
    float minMax(BoardPosition &bp, int depth, float alpha, float beta, long long hash) {

        float score = bp.getScore4();

        if(bp.gameOver || score == MAX_SCOREF || score == MIN_SCOREF){
            return score;
        }

        if(depth >= maxDepth){
            maxDepthReached = false;
            return score;
        }

        std::array<int8_t, MAX_PIT_SIZE + 1>* movesPtr = nullptr;
        std::array<int8_t, MAX_PIT_SIZE + 1> movesArr;
        

        if (depth <= maxHashDepth) {
            auto it = moveOrder.find(hash);
            if (it != moveOrder.end()) {
                movesPtr = &it->second;  // Pointer to existing array
            } else {
                movesArr = bp.getMoves2Byte();
                moveOrder[hash] = movesArr;
                movesPtr = &moveOrder[hash];  // Get pointerr after insertion
            }
        } else {
            movesArr = bp.getMoves2Byte();
        }
        
        // Use movesPtr if it exists, otherwise use moves
        std::array<int8_t, MAX_PIT_SIZE + 1>& moves = (movesPtr) ? *movesPtr : movesArr;

        // since the game is not over we can always make a move
        int8_t bestMove = -1;
        float bestScore = MIN_SCOREF;

        for(int i = 0; i < MAX_PIT_SIZE + 1; i++){
            int8_t move = moves[i];
            if(move == -1){ // array is terminated with -1
                break;
            }

            BoardPosition bpCopy = bp;
            bpCopy.doMove(move);

            bool sideChanged = bp.southTurn != bpCopy.southTurn;

            float nAlpha = sideChanged ? -beta : alpha;
            float nBeta = sideChanged ? -alpha : beta;

            long long newHash = hash * bp.pits + move; // might overflow :D

            float tmpScore = minMax(bpCopy, depth + 1, nAlpha, nBeta, newHash);

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

        // move the bestMove to the front
        if(depth <= maxHashDepth && moves[0] != bestMove){
            int i = 1;
            while(moves[i] != bestMove){
                i++;
            }

            while(i > 0){
                moves[i] = moves[i - 1];
                i--;
            }

            moves[0] = bestMove;
        }


        // if we are at the root node we need to remember the best move
        if(depth == 0){
            actualBestMove = bestMove;
        }

        return bestScore;
    }

    MinMaxResult doMinMaxWithTimeLimit(BoardPosition &bp, int milliseconds) override {

        moveOrder.clear();

        int startTime = getCurrentMillis();

        maxDepth = 5; // we always get there
        actualBestMove = bp.getMoves()[0]; // fallback to first move
        maxDepthReached = false;

        float score = bp.getScore4();

        // iterative deepening until 1 second is over or until all nodes are explored
        while(!maxDepthReached && getCurrentMillis() - startTime < milliseconds){
            maxDepthReached = true;
            score = minMax(bp, 0, MIN_SCOREF, MAX_SCOREF, 1LL);
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

        moveOrder.clear();

        this->maxDepth = maxDepth;
        actualBestMove = bp.getMoves()[0]; // fallback to first move
        maxDepthReached = false;

        float score = minMax(bp, 0, MIN_SCOREF, MAX_SCOREF, 1LL);

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
