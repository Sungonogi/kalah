#include "../board-position.cpp"
#include "../min-max.cpp"
#include <iostream>
#include <chrono>

using namespace std;
using namespace std::chrono;


vector<BoardPosition> generateRandomBoards(int numBoards) {

    srand(numBoards);

    vector<BoardPosition> boards;
    for(int i = 0; i < numBoards; i++) {
        BoardPosition b;
        b.southStore = 0;
        b.northStore = 0;
        b.gameOver = false;
        b.southTurn = false;

        b.pits = rand() % 6 + 4;
        int seeds = rand() % 5 + 1;

        for(int i = 0; i < b.pits; i++){
            b.southPits[i] = seeds;
            b.northPits[i] = seeds;
        }
        b.seedsToWin = (seeds * b.pits) / 2 + 1;


        // do some random moves
        bool retry = false;
        int moves = rand() % 5;
        for(int i = 0; i < moves; i++){
            vector<int> validMoves = b.getMovesVector();
            if(validMoves.size() == 0){
                retry = true;
                break;
            }

            int move = validMoves[rand() % validMoves.size()];
            b.doMove(move);
        }

        if(retry){
            i--;
            continue;
        }

        BoardPosition cpy = b;
        cpy.southTurn = !b.southTurn;
        for(int j = 0; j < b.pits; j++){
            swap(cpy.southPits[j], cpy.northPits[j]);
        }
        swap(cpy.southStore, cpy.northStore);

        if(cpy.getMovesVector().size() == 0){
            i--;
            continue;
        }

        cout << b.toString() << endl;
        cout << cpy.toString() << endl;

        boards.push_back(b);
        boards.push_back(cpy);
    }
    return boards;
}

int main(int argc, char** argv) {
    // read numBoards from argv
    if (argc < 2)
        cerr << "Usage: " << argv[0] << " <numBoards>" << endl;

    int numBoards = stoi(argv[1]);

    int p1Wins = 0;
    int p2Wins = 0;
    int draws = 0;

    int p1TotalTime = 0;
    int p1ReqCount = 0;

    int p2TotalTime = 0;
    int p2ReqCount = 0;

    for(auto board : generateRandomBoards(numBoards)){

        while(!board.gameOver){

            auto start = high_resolution_clock::now();
            BoardPosition cpy = board;
            MinMaxResult m;
            if(board.southTurn){
                m = doMinMaxWithTimeLimit(cpy, 4);
            } else {
                m = doMinMaxWithTimeLimit2(cpy, 4);
            }
            
            auto end = high_resolution_clock::now();
            auto duration = duration_cast<milliseconds>(end - start).count();
            if(board.southTurn){
                p1TotalTime += duration;
                p1ReqCount++;
            } else {
                p2TotalTime += duration;
                p2ReqCount++;
            }

            board.doMove(m.move);
        }

        if(board.southStore > board.northStore){
            p1Wins++;
        } else if(board.southStore < board.northStore){
            p2Wins++;
        } else {
            draws++;
        }

        cout << "P1: " << p1Wins << ", P2: " << p2Wins << ", Draws: " << draws << " p1 time: " << p1TotalTime / p1ReqCount << ", p2 time: " << p2TotalTime / p2ReqCount << endl;
    }

    return 0;
}