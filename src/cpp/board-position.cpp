#include "board-position.h"
#include <sstream>

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
    // result += "southTurn: " + string(southTurn ? "true" : "false") + ", gameOver: " + string(gameOver ? "true" : "false") + ", pits: " + to_string(pits) + "\n";

    return result;
}

void BoardPosition::doMove(int move) {
    vector<int> &myPits = southTurn ? southPits : northPits;
    vector<int> &hisPits = southTurn ? northPits : southPits;
    int &myStore = southTurn ? southStore : northStore;

    bool currentlyMySide = true;
    int hand = myPits[move];
    myPits[move] = 0;

    while(hand > 0){
        move = (move + 1) % (pits + 1);

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
            currentlyMySide = !currentlyMySide;
        }
    }

    // check for steal
    int oppositePit = pits - move - 1;
    if(currentlyMySide && myPits[move] == 1 && hisPits[oppositePit] > 0){
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
        int &hisStore = southTurn ? northStore: southStore;
        for(int i = 0; i < pits; i++){
            myStore += myPits[i];
            myPits[i] = 0;
            hisStore += hisPits[i];
            hisPits[i] = 0;
        }
        gameOver = true;
        return;
    }

    // switch side if no bonus move (do this after gameOver otherwise hisStore could be incorrect)
    // if there was a bonus move then we stopped at move=0 and currentlyMySide=false
    southTurn = !southTurn;
    if(!currentlyMySide && move == pits){
        southTurn = !southTurn;
    }
}

// returns valid moves starting from the rightmost pit
vector<int> BoardPosition::getMoves() const {
    vector<int> moves;
    const vector<int>& myPits = southTurn ? southPits : northPits;
    for (int i = pits - 1; i >= 0; i--) {
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