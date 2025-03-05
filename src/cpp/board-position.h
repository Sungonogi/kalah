#ifndef BOARD_POSITION_H
#define BOARD_POSITION_H

#include <array>
#include <vector>
#include <string>

// using INT_MAX/MIN was bad because MIN can't be negated
#define MAX_SCORE 1000000
#define MIN_SCORE -1000000

#define MIN_SCOREF -1000000.0
#define MAX_SCOREF 1000000.0

#define MAX_PIT_SIZE 14

/* 
    To document some of the speed improvements I made:
    - 252ms to 5ms for creating board copies: use int[MAX_PIT_SIZE] instead of vector<int>, maxSize is annoying but worth it
    - 60ms to 3 ms for getMoves: use array<int, MAX_PIT_SIZE + 1> terminated with -1 instead of vector<int>
    - 65ms to 45ms for doMove with 12 seeds: instead of move = (move + 1) % (pits + 1); use move++ with if(move == pits) move = -1;
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
    std::array<int, MAX_PIT_SIZE + 1> getMoves(); // -1 terminated array
    std::array<int, MAX_PIT_SIZE + 1> getMoves2(); // -1 terminated array
    std::array<int, MAX_PIT_SIZE + 1> getMoves2Bug(); // -1 terminated array
    std::array<int, MAX_PIT_SIZE + 1> getMoves3(); // -1 terminated array
    std::vector<int> getMovesVector();
    void doMove(int move);
    int getScore();
    int getScore2();
    float getScore3();
};

#endif