#include "board-position.h"
#include <iostream>

using namespace std;

string BoardPosition::toString() const {
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
    result += "southTurn: " + string(southTurn ? "true" : "false") + ", gameOver: " + string(gameOver ? "true" : "false") + ", pits: " + to_string(pits) + "\n";

    return result;
}

void BoardPosition::doMove(int move) {
    // I thought about if this readable "s ? a : b" is slow and if should do if else but it will be optimized anyway
    int* myPits = southTurn ? southPits : northPits;
    int* hisPits = southTurn ? northPits : southPits;
    int &myStore = southTurn ? southStore : northStore;

    bool currentlyMySide = true;
    int hand = myPits[move];
    myPits[move] = 0;

    while(hand > 0){
        move++;

        // reached a store, skip opponent store
        if(move < pits){
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
            move = -1; // reset move to -1, it will be incremented to 0
            currentlyMySide = !currentlyMySide;
        }
    }

    // switch side if no bonus move
    // if there was a bonus move then we stopped at currentlyMySide=false and move=-1 
    if(currentlyMySide || move != -1){
        southTurn = !southTurn;
    }

    // check for steal
    int oppositePit = pits - move - 1;
    if(currentlyMySide && move != - 1 && myPits[move] == 1 && hisPits[oppositePit] > 0){
        myStore += hisPits[oppositePit] + 1;
        myPits[move] = 0;
        hisPits[oppositePit] = 0;
    }

    // check for game over
    bool southEmpty = true;
    for(int i = 0; i < pits; i++){
        if(southPits[i] > 0){
            southEmpty = false;
            break;
        }
    }

    bool northEmpty = true;
    for(int i = 0; i < pits; i++){
        if(northPits[i] > 0){
            northEmpty = false;
            break;
        }
    }

    if(southEmpty || northEmpty){
        if(southEmpty){
            for(int i = 0; i < pits; i++){
                northStore += northPits[i];
                northPits[i] = 0;
            }
        } else {
            for(int i = 0; i < pits; i++){
                southStore += southPits[i];
                southPits[i] = 0;
            }
        }
        gameOver = true;
        return;
    }
}

// returns valid moves as a vector (for ease of use)
vector<int> BoardPosition::getMovesVector() {
    vector<int> moves;
    const int* myPits = southTurn ? southPits : northPits;
    for (int i = 0; i < pits; i++) {
        if (myPits[i] > 0) {
            moves.push_back(i);
        }
    }
    return moves;
}

// returns valid moves in -1 terminated array for speed, int8_t to save memory in the map and in a good order
array<int8_t, MAX_PIT_SIZE + 1> BoardPosition::getMoves() {

    array<int8_t, MAX_PIT_SIZE + 1> moves = {};
    const int* myPits = southTurn ? southPits : northPits;
    const int* hisPits = southTurn ? northPits : southPits;

    int moveCount = 0;

    // extra moves from right to
    for (int i = pits - 1; i >= 0; i--) {
        if (i + myPits[i] == pits) {
            moves[moveCount++] = i;
        }
    }

    // steals from left to right
    for (int i = 0; i < pits; i++) {
        int val = myPits[i];
        if (val > 0 && i + val < pits && myPits[i + val] == 0  && hisPits[pits - (i + val) - 1] > 0) {
            moves[moveCount++] = i;
        }
    }

    // normal moves from right to left
    for (int i = pits - 1; i >= 0; i--) {
        int val = myPits[i];
        if (val && i + val != pits && !(i + val < pits && myPits[i + val] == 0 && hisPits[pits - (i + val) - 1] > 0)) {
            moves[moveCount++] = i;
        }
    }

    moves[moveCount] = -1; // terminator

    return moves;
}


// basic evaluation function
int BoardPosition::getPointDiff(){

    int myStore = southTurn ? southStore : northStore;

    if(myStore >= seedsToWin){
        return MAX_SCORE;
    }

    int theirStore = southTurn ? northStore : southStore;

    if(theirStore >= seedsToWin){
        return MIN_SCORE;
    }

    return myStore - theirStore;
}


// advanced evaluation function
int BoardPosition::getScore(){

    int myStore = southTurn ? southStore : northStore;

    if(myStore >= seedsToWin){
        return MAX_SCORE;
    }

    int theirStore = southTurn ? northStore : southStore;

    if(theirStore >= seedsToWin){
        return MIN_SCORE;
    }

    if(gameOver){
        return 0; // only option left
    }

    // count all extra moves from right to left
    int extraMoves = 0;
    const int* myPits = southTurn ? southPits : northPits;
    for(int i = 0; i < pits; i++){
        if(i + myPits[i] == pits){
            extraMoves++;
        }
    }

    if(extraMoves > 0){
        extraMoves += 2;
    }

    return extraMoves + myStore - theirStore;
}
