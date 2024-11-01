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
        this.startSound = new Audio('379865__cdrk__gong-cambodia.flac');
        this.endSound = new Audio('379865__cdrk__gong-cambodia.flac');


        this.moveSound = new Audio('moveSoundSilent.mp3');
        this.extraSound = new Audio('extraSoundSilent.mp3');
        this.stealSound = new Audio('stealSoundSilent.mp3');
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
