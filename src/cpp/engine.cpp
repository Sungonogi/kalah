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
    
    char* getBestMove(const char* b) {
        cout << "Wasm received: " << b << endl;

        return (char*) "{ \"move\": 1, \"comment\": \"This is a comment\" }";
    }
}