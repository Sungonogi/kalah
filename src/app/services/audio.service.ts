import {Injectable} from '@angular/core';

import {environment as env} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    private readonly startAndEndSound!: HTMLAudioElement;
    private readonly stealSound!: HTMLAudioElement;
    private readonly extraSound!: HTMLAudioElement;
    private readonly moveSound!: HTMLAudioElement;

    constructor() {

        if(env.disableAudio) return;

        const basePath = 'sounds';

        this.startAndEndSound = new Audio(`${basePath}/start.ogg`);

        this.stealSound = new Audio(`${basePath}/steal.ogg`);
        this.extraSound = new Audio(`${basePath}/extra.ogg`);
        this.moveSound = new Audio(`${basePath}/move.ogg`);
    }

    startAudio() {
        return this.interruptAndPlay(this.startAndEndSound);
    }

    endAudio() {
        return this.interruptAndPlay(this.startAndEndSound);
    }

    // return the duration so the caller can wait for the sound to finish
    moveAudio() {
        return this.interruptAndPlay(this.moveSound);
    }

    extraAudio() {
        return this.interruptAndPlay(this.extraSound);
    }

    stealAudio() {
        return this.interruptAndPlay(this.stealSound);
    }

    // Stop sound if it is already playing
    private interruptAndPlay(audio: HTMLAudioElement): number {
        if(env.disableAudio) return 0;

        audio.pause();
        audio.currentTime = 0;
        audio.play();

        return 1000 * audio.duration;
    }


}
