
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class WasmService {

    private worker = new Worker(new URL('../workers/engine.worker', import.meta.url), {type: 'classic'});

    constructor() {
        this.worker.addEventListener('message', function(event) {
            console.log('result', event.data.result);
        });
    }

    runHello() {
        this.worker.postMessage({message: "testMessage"});
    }

}
