#include <emscripten/bind.h>
#include <iostream>

using namespace emscripten;

std::string getBestMove(std::string b) {

    std::cout << "received" << b;
    return "{ \"move\": 1, \"comment\": \"This is a comment\" }";
}

EMSCRIPTEN_BINDINGS(my_module) {
    function("getBestMove", &getBestMove);
}
