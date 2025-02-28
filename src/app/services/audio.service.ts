import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    private readonly startAndEndSound: HTMLAudioElement;
    private readonly stealSound: HTMLAudioElement;
    private readonly extraSound: HTMLAudioElement;
    private readonly moveSound: HTMLAudioElement;

    constructor() {
        const basePath = environment.production ? 'sounds/mit' : 'sounds/licensed';

        const ending = environment.production ? 'mp3' : 'ogg';
        const specialEnding = environment.production ? 'flac' : 'ogg';

        this.startAndEndSound = new Audio(`${basePath}/start.${specialEnding}`);

        this.stealSound = new Audio(`${basePath}/steal.${ending}`);
        this.extraSound = new Audio(`${basePath}/extra.${ending}`);
        this.moveSound = new Audio(`${basePath}/move.${ending}`);
    }

    startAudio() {
        this.interruptAndPlay(this.startAndEndSound);
        return this.startAndEndSound.duration;
    }

    endAudio() {
        this.interruptAndPlay(this.startAndEndSound);
        return this.startAndEndSound.duration;
    }

    // return the duration so the caller can wait for the sound to finish
    moveAudio() {
        this.interruptAndPlay(this.moveSound);
        return this.moveSound.duration;
    }

    extraAudio() {
        this.interruptAndPlay(this.extraSound);
        return this.extraSound.duration;
    }

    stealAudio() {
        this.interruptAndPlay(this.stealSound);
        return this.stealSound.duration;
    }

    // Stop sound if it is already playing
    private interruptAndPlay(audio: HTMLAudioElement) {
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }

}
