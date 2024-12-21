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
    int hello(const char* board) {
        cout << board << endl;
        return 3;
    }
}