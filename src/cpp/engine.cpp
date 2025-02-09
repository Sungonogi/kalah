#include <emscripten/bind.h>
#include <iostream>
#include <chrono>

#include "json.hpp"

using namespace std;
using json = nlohmann::json;

struct BoardPosition {
    int pits;
    vector<int> southPits;
    vector<int> northPits;
    int southStore;
    int northStore;
    bool southTurn;
    bool gameOver;

    string toString() const {
        string result;

        // Print north store and north pits
        result += to_string(northStore) + " | ";
        for (int i = pits - 1; i >= 0; --i) {
            result += to_string(northPits[i]) + " ";
        }
        result += "\n";

        // Print south pits and south store
        result += "  | ";
        for (int i = 0; i < pits; ++i) {
            result += to_string(southPits[i]) + " ";
        }
        result += "| " + to_string(southStore) + "\n";

        // Print metadata
        // result += "southTurn: " + string(southTurn ? "true" : "false") + ", gameOver: " + string(gameOver ? "true" : "false") + ", pits: " + to_string(pits) + "\n";

        return result;
    }
};

struct ComResponse {
    int move;
    string comment;
};

int getRandomNumber();
ComResponse EasyCom(BoardPosition &bp);
ComResponse MediumCom(BoardPosition &bp);
ComResponse HardCom(BoardPosition &bp);


string getBestMove(string jsonString) {

    json ComRequest = json::parse(jsonString);

    ComResponse cr;

    string playerType = ComRequest["playerType"];
    json boardJson = ComRequest["boardPosition"];
    BoardPosition bp;
    bp.pits = boardJson["pits"];
    bp.southPits = boardJson["southPits"].get<vector<int>>();
    bp.northPits = boardJson["northPits"].get<vector<int>>();
    bp.southStore = boardJson["southStore"];
    bp.northStore = boardJson["northStore"];
    bp.southTurn = boardJson["southTurn"];
    bp.gameOver = boardJson["gameOver"];

    // don't do anything if the game is over
    if(bp.gameOver){
        cr.move = -1;
        cr.comment = "Game is over";
        json responseJson = {
            {"move", cr.move},
            {"comment", cr.comment}
        };
        return responseJson.dump();
    }

    if(playerType == "Easy Com"){
        cr = EasyCom(bp);
    } else if(playerType == "Medium Com"){
        cr = MediumCom(bp);
    } else if(playerType == "Hard Com"){
        cr = HardCom(bp);
    } else if(playerType == "Stickfish"){
        cr = EasyCom(bp);
        cr.comment = "Stickfish not implemented yet, Submitting random move";
    } else {
        cerr << "Unknown player type: " << playerType << endl;
    }

    json responseJson = {
        {"move", cr.move},
        {"comment", cr.comment}
    };

    // return the json string
    return responseJson.dump();
}

EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("getBestMove", &getBestMove);
}

vector<int> getMoves(BoardPosition &bp){
    vector<int> moves;
    const vector<int>& pits = bp.southTurn ? bp.southPits : bp.northPits;
    for (int i = 0; i < bp.pits; i++) {
        if (pits[i] > 0) {
            moves.push_back(i);
        }
    }
    return moves;
}

void doMove(BoardPosition &bp, int move) {
    vector<int> &myPits = bp.southTurn ? bp.southPits : bp.northPits;
    vector<int> &hisPits = bp.southTurn ? bp.northPits : bp.southPits;
    int &myStore = bp.southTurn ? bp.southStore : bp.northStore;

    bool currentlyMySide = true;
    int hand = myPits[move];
    myPits[move] = 0;

    while(hand > 0){
        move = (move + 1) % (bp.pits + 1);

        // reached a store, skip opponent store
        if(move < bp.pits){
            hand--;
            if(currentlyMySide){
                myPits[move]++;
            } else {
                hisPits[move]++;
            }
        } else {
            if(currentlyMySide){
                hand--;
                myStore++;
            }
            currentlyMySide = !currentlyMySide;
        }
    }

    // check for steal
    int oppositePit = bp.pits - move - 1;
    if(currentlyMySide && myPits[move] == 1 && hisPits[oppositePit] > 0){
        myStore += hisPits[oppositePit] + 1;
        myPits[move] = 0;
        hisPits[oppositePit] = 0;
    }

    // check for game over
    bool southEmpty = true;
    for(int i = 0; i < bp.pits; i++){
        if(bp.southPits[i] > 0){
            southEmpty = false;
            break;
        }
    }

    bool northEmpty = true;
    for(int i = 0; i < bp.pits; i++){
        if(bp.northPits[i] > 0){
            northEmpty = false;
            break;
        }
    }

    if(southEmpty || northEmpty){
        int &hisStore = bp.southTurn ? bp.northStore: bp.southStore;
        for(int i = 0; i < bp.pits; i++){
            myStore += myPits[i];
            myPits[i] = 0;
            hisStore += hisPits[i];
            hisPits[i] = 0;
        }
        bp.gameOver = true;
        return;
    }

    // switch side if no bonus move (do this after gameOver otherwise hisStore could be incorrect)
    // if there was a bonus move then we stopped at move=0 and currentlyMySide=false
    bp.southTurn = !bp.southTurn;
    if(!currentlyMySide && move == bp.pits){
        bp.southTurn = !bp.southTurn;
    }
}

