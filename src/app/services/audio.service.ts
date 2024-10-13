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
        // Stop any currently playing sound by resetting the playback position
        this.moveSound.pause();
        this.moveSound.currentTime = 0;

        // Play the moveSound again
        this.moveSound.play();

        // Handle follow-up sounds
        this.moveSound.onended = () => {
            if (moveType === MoveType.ExtraMove) {
                this.extraSound.pause();
                this.extraSound.currentTime = 0;
                this.extraSound.play();
            } else if (moveType === MoveType.CaptureMove) {
                this.stealSound.pause();
                this.stealSound.currentTime = 0;
                this.stealSound.play();
            }
        };
    }

}
