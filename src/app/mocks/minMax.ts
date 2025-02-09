// These test cases were generated by a previous java version of the algorithm
// in all of them choosing a different move than correctMove results in a worse position (win -> draw/loss or draw -> loss)
// and there have to be at least 2 available moves to choose from (otherwise it would be useless)
// I also removed all cases that took more than 100ms to compute
export const testCases = [
    {
        boardPosition: {
            pits: 6,
            southPits: [0, 1, 0, 2, 0, 0],
            northPits: [0, 0, 0, 0, 3, 1],
            southStore: 2,
            northStore: 4,
            southTurn: false,
            gameOver: false
        },
        correctMove: 5, // eval Infinity
    },
    {
        boardPosition: {
            pits: 2,
            southPits: [2, 1],
            northPits: [1, 2],
            southStore: 3,
            northStore: 3,
            southTurn: true,
            gameOver: false
        },
        correctMove: 1, // eval 0.0
    },
    {
        boardPosition: {
            pits: 4,
            southPits: [1, 0, 1, 1],
            northPits: [1, 1, 0, 0],
            southStore: 0,
            northStore: 3,
            southTurn: true,
            gameOver: false
        },
        correctMove: 3, // eval Infinity
    },
    {
        boardPosition: {
            pits: 2,
            southPits: [1, 0],
            northPits: [2, 1],
            southStore: 1,
            northStore: 0,
            southTurn: false,
            gameOver: false
        },
        correctMove: 1, // eval Infinity
    },
    {
        boardPosition: {
            pits: 6,
            southPits: [0, 0, 0, 2, 3, 2],
            northPits: [0, 1, 0, 0, 0, 1],
            southStore: 0,
            northStore: 4,
            southTurn: false,
            gameOver: false
        },
        correctMove: 5, // eval Infinity
    },
    {
        boardPosition: {
            pits: 3,
            southPits: [1, 1, 1],
            northPits: [2, 2, 0],
            southStore: 1,
            northStore: 1,
            southTurn: true,
            gameOver: false
        },
        correctMove: 2, // eval Infinity
    },
    {
        boardPosition: {
            pits: 2,
            southPits: [2, 1],
            northPits: [3, 2],
            southStore: 1,
            northStore: 0,
            southTurn: false,
            gameOver: false
        },
        correctMove: 0, // eval Infinity
    },
    {
        boardPosition: {
            pits: 2,
            southPits: [1, 2],
            northPits: [4, 2],
            southStore: 2,
            northStore: 1,
            southTurn: true,
            gameOver: false
        },
        correctMove: 0, // eval Infinity
    },
    {
        boardPosition: {
            pits: 3,
            southPits: [0, 2, 1],
            northPits: [1, 1, 2],
            southStore: 2,
            northStore: 1,
            southTurn: true,
            gameOver: false
        },
        correctMove: 2, // eval 0.0
    },
    {
        boardPosition: {
            pits: 4,
            southPits: [0, 1, 2, 1],
            northPits: [1, 2, 0, 0],
            southStore: 3,
            northStore: 3,
            southTurn: false,
            gameOver: false
        },
        correctMove: 1, // eval Infinity
    },
    {
        boardPosition: {
            pits: 2,
            southPits: [3, 2],
            northPits: [2, 2],
            southStore: 3,
            northStore: 3,
            southTurn: true,
            gameOver: false
        },
        correctMove: 0, // eval Infinity
    },
    {
        boardPosition: {
            pits: 2,
            southPits: [1, 2],
            northPits: [1, 0],
            southStore: 3,
            northStore: 1,
            southTurn: true,
            gameOver: false
        },
        correctMove: 1, // eval Infinity
    },
    {
        boardPosition: {
            pits: 5,
            southPits: [0, 2, 1, 0, 0],
            northPits: [0, 0, 2, 2, 0],
            southStore: 4,
            northStore: 4,
            southTurn: false,
            gameOver: false
        },
        correctMove: 3, // eval Infinity
    },
    {
        boardPosition: {
            pits: 2,
            southPits: [1, 4],
            northPits: [2, 2],
            southStore: 3,
            northStore: 2,
            southTurn: true,
            gameOver: false
        },
        correctMove: 0, // eval Infinity
    },
    {
        boardPosition: {
            pits: 3,
            southPits: [3, 0, 2],
            northPits: [0, 1, 3],
            southStore: 0,
            northStore: 1,
            southTurn: true,
            gameOver: false
        },
        correctMove: 2, // eval -0.0
    },
    {
        boardPosition: {
            pits: 3,
            southPits: [2, 2, 2],
            northPits: [1, 1, 1],
            southStore: 4,
            northStore: 1,
            southTurn: false,
            gameOver: false
        },
        correctMove: 2, // eval -0.0
    },
    {
        boardPosition: {
            pits: 2,
            southPits: [2, 1],
            northPits: [1, 5],
            southStore: 3,
            northStore: 0,
            southTurn: false,
            gameOver: false
        },
        correctMove: 1, // eval Infinity
    },
    {
        boardPosition: {
            pits: 5,
            southPits: [0, 0, 1, 1, 2],
            northPits: [1, 0, 0, 1, 0],
            southStore: 2,
            northStore: 2,
            southTurn: false,
            gameOver: false
        },
        correctMove: 0, // eval 0.0
    },
    {
        boardPosition: {
            pits: 5,
            southPits: [3, 0, 2, 0, 2],
            northPits: [0, 0, 0, 1, 1],
            southStore: 2,
            northStore: 3,
            southTurn: false,
            gameOver: false
        },
        correctMove: 4, // eval Infinity
    },
    {
        boardPosition: {
            pits: 3,
            southPits: [2, 2, 2],
            northPits: [1, 1, 1],
            southStore: 3,
            northStore: 1,
            southTurn: true,
            gameOver: false
        },
        correctMove: 1, // eval Infinity
    },
    {
        boardPosition: {
            pits: 5,
            southPits: [1, 0, 0, 1, 0],
            northPits: [0, 0, 0, 1, 1],
            southStore: 4,
            northStore: 4,
            southTurn: true,
            gameOver: false
        },
        correctMove: 0, // eval Infinity
    },
    {
        boardPosition: {
            pits: 3,
            southPits: [1, 3, 2],
            northPits: [2, 0, 1],
            southStore: 3,
            northStore: 3,
            southTurn: false,
            gameOver: false
        },
        correctMove: 2, // eval Infinity
    },
    {
        boardPosition: {
            pits: 4,
            southPits: [1, 1, 1, 1],
            northPits: [2, 2, 1, 0],
            southStore: 1,
            northStore: 1,
            southTurn: false,
            gameOver: false
        },
        correctMove: 0, // eval Infinity
    },
    {
        boardPosition: {
            pits: 3,
            southPits: [2, 2, 0],
            northPits: [3, 1, 1],
            southStore: 0,
            northStore: 3,
            southTurn: true,
            gameOver: false
        },
        correctMove: 1, // eval Infinity
    },
    {
        boardPosition: {
            pits: 6,
            southPits: [0, 0, 1, 1, 0, 1],
            northPits: [2, 0, 1, 0, 0, 0],
            southStore: 0,
            northStore: 2,
            southTurn: false,
            gameOver: false
        },
        correctMove: 2, // eval Infinity
    },
    {
        boardPosition: {
            pits: 4,
            southPits: [0, 2, 2, 0],
            northPits: [0, 0, 1, 1],
            southStore: 2,
            northStore: 4,
            southTurn: true,
            gameOver: false
        },
        correctMove: 2, // eval -0.0
    },
    {
        boardPosition: {
            pits: 3,
            southPits: [2, 0, 2],
            northPits: [0, 1, 4],
            southStore: 0,
            northStore: 1,
            southTurn: false,
            gameOver: false
        },
        correctMove: 1, // eval Infinity
    },
    {
        boardPosition: {
            pits: 5,
            southPits: [0, 1, 0, 1, 1],
            northPits: [0, 3, 0, 0, 0],
            southStore: 0,
            northStore: 0,
            southTurn: true,
            gameOver: false
        },
        correctMove: 4, // eval Infinity
    },
    {
        boardPosition: {
            pits: 5,
            southPits: [1, 0, 3, 0, 0],
            northPits: [0, 1, 0, 1, 1],
            southStore: 4,
            northStore: 0,
            southTurn: true,
            gameOver: false
        },
        correctMove: 2, // eval Infinity
    },
    {
        boardPosition: {
            pits: 3,
            southPits: [0, 2, 1],
            northPits: [1, 1, 3],
            southStore: 4,
            northStore: 2,
            southTurn: true,
            gameOver: false
        },
        correctMove: 2, // eval 0.0
    },
    {
        boardPosition: {
            pits: 2,
            southPits: [3, 2],
            northPits: [2, 2],
            southStore: 2,
            northStore: 4,
            southTurn: true,
            gameOver: false
        },
        correctMove: 0, // eval Infinity
    },
    {
        boardPosition: {
            pits: 4,
            southPits: [1, 4, 2, 0],
            northPits: [1, 0, 1, 0],
            southStore: 1,
            northStore: 2,
            southTurn: false,
            gameOver: false
        },
        correctMove: 0, // eval Infinity
    },
    {
        boardPosition: {
            pits: 4,
            southPits: [1, 4, 0, 0],
            northPits: [1, 0, 2, 1],
            southStore: 4,
            northStore: 4,
            southTurn: true,
            gameOver: false
        },
        correctMove: 1, // eval Infinity
    },
    {
        boardPosition: {
            pits: 2,
            southPits: [3, 2],
            northPits: [1, 3],
            southStore: 2,
            northStore: 3,
            southTurn: false,
            gameOver: false
        },
        correctMove: 0, // eval Infinity
    },
    {
        boardPosition: {
            pits: 2,
            southPits: [2, 3],
            northPits: [1, 3],
            southStore: 3,
            northStore: 0,
            southTurn: true,
            gameOver: false
        },
        correctMove: 0, // eval Infinity
    },
    {
        boardPosition: {
            pits: 3,
            southPits: [1, 1, 4],
            northPits: [1, 0, 2],
            southStore: 3,
            northStore: 4,
            southTurn: true,
            gameOver: false
        },
        correctMove: 1, // eval Infinity
    },
    {
        boardPosition: {
            pits: 2,
            southPits: [4, 2],
            northPits: [1, 2],
            southStore: 4,
            northStore: 4,
            southTurn: false,
            gameOver: false
        },
        correctMove: 0, // eval Infinity
    },
    {
        boardPosition: {
            pits: 6,
            southPits: [0, 0, 0, 0, 2, 0],
            northPits: [1, 0, 0, 0, 0, 1],
            southStore: 3,
            northStore: 1,
            southTurn: false,
            gameOver: false
        },
        correctMove: 5, // eval Infinity
    },
];