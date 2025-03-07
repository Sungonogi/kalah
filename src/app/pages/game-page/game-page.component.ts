import {Component, effect, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {Router, RouterLink} from "@angular/router";
import {Observable} from "rxjs";

import { environment as env} from '../../../environments/environment';
import {BoardPosition} from "../../models/board-position.model";
import {PlayerType} from "../../models/player-type.enum";
import {BoardService} from "../../services/board.service";
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

    private currentlyInDialog: WritableSignal<boolean> = signal(false);
    private shouldShowGameOver: WritableSignal<boolean> = signal(false);
    
    constructor(
            private matDialog: MatDialog,
            private router: Router,
            private boardService: BoardService
    ) {
        // detect gameOver and query it to show in some time
        effect(() => {
            const board = this.boardService.animatedBoardPosition();
            if(board.gameOver){
                setTimeout(() => this.shouldShowGameOver.set(true), env.gameOverModalTime);
            }
        });

        // show gameOver as soon as all other dialogs are closed
        effect(() => {
            const shouldShowGameOver = this.shouldShowGameOver();
            const currentlyInDialog = this.currentlyInDialog();
            if(shouldShowGameOver && !currentlyInDialog){
                this.showGameOverDialog(this.boardService.boardPosition());
                this.shouldShowGameOver.set(false);
            }
        });
    }
    
    private restart(){
        this.skipNaviWarning = false;
        this.shouldShowGameOver.set(false);
        this.currentlyInDialog.set(false);
        this.boardComponent.resetBoard();
    }

    showGameOverDialog(board: BoardPosition){
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
    }

    showRestartDialog() {
        const data: WarningDialogData= {
            title: 'Warning',
            text: 'Do you really want to restart the game?'
        };

        this.boardService.pause();
        this.currentlyInDialog.set(true);
        
        const dialogRef = this.matDialog.open(WarningDialogComponent,{data});

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.restart();
            } else {
                this.boardService.unpause();
            }
            this.currentlyInDialog.set(false);
        });
    }

    // returns true if navigating is allowed
    showNaviWarningDialog(): Observable<boolean> | boolean {

        if(this.skipNaviWarning || this.boardService.isBoardUntouched()){
            this.boardService.resetCallbacks();
            return true;
        }

        const data: WarningDialogData= {
            title: 'Warning',
            text: 'Do you really want to leave the game?'
        };

        this.boardService.pause();
        this.currentlyInDialog.set(true);

        const ret = this.matDialog.open(WarningDialogComponent, {data}).afterClosed();
        ret.subscribe((result) => {
            if(result) {
                this.boardService.resetCallbacks();
            } else {
                this.boardService.unpause();
            }
            this.currentlyInDialog.set(false);
        });

        return ret;
    }

}
