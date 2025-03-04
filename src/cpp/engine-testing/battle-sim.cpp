#include "../board-position.cpp"
#include "../min-max-nab.cpp"
#include "../min-max-ab.cpp"
#include "../min-max-ab-s2.cpp"
#include "../min-max-ab-s2-do.cpp"
#include "../min-max-ab-s2-ge.cpp"
#include "../min-max-ab-s2-ec.cpp"
#include "../min-max-ab-s3-ec.cpp"
#include "../min-max-ab-s2-ec-o2.cpp"


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
        b.seedsToWin = (seeds * b.pits) + 1;


        // do some random moves
        bool retry = false;
        int moves = rand() % 3;
        for(int i = 0; i < moves; i++){
            vector<int> validMoves = b.getMovesVector();
            if(validMoves.size() == 0){
                retry = true;
                break;
            }

            int move = validMoves[rand() % validMoves.size()];
            b.doMove(move);
        }

        // get rid of already decided games
        BoardPosition tmp = b;
        MinMaxAB mma = MinMaxAB();
        MinMaxResult m = mma.doMinMaxWithMaxDepth(tmp, 5);
        if(retry || m.score < 4 || m.score > 4){
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

        boards.push_back(b);
        boards.push_back(cpy);
    }
    return boards;
}

int main(int argc, char** argv) {
    // read numBoards from argv
    if (argc < 3)
        cerr << "Usage: " << argv[0] << " <numBoards>" << " <timeOrDepthLimit>" << "<useTimeLimit so 0/1 (optional)>" << endl;

    int numBoards = stoi(argv[1]);


    int timeOrDepthLimit = stoi(argv[2]);

    bool useTimeLimit = argc > 3 && stoi(argv[3]) == 1;

    int p1Wins = 0;
    int p2Wins = 0;
    int draws = 0;

    int p1TotalTime = 0;
    int p1ReqCount = 0;

    int p2TotalTime = 0;
    int p2ReqCount = 0;

    MinMaxABS2EC mma1 = MinMaxABS2EC();
    MinMaxABS2ECO2 mma2 = MinMaxABS2ECO2();

    for(auto board : generateRandomBoards(numBoards)){

        while(!board.gameOver){

            auto start = high_resolution_clock::now();
            BoardPosition cpy = board;
            MinMaxResult m;
            if(board.southTurn) {
                m = useTimeLimit ? mma1.doMinMaxWithTimeLimit(cpy, timeOrDepthLimit) : mma1.doMinMaxWithMaxDepth(cpy, timeOrDepthLimit);
            } else {
                m = useTimeLimit ? mma2.doMinMaxWithTimeLimit(cpy, timeOrDepthLimit) : mma2.doMinMaxWithMaxDepth(cpy, timeOrDepthLimit);
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

        cout << "P1: " << p1Wins << ", P2: " << p2Wins << ", Draws: " << draws << " p1 time: " << p1TotalTime / p1ReqCount << ", p2 time: " << p2TotalTime / p2ReqCount << ", avgDepth1 " << mma1.getAvgDepth() << ", avgDepth2 " << mma2.getAvgDepth() << endl;
    }

    cout << "P1 won " << (100.0 * ( (float) p1Wins - p2Wins)) / ( (float) numBoards * 2) << " percent more games" << endl;

    return 0;
}

/*
To document some findings
usually test with 400 boards and maxDepth 6
for Time I use 400 boards and timelimit 3

normal: ab-s2
    normal vs do -> depth: p1 15% better
    do vs ge -> depth: p2 is 2% better
    normal vs ge -> depth: p2 is 10% better, time: p1 10% better

    normal vs ec -> depth: equal, time: p2 is 7% better and reached further depths

normal: ab-s2-ec
    normal vs s3: depth: s3 is 6% better, time: s3 is slightly worse
    normal vs o3: depth: o3 is 8% better, time: o3 is 9% better with depth (11.96 greater than 11.71)
*/