#include <iostream>
#include <cstdlib>
#include <chrono>

using namespace std;

/*
    tested using 
    time ./a.out

    results:
    numbers are different even when I do it multiple times in the same second
    (as opposed to srand(time(0)) which would give the same number)
 */

int main(int argc, char *argv[]) {

    int seed = chrono::system_clock::now().time_since_epoch().count();
    cout << seed << endl;

    srand(seed);

    cout << rand() << endl;

    return 0;
}