import {Injectable} from '@angular/core';

import {MoveType} from "../models/move-type.enum";

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    private startSound: HTMLAudioElement;
    private stealSound: HTMLAudioElement;
    private extraSound: HTMLAudioElement;
    private moveSound: HTMLAudioElement;

    constructor() {
        this.startSound = new Audio('startSound.ogg');
        this.stealSound = new Audio('stealSound.ogg');
        this.extraSound = new Audio('extraSound.ogg');
        this.moveSound = new Audio('moveSound.ogg');
    }

    startAudio() {
        this.startSound.play();
    }

    audioForMove(moveType: MoveType) {
        this.moveSound.play();

        // Wait for the moveSound audio to finish before playing the next sound
        this.moveSound.onended = () => {
            if (moveType === MoveType.ExtraMove) {
                this.extraSound.play();
            } else if (moveType === MoveType.CaptureMove) {
                this.stealSound.play();
            }
        };
    }


}
