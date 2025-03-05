#include "../board-position.cpp"
#include "../min-max-nab.cpp"
#include "../min-max-ab.cpp"
#include "../min-max-ab-s2.cpp"
#include "../min-max-ab-s2-do.cpp"
#include "../min-max-ab-s2-ge.cpp"
#include "../min-max-ab-s2-ec.cpp"
#include "../min-max-ab-s3-ec.cpp"
#include "../min-max-ab-s2-ec-o2.cpp"
#include "../min-max-ab-s2-ec-o2bug.cpp"
#include "../min-max-ab-s2-ec-o3.cpp"
#include "../min-max-ab-s2-ec-o4.cpp"
#include "../min-max-ab-s2-ec-o2-dc.cpp"
#include "../min-max-ab-s2-ec-o2-h.cpp"
#include "../min-max-ab-s4-ec-o2-h.cpp"
#include "../min-max-ab-s5-ec-o2-h.cpp"

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

        b.pits = rand() % 6 + 3;
        int seeds = rand() % 4 + 1;

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
    if (argc < 3) {
        cerr << "Usage: " << argv[0] << " <numBoards>" << " <timeOrDepthLimit>" << "<useTimeLimit so 0/1 (optional)>" << endl;
        return 1;
    }
    
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

    auto mma1 = MinMaxABS4ECO2H();
    auto mma2 = MinMaxABS5ECO2H();

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

            
            if(m.move == -1){
                cout << "Error move was -1" << endl;
            }


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
    normal vs o2: depth: o2 is 8% better, time: o2 is 9% better with depth 11.96 (greater than normal 11.71)

normal: ab-s2-ec-o2

    found bug in getMoves that added non steal moves first
    normal vs o2bug: depth: no measurable difference (-1% to 1%), time: -3 to 3% depending on if we have loop boards
    -> I'll still keep the fixed version because it's more logical

    tested with b.pits = rand() % 6 + 2; int seeds = rand() % 10 + b.pits;
    bug vs o3: depth: o3 is 1-2% better, time: bug is 2-3% better
    o2 vs o3: depth: o2 is 1% better, time: o2 is 4% better
    -> no measurable improvement even for these specific boards
    -> undo b.pits and seeds change

    o2 vs o4: depth: o4 is 3-4% better, time: o2 is 10% better but similar depths
    -> o4 (right left, except steals) is not better for time (for some reason)
    adjust o4 more:
        o4 with left right always: loses on time
        o4 with a bunch of other things: never worked

    
    o2 vs dc: depth: o2 is 3% better which makes sense as dc just searches less, time: dc is 1% better 
    o2 vs hash: time: hash is consistently 1-1.5% better
    dc vs hash: time: hash is 5% better
    
normal: ab-s2-ec-o2-h
    s4 with reward for more seeds: not better on time
    s4 with -0.75 or -0.25: not better
    s4 with 3*extraMoves: depth: 8% better, time: 10-15% better


*/