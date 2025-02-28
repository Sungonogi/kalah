#include <iostream>
#include <cstdlib>

using namespace std;

/*
    tested using 
    time ./a.out 0 12 1000000000
    time ./a.out 1 12 1000000000

    results: 
    modulo: 0m2.997s
    conditional: 0m1.263s

    -> use conditional
 */

int main(int argc, char *argv[]) {

    int test = atoi(argv[1]);
    int divisor = atoi(argv[2]);
    int iterations = atoi(argv[3]);

    int a = 0;

    if (test == 0) {
        for (int i = 0; i < iterations; i++)
            a = (a + 1) % divisor;
    } else if (test == 1) {
        for (int i = 0; i < iterations; i++)
            a = a + 1 == divisor ? 0 : a + 1;
    }

    cout << a << endl;

    return 0;
}