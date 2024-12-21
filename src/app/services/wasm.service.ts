
import {Injectable} from "@angular/core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let Module: any;

@Injectable({
    providedIn: 'root'
})
export class WasmService {

    private getBestMove = Module.cwrap('getBestMove', 'number', ['string']);

    runHello() {
        setTimeout(() => {
            const n: number = this.getBestMove('test');
            console.log(n);
        }, 500);
    }

}
