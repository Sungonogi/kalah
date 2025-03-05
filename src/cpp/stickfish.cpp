
#include <chrono>
#include <iostream>
#include <unordered_map>
#include <array>

#include "board-position.h"
#include "min-max.h"


// alpha beta pruning with iterative deepening, advanced evaluation and move ordering, storing getMoves in a map and adjusting their order
class StickfishMM: public MinMax {
private:

    // variables for minMax
    int maxDepth;
    bool maxDepthReached; // tells us if all nodes were explored

    int8_t actualBestMove;

    // for hashing the right move order
    const int maxHashDepth = 6;
    std::unordered_map<int, std::array<int8_t, MAX_PIT_SIZE + 1>> moveOrder;

public: 
    int minMax(BoardPosition &bp, int depth, int alpha, int beta, long long hash) {

        int score = bp.getScore();

        if(bp.gameOver || score == MAX_SCORE || score == MIN_SCORE){
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
                movesArr = bp.getMoves();
                moveOrder[hash] = movesArr;
                movesPtr = &moveOrder[hash];  // Get pointer after insertion
            }
        } else {
            movesArr = bp.getMoves();
        }
        
        // Use movesPtr if it exists, otherwise use moves
        std::array<int8_t, MAX_PIT_SIZE + 1>& moves = (movesPtr) ? *movesPtr : movesArr;

        // since the game is not over we can always make a move
        int8_t bestMove = -1;
        int bestScore = MIN_SCORE;

        for(int i = 0; i < MAX_PIT_SIZE + 1; i++){
            int8_t move = moves[i];
            if(move == -1){ // array is terminated with -1
                break;
            }

            BoardPosition bpCopy = bp;
            bpCopy.doMove(move);

            bool sideChanged = bp.southTurn != bpCopy.southTurn;

            int nAlpha = sideChanged ? -beta : alpha;
            int nBeta = sideChanged ? -alpha : beta;

            long long newHash = hash * bp.pits + move; // might overflow :D

            int tmpScore = minMax(bpCopy, depth + 1, nAlpha, nBeta, newHash);

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

        maxDepth = 5; // we are fast enough to get there in < 1ms
        actualBestMove = bp.getMoves()[0]; // fallback to first move
        maxDepthReached = false;

        int score = bp.getScore();

        // iterative deepening until 1 second is over or until all nodes are explored
        while(!maxDepthReached && getCurrentMillis() - startTime < milliseconds){
            maxDepthReached = true;
            score = minMax(bp, 0, MIN_SCORE, MAX_SCORE, 1LL);
            maxDepth++;
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

        int score = minMax(bp, 0, MIN_SCORE, MAX_SCORE, 1LL);

        MinMaxResult result;
        result.score = score;
        result.move = actualBestMove;
        result.maxDepth = maxDepth;

        return result;
    }

};
