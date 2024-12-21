
import {Injectable} from "@angular/core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let Module: any;

@Injectable({
    providedIn: 'root'
})
export class WasmService {

    private hello = Module.cwrap('hello', 'number', ['string']);

    runHello() {
        setTimeout(() => {
            const encodedString = "Hello, World!";
            console.log('encodedString', encodedString);
            this.hello(encodedString);
        }, 500);
    }

}
