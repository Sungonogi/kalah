import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    private readonly startSound: HTMLAudioElement;
    private readonly stealSound: HTMLAudioElement;
    private readonly extraSound: HTMLAudioElement;
    private readonly moveSound: HTMLAudioElement;
    private readonly endSound: HTMLAudioElement;

    constructor() {
        this.startSound = new Audio('startSound.ogg');
        this.moveSound = new Audio('moveSound.ogg');
        this.extraSound = new Audio('extraSound.ogg');
        this.stealSound = new Audio('stealSound.ogg');
        this.endSound = new Audio('stealSound.ogg');
    }

    startAudio() {
        this.interruptAndPlay(this.startSound);
    }

    endAudio() {
        this.interruptAndPlay(this.endSound);
    }

    // provide a callback function that will be called onended
    moveAudio(callback: () => void) {
        this.interruptAndPlay(this.moveSound);

        if (callback) {
            this.moveSound.onended = callback;
        }
    }

    resetCallbacks(){
        this.moveSound.onended = null;
    }

    extraAudio() {
        this.interruptAndPlay(this.extraSound);
    }

    stealAudio() {
        this.interruptAndPlay(this.stealSound);
    }

    // Stop sound if it is already playing
    private interruptAndPlay(audio: HTMLAudioElement) {
        audio.pause();
        audio.currentTime = 0;
        audio.play().then(r => r).catch();
    }

}
