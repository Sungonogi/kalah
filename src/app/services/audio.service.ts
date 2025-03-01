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

        const basePath = env.production ? 'sounds/mit' : 'sounds/licensed';

        const ending = env.production ? 'mp3' : 'ogg';
        const specialEnding = env.production ? 'flac' : 'ogg';

        this.startAndEndSound = new Audio(`${basePath}/start.${specialEnding}`);

        this.stealSound = new Audio(`${basePath}/steal.${ending}`);
        this.extraSound = new Audio(`${basePath}/extra.${ending}`);
        this.moveSound = new Audio(`${basePath}/move.${ending}`);
    }

    startAudio() {
        if(env.disableAudio) return 0;

        this.interruptAndPlay(this.startAndEndSound);
        return this.startAndEndSound.duration;
    }

    endAudio() {
        if(env.disableAudio) return 0;
        
        this.interruptAndPlay(this.startAndEndSound);
        return this.startAndEndSound.duration;
    }

    // return the duration so the caller can wait for the sound to finish
    moveAudio() {
        if(env.disableAudio) return 0;

        this.interruptAndPlay(this.moveSound);
        return this.moveSound.duration;
    }

    extraAudio() {
        if(env.disableAudio) return 0;

        this.interruptAndPlay(this.extraSound);
        return this.extraSound.duration;
    }

    stealAudio() {
        if(env.disableAudio) return 0;

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
