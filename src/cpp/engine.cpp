#include <iostream>
#include <vector>
#include <string>

using namespace std;

struct BoardPosition {
    int pits;
    vector<int> southPits;
    vector<int> northPits;
    int southStore;
    int northStore;
    bool southTurn;
    bool gameOver;
};

extern "C" {

    int getBestMove(const char* b) {
        string board(b);
        cout << board << endl;
        return 3;
    }
}