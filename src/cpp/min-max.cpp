
#include <chrono>
#include <iostream>

#include "board-position.h"
#include "min-max.h"

int getCurrentMillis(){
    auto now = std::chrono::system_clock::now().time_since_epoch();
    return std::chrono::duration_cast<std::chrono::milliseconds>(now).count();
}

static int depthSum1 = 0;
static int depthSum2 = 0;

static int depthCount1 = 0;
static int depthCount2 = 0;

// variables for minMax
static int maxDepth, actualBestMove;
static bool maxDepthReached; // tells us if all nodes were explored

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

        if(tmpScore > bestScore || bestScore == MIN_SCORE){
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

    if(!maxDepthReached){
        depthSum1 += maxDepth;
        depthCount1++;
    }

    MinMaxResult result;
    result.score = score;
    result.move = actualBestMove;
    result.maxDepth = maxDepth;

    return result;
}

MinMaxResult doMinMaxWithMaxDepth(BoardPosition &bp, int maxDepth){

    ::maxDepth = maxDepth;
    actualBestMove = bp.getMoves()[0]; // fallback to first move
    maxDepthReached = false;

    int score = minMax(bp, 0, MIN_SCORE, MAX_SCORE);

    MinMaxResult result;
    result.score = score;
    result.move = actualBestMove;
    result.maxDepth = maxDepth;

    return result;
}

// recursive min max function
int minMax2(BoardPosition &bp, int depth, int alpha, int beta) {

    int score = bp.getScore2();

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

        int tmpScore = minMax2(bpCopy, depth + 1, nAlpha, nBeta);

        if(sideChanged) {
            tmpScore = -tmpScore;
        }

        if(tmpScore > bestScore || bestScore == MIN_SCORE){
            bestScore = tmpScore;
            bestMove = move;
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


MinMaxResult doMinMaxWithTimeLimit2(BoardPosition &bp, int milliseconds){

    int startTime = getCurrentMillis();

    maxDepth = 1;
    actualBestMove = bp.getMoves()[0]; // fallback to first move
    maxDepthReached = false;

    int score = bp.getScore();

    // iterative deepening until 1 second is over or until all nodes are explored
    while(!maxDepthReached && getCurrentMillis() - startTime < milliseconds){
        maxDepthReached = true;
        score = minMax2(bp, 0, MIN_SCORE, MAX_SCORE);
        maxDepth++;
    }

    if(!maxDepthReached){
        depthSum2 += maxDepth;
        depthCount2++;
    }

    MinMaxResult result;
    result.score = score;
    result.move = actualBestMove;
    result.maxDepth = maxDepth;

    return result;
}


MinMaxResult doMinMaxWithMaxDepth2(BoardPosition &bp, int maxDepth){

    ::maxDepth = maxDepth;
    actualBestMove = bp.getMoves()[0]; // fallback to first move
    maxDepthReached = false;

    int score = minMax2(bp, 0, MIN_SCORE, MAX_SCORE);

    MinMaxResult result;
    result.score = score;
    result.move = actualBestMove;
    result.maxDepth = maxDepth;

    return result;
}

float getAvgDepth1(){
    return depthCount1 == 0 ? 0.0 : (float) depthSum1 / depthCount1;
}

float getAvgDepth2(){
    return depthCount2 == 0 ? 0 : (float) depthSum2 / depthCount2;
}