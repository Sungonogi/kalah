#include "../board-position.cpp"
#include <iostream>
#include <chrono>

using namespace std;
using namespace std::chrono;

void assertSameMoves(BoardPosition bp);

int main() {
    // Create a mock BoardPosition object
    BoardPosition mockBoard;
    mockBoard.pits = 6;
    mockBoard.southStore = 0;
    mockBoard.northStore = 0;
    mockBoard.southTurn = true;
    mockBoard.gameOver = false;
    int seeds = 12;
    for(int i = 0; i < mockBoard.pits; i++){
        mockBoard.southPits[i] = seeds;
        mockBoard.northPits[i] = seeds;
    }
    mockBoard.seedsToWin = (mockBoard.pits * seeds) / 2 + 1;

    // test the getMoves function
    assertSameMoves(mockBoard);
    mockBoard.southPits[mockBoard.pits - 2] = 0; // add a steal
    assertSameMoves(mockBoard);


    // test the score function
    mockBoard.southStore = 10;
    mockBoard.northStore = 5;
    if(mockBoard.getScore() != 5){
        cerr << "getScore failed" << endl;
        exit(1);
    }

    return 0;
}

void assertSameMoves(BoardPosition bp){
    cout << bp.toString() << endl;

    auto moves = bp.getMoves2();
    vector<int> actualMoves = bp.getMovesVector();

    cout << "Moves: ";
    for(int i = 0; i < bp.pits; i++){
        if(moves[i] == -1){
            break;
        }
        cout << moves[i] << " ";
    }

    int length = 0;
    for(int i = 0; i < bp.pits; i++){
        if(moves[i] != -1){
            length++;
        } else {
            break;
        }
    }

    if(length != actualMoves.size()){
        cerr << "getMoves and getMovesVector return different results" << endl;
        exit(1);
    }

    for(int move: actualMoves){
        for(int i = 0; i < length; i++){
            if(moves[i] == move){
                break;
            }
            if(i == length - 1){
                cerr << "getMoves and getMovesVector return different results" << endl;
                exit(1);
            }
        }

    }
}