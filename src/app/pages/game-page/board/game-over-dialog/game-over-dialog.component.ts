import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialogActions, MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from "@angular/material/dialog";

import {PlayerType} from "../../../../models/player-type.enum";
import {DialogData} from "../board.component";

@Component({
    selector: 'app-game-over-dialog',
    standalone: true,
    imports: [
        MatButton,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose
    ],
    templateUrl: './game-over-dialog.component.html',
    styleUrl: './game-over-dialog.component.scss'
})
export class GameOverDialogComponent {
    private data = inject<DialogData>(MAT_DIALOG_DATA);
    private board = this.data.board;
    private playerSouth = this.data.playerSouth;
    private playerNorth = this.data.playerNorth;

    gameOverMessage(): string {

        // check for draw
        if(this.board.southStore === this.board.northStore){
            return 'It is a draw';
        }

        // check if exactly one of the players is Local
        const playerVsCom = (this.playerSouth === PlayerType.Local || this.playerNorth === PlayerType.Local) && (this.playerSouth !== this.playerNorth);
        if(playerVsCom){
            const winner = this.board.southStore > this.board.northStore ? this.playerSouth : this.playerNorth;
            const lossOrWin = winner === PlayerType.Local ? 'won' : 'lost';
            return 'You ' +  lossOrWin;
        }

        // print out the winner (north or south)
        return this.board.southStore > this.board.northStore ? 'South ('  + this.playerSouth + ') won' : 'North (' + this.playerNorth + ') won';
    }
}
