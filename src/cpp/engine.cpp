#include <emscripten/bind.h>
#include <iostream>
#include "json.hpp"

using namespace std;
using json = nlohmann::json;

struct BoardPosition {
    int pits;
    vector<int> southPits;
    vector<int> northPits;
    int southStore;
    int northStore;
    bool southTurn;
    bool gameOver;
};

string getBestMove(string b) {

    cout << "received " << b << "\n";

    json jsonObj = json::parse(b);
    cout << jsonObj["playerType"] << endl;

    return "{ \"move\": 1, \"comment\": \"This is a comment\" }";
}

EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("getBestMove", &getBestMove);
}
