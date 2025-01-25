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
};

struct ComResponse {
    int move;
    string comment;
};

int getRandomNumber();
ComResponse EasyCom(BoardPosition &bp);
ComResponse MediumCom(BoardPosition &bp);


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

    if(playerType == "Easy Com"){
        cr = EasyCom(bp);
    } else if(playerType == "Medium Com"){
        cr = MediumCom(bp);
    } else if(playerType == "Hard Com"){
        // TODO add Hard Com
        cr = EasyCom(bp);
        cr.comment = "Hard Com not implemented yet, Submitting random move";
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
        move++;

        // reached a store, skip opponent store
        if(move == bp.pits){
            if(currentlyMySide){
                hand--;
                myStore++;
            }
            move = 0;
            currentlyMySide = !currentlyMySide;
            continue;
        }

        hand--;
        if(currentlyMySide){
            myPits[move]++;
        } else {
            hisPits[move]++;
        }
    }

    // check for steal
    int oppositePit = bp.pits - move - 1;
    if(currentlyMySide && myPits[move] == 1 && hisPits[oppositePit] > 0){
        myStore += hisPits[oppositePit] + 1;
        myPits[move] = 0;
        hisPits[oppositePit] = 0;
    }

    // switch side if no bonus move
    // if there was a bonus move then we stopped at move=0 and currentlyMySide=false
    if(move != 0 || currentlyMySide){
        bp.southTurn = !bp.southTurn;
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
        for(int i = 0; i < bp.pits; i++){
            myStore += myPits[i];
            myPits[i] = 0;
            myStore += hisPits[i];
            hisPits[i] = 0;
        }
        bp.gameOver = true;
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
    cout << bestMoves.size() << endl;

    ComResponse cr;
    cr.move = bestMoves[getRandomNumber() % bestMoves.size()];
    cr.comment = "I do greedy moves";
    return cr;
}


