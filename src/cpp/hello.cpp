#include <stdio.h>

extern "C" {
    int hello(int  x) {
        printf("Hello World from this function\n");
        return 3;
    }
}