#include <iostream>
#include <vector>

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


int main() {
    BoardPosition original;
    original.pits = 6;
    original.southPits = {4, 4, 4, 4, 4, 4};
    original.northPits = {4, 4, 4, 4, 4, 4};
    original.southStore = 0;
    original.northStore = 0;
    original.southTurn = true;
    original.gameOver = false;

    BoardPosition &test = original;

    // Create a deep copy using the copy constructor
    BoardPosition copy = test;

    // Modify the original to show that the copy is independent
    original.southPits[0] = 0;

    // The copy remains unchanged
    cout << "Original southPits[0]: " << original.southPits[0] << endl;
    cout << "Copy southPits[0]: " << copy.southPits[0] << endl;

    return 0;
}