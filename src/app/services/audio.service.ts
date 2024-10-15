import {Injectable} from '@angular/core';

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

    // provide an optional callback function that will be called onended
    moveAudio(callback?: () => void) {
        // Stop any currently playing sound by resetting the playback position
        this.moveSound.pause();
        this.moveSound.currentTime = 0;
        this.moveSound.play();

        if(callback){
            this.moveSound.onended = callback;
        }
    }

    extraAudio() {
        this.extraSound.pause();
        this.extraSound.currentTime = 0;
        this.extraSound.play();
    }

    stealAudio() {
        this.stealSound.pause();
        this.stealSound.currentTime = 0;
        this.stealSound.play();
    }

}
