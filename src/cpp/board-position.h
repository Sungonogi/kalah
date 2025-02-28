#ifndef BOARD_POSITION_H
#define BOARD_POSITION_H

#include <vector>
#include <string>

// using INT_MAX/MIN was bad because MIN can't be negated
#define MAX_SCORE 1000000
#define MIN_SCORE -1000000

struct BoardPosition {
    int pits;
    int seedsToWin;
    std::vector<int> southPits;
    std::vector<int> northPits;
    int southStore;
    int northStore;
    bool southTurn;
    bool gameOver;

    std::string toString() const;

    std::vector<int> getMoves() const;
    void doMove(int move);
    int getScore();
};

#endif