#ifndef BOARD_POSITION_H
#define BOARD_POSITION_H

#include <vector>
#include <string>

// using INT_MAX/MIN was bad because MIN can't be negated
#define MAX_SCORE 1000000
#define MIN_SCORE -1000000

#define MAX_PIT_SIZE 20

/* 
    To document some of the speed improvements I made:
    - 252ms to 5ms for creating board copies: use int[20] instead of vector<int>, maxSize is annoying but worth it
    - 65ms to 45ms for doMove: instead of move = (move + 1) % (pits + 1); use move++ with if(move == pits) move = -1;

*/

struct BoardPosition {
    int pits;
    int seedsToWin;
    int southPits[MAX_PIT_SIZE];
    int northPits[MAX_PIT_SIZE];
    int southStore;
    int northStore;
    bool southTurn;
    bool gameOver;

    std::string toString() const;
    std::vector<int> getMoves();
    void doMove(int move);
    int getScore();
};

#endif