int getRandomNumber(){
    // seed random number generator as rand is only pseudo random
    // I want to seed everytime and not just once because like this I have 0 app state
    // this is fine here as we won't be called twice in the same milli/nanosecond
    int seed = chrono::system_clock::now().time_since_epoch().count();
    srand(seed);

    return rand();
}

// EasyCom is a simple bot that just picks a random move
ComResponse EasyCom(BoardPosition &bp) {
    vector<int> moves = getMoves(bp);

    ComResponse cr;
    cr.move = moves[getRandomNumber() % moves.size()];
    cr.comment = "I do random moves";
    return cr;
}

// MediumCom always picks the move that gives it the most points for the next turn
ComResponse MediumCom(BoardPosition &bp){
    vector<int> bestMoves;
    int bestScore = -1;
    for(int move : getMoves(bp)){
        // this does a deep copy
        BoardPosition bpCopy = bp;

        doMove(bpCopy, move);

        int score = bp.southTurn ? bpCopy.southStore : bpCopy.northStore;

        if(score > bestScore){
            bestMoves.clear();
            bestMoves.push_back(move);
            bestScore = score;
        } else if(score == bestScore){
            // keep all moves with the maximum score
            bestMoves.push_back(move);
        } 
    }

    ComResponse cr;
    cr.move = bestMoves[getRandomNumber() % bestMoves.size()];
    cr.comment = "I do greedy moves";
    return cr;
}


// variables for minMax
int maxDepth, seedsToWin, actualBestMove;
bool maxDepthReached; // tells us if all nodes were explored

// using INT_MAX/MIN was bad because MIN can't be negated
#define MAX_SCORE 1000000
#define MIN_SCORE -1000000

// basic evaluation function
int getScore(BoardPosition &bp){

    int myStore = bp.southTurn ? bp.southStore : bp.northStore;

    if(myStore >= seedsToWin){
        return MAX_SCORE;
    }

    int theirStore = bp.southTurn ? bp.northStore : bp.southStore;

    if(theirStore >= seedsToWin){
        return MIN_SCORE;
    }

    return myStore - theirStore;
}

// recursive min max function
int minMax(BoardPosition &bp, int depth) {

    int score = getScore(bp);

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
    for(int move : getMoves(bp)){
        BoardPosition bpCopy = bp;
        doMove(bpCopy, move);
        int tmpScore = minMax(bpCopy, depth + 1);

        if(bp.southTurn != bpCopy.southTurn) {
            tmpScore = -tmpScore;
        }

        if(tmpScore >= bestScore){
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

int getCurrentMillis(){
    auto now = std::chrono::system_clock::now().time_since_epoch();
    return std::chrono::duration_cast<std::chrono::milliseconds>(now).count();
}


ComResponse HardCom(BoardPosition &bp){

    int startTime = getCurrentMillis();

    // count total seeds for seedsToWin
    int totalSeeds = 0;
    for(int i = 0; i < bp.pits; i++){
        totalSeeds += bp.southPits[i];
        totalSeeds += bp.northPits[i];
    }
    totalSeeds += bp.southStore;
    totalSeeds += bp.northStore;

    // initialize global variables
    seedsToWin = totalSeeds / 2 + 1;
    maxDepth = 1;
    actualBestMove = getMoves(bp)[0]; // fallback to first move
    maxDepthReached = false;

    int score = minMax(bp, 0);

    // iterative deepening until 1 second is over or until all nodes are explored
    while(!maxDepthReached && getCurrentMillis() - startTime < 1000){
        maxDepthReached = true;
        score = minMax(bp, 0);
        maxDepth++;
    }


    ComResponse cr;
    cr.move = actualBestMove;
    cr.comment = "I did minmax and evaluate this position as " +
        to_string(score) + " with a depth of " + to_string(maxDepth) + 
        " and suggest move " + to_string(actualBestMove);


    return cr;
}
