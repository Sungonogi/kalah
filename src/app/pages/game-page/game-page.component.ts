import {Component, inject, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {Router, RouterLink} from "@angular/router";
import {Observable} from "rxjs";

import {BoardPosition} from "../../models/board-position.model";
import {PlayerType} from "../../models/player-type.enum";
import {StartParamsStore} from "../../stores/start-params/start-params.store";
import {BoardComponent} from "./board/board.component";
import {GameOverDialogComponent, GameOverDialogData} from "./game-over-dialog/game-over-dialog.component";
import {WarningDialogComponent, WarningDialogData} from "./warning-dialog/warning-dialog.component";

@Component({
    selector: 'app-game-page',
    standalone: true,
    imports: [
        BoardComponent,
        MatButton,
        RouterLink
    ],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.scss'
})
export class GamePageComponent {

    private startParamsStore = inject(StartParamsStore);
    
    protected playerSouth!: PlayerType;
    protected playerNorth!: PlayerType;

    @ViewChild(BoardComponent) boardComponent!: BoardComponent;

    private skipNaviWarning = false;

    constructor(
            private matDialog: MatDialog,
            private router: Router
    ) {}
    
    private restart(){
        this.skipNaviWarning = false;
        this.boardComponent.resetBoard();
    }
    
    
    showGameOverDialog(board: BoardPosition){
        setTimeout(() => {
            const data: GameOverDialogData = {
                board: board,
                playerSouth: this.startParamsStore.playerSouth(),
                playerNorth: this.startParamsStore.playerNorth()
            };

            const dialogRef = this.matDialog.open(GameOverDialogComponent, {data});

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.restart();
                } else {
                    this.skipNaviWarning = true;
                    this.router.navigate(["start"]);
                }
            });
        }, 500);
    }


    showNaviWarningDialog(): Observable<boolean> | boolean {

        if(this.skipNaviWarning){
            return true;
        }

        const board = this.boardComponent.getBoard();
        // determine if the board is untouched
        const southUntouched = board.southPits.every((val, i, arr) => val === arr[0]);
        const northUntouched = board.northPits.every((val, i, arr) => val === arr[0]);
        const storesUntouched = board.southStore === 0 && board.northStore === 0;
        if(southUntouched && northUntouched && storesUntouched){
            return true;
        }

        const data: WarningDialogData= {
            title: 'Warning',
            text: 'Do you really want to leave the game?'
        };
        
        return this.matDialog.open(WarningDialogComponent, {data}).afterClosed();
    }

    showRestartDialog(): void {
        const data: WarningDialogData= {
            title: 'Warning',
            text: 'Do you really want to restart the game?'
        };

        const dialogRef = this.matDialog.open(WarningDialogComponent,{data});
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.restart();
            }
        });
    }

}
