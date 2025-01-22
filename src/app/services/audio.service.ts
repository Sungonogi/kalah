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
        // Credit: Gong-Cambodia by cdrk -- https://freesound.org/s/379865/ -- License: Attribution 4.0
        this.startSound = new Audio('sounds/379865__cdrk__gong-cambodia.flac');
        this.endSound = new Audio('sounds/379865__cdrk__gong-cambodia.flac');


        this.moveSound = new Audio('sounds/moveSoundSilent.mp3');
        this.extraSound = new Audio('sounds/extraSoundSilent.mp3');
        this.stealSound = new Audio('sounds/stealSoundSilent.mp3');
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
