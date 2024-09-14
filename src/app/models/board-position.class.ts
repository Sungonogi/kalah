/*
    represents one position the board can be in
 */

export class BoardPosition {
    pits: number; // size of southPits and northPits
    southPits: number[];
    northPits: number[];
    southStore: number;
    northStore: number;
    southTurn: boolean; // true if south has the turn

    /**
     * Creates an instance of BoardPosition.
     * @param {number} pits - The number of pits on each side.
     * @param {number} seeds - The initial number of seeds in each pit.
     */
    constructor(pits: number, seeds: number) {
        this.pits = pits;
        this.southPits = Array(pits).fill(seeds);
        this.northPits = Array(pits).fill(seeds);
        this.southStore = 0;
        this.northStore = 0;
        this.southTurn = true;
    }

    /**
     * Checks if a move is legal, assumes it is in bounds
     * @param {number} position - The position of the pit to move from.
     * @param {boolean} onSouthSide - True if the move is on the south side.
     * @returns {boolean} - True if the move is legal.
     */
    checkLegalMove(position: number, onSouthSide: boolean): boolean {
        if(onSouthSide !== this.southTurn){
            return false;
        }
        const myPits = onSouthSide ? this.southPits : this.northPits;
        return myPits[position] > 0;
    }

    /**
     * assumes the move is legal (and thus on the side that has the turn)
     * @param {number} position - The position of the pit to move from.
     * @returns {boolean} - True if the move ends the game.
     */
    performLegalMove(position: number): boolean {
        const myPits = this.southTurn? this.southPits : this.northPits;
        const hisPits = this.southTurn ? this.northPits : this.southPits;
        const myStore = this.southTurn ? 'southStore' : 'northStore';

        let currentlyMySide = true;
        let hand = myPits[position];

        while (hand > 0) {
            position = (position + 1) % (this.pits + 1);

            if (position < this.pits) {
                hand--;
                if (currentlyMySide) {
                    myPits[position]++;
                } else {
                    hisPits[position]++;
                }
            } else {
                if (currentlyMySide) {
                    hand--;
                    this[myStore]++;
                }
                currentlyMySide = !currentlyMySide;
            }
        }

        // check for steal
        const mirrored = this.pits - position - 1;
        if (currentlyMySide && myPits[position] === 1 && hisPits[mirrored] > 0) {
            this[myStore] += myPits[position] + hisPits[mirrored];
            myPits[position] = 0;
            hisPits[mirrored] = 0;
        }

        // check for bonus move in case it lands in our store
        if (currentlyMySide || position !== this.pits) {
            this.southTurn = !this.southTurn;
        }

        // check if the game is over
        const sum = (a: number, b: number) => a + b;
        const southSum = this.southPits.reduce(sum);
        const northSum = this.northPits.reduce(sum);
        if (southSum === 0 || northSum === 0) {
            this.northStore += northSum;
            this.northPits.fill(0);
            this.southStore += southSum;
            this.southPits.fill(0);
            return true;
        }
        return false;
    }

}