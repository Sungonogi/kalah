import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    private startSound: HTMLAudioElement;
    private stealSound: HTMLAudioElement;
    private extraSound: HTMLAudioElement;
    private moveSound: HTMLAudioElement;
    private endSound: HTMLAudioElement;

    constructor() {
        this.startSound = new Audio('startSound.ogg');
        // credit: "Gong-Cambodia by cdrk -- https://freesound.org/s/379865/ -- License: Attribution 4.0"

        this.moveSound = new Audio('moveSound.ogg');
        // credit: Confirmation Upward by original_sound -- https://freesound.org/s/366102/ -- License: Attribution 3.0

        this.extraSound = new Audio('extraSound.ogg');
        // credit: Bell, Counter, A.wav by InspectorJ -- https://freesound.org/s/415510/ -- License: Attribution 4.0

        this.stealSound = new Audio('stealSound.ogg');


        this.endSound = new Audio('startSound.flac');

    }

    startAudio() {
        this.interruptAndPlay(this.startSound);
    }

    endAudio() {
        this.interruptAndPlay(this.endSound);
    }

    // provide an optional callback function that will be called onended
    moveAudio(callback?: () => void) {
        // Stop any currently playing sound by resetting the playback position
        this.interruptAndPlay(this.moveSound);

        if(callback){
            this.moveSound.onended = callback;
        }
    }

    extraAudio() {
        this.interruptAndPlay(this.extraSound);
    }

    stealAudio() {
        this.interruptAndPlay(this.stealSound);
    }

    private interruptAndPlay(audio: HTMLAudioElement) {
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }

}
