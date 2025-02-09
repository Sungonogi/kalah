export const testCases = [
    {
        boardPosition: {
            pits: 2,
            southPits: [1, 1],
            northPits: [1, 1],
            southStore: 0,
            northStore: 0,
            southTurn: true,
            gameOver: false
        },
        correctMove: 1, // 0 immediately loses
    },
    {
        boardPosition: {
            pits: 2,
            southPits: [2, 2],
            northPits: [2, 2],
            southStore: 0,
            northStore: 0,
            southTurn: true,
            gameOver: false
        },
        correctMove: 1, // 0 immediately loses
    },
    {
        boardPosition: {
            pits: 3,
            southPits: [1, 0, 0],
            northPits: [0, 1, 1],
            southStore: 3,
            northStore: 0,
            southTurn: false,
            gameOver: false
        },
        correctMove: 2, // 1 loses
    },
    {
        boardPosition: {
            pits: 3,
            southPits: [2, 2, 2],
            northPits: [2, 2, 2],
            southStore: 0,
            northStore: 0,
            southTurn: true,
            gameOver: false
        },
        correctMove: 1, // forces a win
    },
    {
        boardPosition: {
            pits: 3,
            southPits: [1, 0, 0],
            northPits: [1, 2, 0],
            southStore: 0,
            northStore: 0,
            southTurn: false,
            gameOver: false
        },
        correctMove: 1, // move pieces away so they arent captured
    },
    
]