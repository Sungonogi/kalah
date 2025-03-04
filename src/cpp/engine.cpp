#include <emscripten/bind.h>
#include <iostream>
#include <chrono>

#include "json.hpp"

#include "board-position.h"
#include "min-max-ab.cpp"

using namespace std;
using json = nlohmann::json;


struct ComResponse {
    int move;
    string comment;
};

string quitWithMessage(const char* msg);
int getRandomNumber();
ComResponse EasyCom(BoardPosition &bp);
ComResponse MediumCom(BoardPosition &bp);
ComResponse HardCom(BoardPosition &bp, int maxDepth, int timeLimit);
ComResponse Stickfish(BoardPosition &bp, int maxDepth, int timeLimit);

string getBestMove(string jsonString) {

    json ComRequest = json::parse(jsonString);

    string playerType = ComRequest["playerType"];
    json boardJson = ComRequest["boardPosition"];
    BoardPosition bp;
    bp.pits = boardJson["pits"];
    if(bp.pits > MAX_PIT_SIZE){
        return quitWithMessage("Max pit size exceeded");
    }

    // Copy values from JSON to fixed-size arrays
    for (int i = 0; i < bp.pits; ++i) {
        bp.southPits[i] = boardJson["southPits"][i];
        bp.northPits[i] = boardJson["northPits"][i];
    }

    bp.southStore = boardJson["southStore"];
    bp.northStore = boardJson["northStore"];
    bp.southTurn = boardJson["southTurn"];
    bp.gameOver = boardJson["gameOver"];

    // count total seeds for seedsToWin
    int totalSeeds = 0;
    for(int i = 0; i < bp.pits; i++){
        totalSeeds += bp.southPits[i];
        totalSeeds += bp.northPits[i];
    }
    totalSeeds += bp.southStore;
    totalSeeds += bp.northStore;

    bp.seedsToWin = totalSeeds / 2 + 1;

    // don't do anything if the game is over
    if(bp.gameOver){
        return quitWithMessage("Game is over");
    }

    int maxDepth = -1;
    int timeLimit = -1;

    if(playerType == "Hard Com" || playerType == "Stickfish"){
        if(ComRequest.contains("timeLimit")){
            timeLimit = ComRequest["timeLimit"];

            if(timeLimit <= 0){
                return quitWithMessage("timeLimit(ms) must be positive");
            }
        } else if (ComRequest.contains("maxDepth")){
            maxDepth = ComRequest["maxDepth"];

            if(maxDepth <= 0){
                return quitWithMessage("maxDepth must be positive");
            }
        } else {
            return quitWithMessage("Either timeLimit(ms) or maxDepth must be set for Hard Com");
        }
    }

    ComResponse cr;
    if(playerType == "Easy Com"){
        cr = EasyCom(bp);
    } else if(playerType == "Medium Com"){
        cr = MediumCom(bp);
    } else if(playerType == "Hard Com"){
        cr = HardCom(bp, maxDepth, timeLimit);
    } else if(playerType == "Stickfish"){
        return quitWithMessage("Stickfish not implemented yet");
    } else {
        return quitWithMessage("Unknown player type");
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

string quitWithMessage(const char* msg){
    cout << "Error: " << msg << endl;
    json responseJson = {
        {"move", -1},
        {"comment", msg}
    };
    return responseJson.dump();
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
    vector<int> moves = bp.getMovesVector();

    ComResponse cr;
    cr.move = moves[getRandomNumber() % moves.size()];
    cr.comment = "I do random moves";
    return cr;
}

// MediumCom always picks the move that gives it the most points for the next turn
ComResponse MediumCom(BoardPosition &bp){
    vector<int> bestMoves;
    int bestScore = -1;
    for(int move : bp.getMovesVector()){
        // this does a deep copy
        BoardPosition bpCopy = bp;

        bpCopy.doMove(move);

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

// HardCom is a bot that uses minmax to find the best move
ComResponse HardCom(BoardPosition &bp, int maxDepth, int timeLimit){

    MinMaxAB mma = MinMaxAB();

    MinMaxResult mmr;
    if(maxDepth == -1){
        mmr = mma.doMinMaxWithTimeLimit(bp, timeLimit);
    } else {
        mmr = mma.doMinMaxWithMaxDepth(bp, maxDepth);
    }
        
    ComResponse cr;
    cr.move = mmr.move;
    cr.comment = "I did minmax and evaluate this position as " +
        to_string(mmr.score) + " with a depth of " + to_string(mmr.maxDepth) + 
        " and suggest move " + to_string(mmr.move);

    return cr;
}


