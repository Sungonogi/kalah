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
            move = -1; // reset move to -1 so it will be incremented to 0
            currentlyMySide = !currentlyMySide;
        }
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

    // switch side if no bonus move (do this after gameOver otherwise hisStore could be incorrect)
    // if there was a bonus move then we stopped at move=0 and currentlyMySide=false
    southTurn = !southTurn;
    if(!currentlyMySide && move == -1){
        southTurn = !southTurn;
    }
}

// returns valid moves in a good order for alpha beta pruning
array<int, MAX_PIT_SIZE + 1> BoardPosition::getMoves() {

    array<int, MAX_PIT_SIZE + 1> moves = {};
    const int* myPits = southTurn ? southPits : northPits;

    int moveCount = 0;

    // add extra moves first
    for (int i = pits - 1; i >= 0; i--) {
        if (myPits[i] > 0 && i + myPits[i] == pits) {
            moves[moveCount++] = i;
        }
    }

    // add normal moves
    for (int i = pits - 1; i >= 0; i--) {
        if (myPits[i] > 0 && i + myPits[i] != pits) {
            moves[moveCount++] = i;
        }
    }

    moves[moveCount] = -1; // terminator

    return moves;
}

array<int, MAX_PIT_SIZE + 1> BoardPosition::getMoves2Bug() {

    array<int, MAX_PIT_SIZE + 1> moves = {};
    const int* myPits = southTurn ? southPits : northPits;

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
        if (val > 0 && i + val < pits && myPits[i + val] == 0) {
            moves[moveCount++] = i;
        }
    }

    // normal moves from right to left
    for (int i = pits - 1; i >= 0; i--) {
        int val = myPits[i];
        if (val && i + val != pits && !(i + val < pits && myPits[i + val] == 0)) {
            moves[moveCount++] = i;
        }
    }

    moves[moveCount] = -1; // terminator

    return moves;
}

// fixed it to actually only move steals in front
array<int, MAX_PIT_SIZE + 1> BoardPosition::getMoves2() {

    array<int, MAX_PIT_SIZE + 1> moves = {};
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

// byte
array<int8_t, MAX_PIT_SIZE + 1> BoardPosition::getMoves2Byte() {

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



// this one also recognizes steals/ extra Moves when you loop around
array<int, MAX_PIT_SIZE + 1> BoardPosition::getMoves3() {

    const int* myPits = southTurn ? southPits : northPits;
    const int* hisPits = southTurn ? northPits : southPits;

    // 0 means invalid, 1 means extra, 2 means steal, 3 means normal
    int moveTypes[MAX_PIT_SIZE] = {};

    int circle = 2*pits + 1;

    for(int i = 0; i < pits; i++){
        int val = myPits[i];
        if(val == 0){
            moveTypes[i] = 0;
        } else if(i + (val % circle) == pits){
            moveTypes[i] = 1;
        } else if(
            (i + val < pits && myPits[i + val] == 0 && hisPits[pits - (i + val) - 1] > 0) || // steal immediately
            (val == circle) || // loop around exactly once and end where we started
            (val < circle && i + val - circle >= 0 && myPits[i + val - circle] == 0) // end behind starting pit and steal
        ){
            moveTypes[i] = 2;
        } else {
            moveTypes[i] = 3;
        }
    }

    array<int, MAX_PIT_SIZE + 1> moves = {};
    int moveCount = 0;
    for(int type = 1; type <= 3; type++){
        for(int i = pits - 1; i >= 0; i--){

            // go from left to right for steals
            int move = type != 2 ? i : pits - i - 1;

            if(moveTypes[move] == type){
                moves[moveCount++] = move;
            }
        }
    }

    moves[moveCount] = -1; // terminator

    return moves;
}

array<int, MAX_PIT_SIZE + 1> BoardPosition::getMoves4() {

    const int* myPits = southTurn ? southPits : northPits;
    const int* hisPits = southTurn ? northPits : southPits;

    // 0 means invalid, 1 means extra, 2 means never left our half, 3 means we left our side
    int moveTypes[MAX_PIT_SIZE] = {};

    for(int i = 0; i < pits; i++){
        int val = myPits[i];
        if(val == 0){
            moveTypes[i] = 0;
        } else if(i + val == pits){
            moveTypes[i] = 1;
        } else if(i + val < pits){
            moveTypes[i] = 2;
        } else {
            moveTypes[i] = 3;
        }
    }

    array<int, MAX_PIT_SIZE + 1> moves = {};
    int moveCount = 0;
    for(int type = 1; type <= 3; type++){
        for(int i = pits - 1; i >= 0; i--){

            // go from left to right for steals
            int move = type != 2 ? i : pits - i - 1;

            if(moveTypes[move] == type){
                moves[moveCount++] = move;
            }
        }
    }

    moves[moveCount] = -1; // terminator

    return moves;
}


// returns valid moves as a vector from left to right
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

// basic evaluation function
int BoardPosition::getScore(){

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

int BoardPosition::getScore2(){

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

    return extraMoves + myStore - theirStore;
}

float BoardPosition::getScore3(){

    int myStore = southTurn ? southStore : northStore;

    if(myStore >= seedsToWin){
        return MAX_SCOREF;
    }

    int theirStore = southTurn ? northStore : southStore;

    if(theirStore >= seedsToWin){
        return MIN_SCOREF;
    }

    if(gameOver){
        return 0; // only option left
    }

    // copy my pits
    int* myPits = southTurn ? southPits : northPits;
    int myPitsCpy[MAX_PIT_SIZE];
    for(int i = 0; i < pits; i++){
        myPitsCpy[i] = myPits[i];
    }

    // do all possible extra moves from right to left
    int move = pits - 1;
    while(move >= 0){
        
        if(move + myPitsCpy[move] == pits){
            myPitsCpy[move] = 0;
            for(int i = move + 1; i < pits; i++){
                myPitsCpy[i]++;
            }
            myStore++;
            move = pits -1;
        } else {
            move--;
        }
    }

    return myStore - theirStore - 0.25f;
}
