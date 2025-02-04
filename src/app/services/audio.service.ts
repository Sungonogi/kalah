import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';

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
        const basePath = environment.production ? 'sounds/mit' : 'sounds/licensed';

        const ending = environment.production ? 'mp3' : 'ogg';
        const specialEnding = environment.production ? 'flac' : 'ogg';

        this.startSound = new Audio(`${basePath}/start.${specialEnding}`);
        this.endSound = new Audio(`${basePath}/start.${specialEnding}`);

        this.stealSound = new Audio(`${basePath}/steal.${ending}`);
        this.extraSound = new Audio(`${basePath}/extra.${ending}`);
        this.moveSound = new Audio(`${basePath}/move.${ending}`);
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
        audio.play().catch(e => {
            console.error('Audio play error:', e);
            const callback = audio.onended as undefined | (() => void);
            if(callback){
                console.log('calling callback');
                callback();
            }
        });
    }

}
