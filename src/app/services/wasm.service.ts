
import {Injectable} from "@angular/core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let Module: any;

@Injectable({
    providedIn: 'root'
})
export class WasmService {

    private wasmModule = Module.cwrap('hello', 'number', ['number']);

    runHello() {
        setTimeout(() => {
            this.wasmModule(0);
        }, 2000);
    }

}
