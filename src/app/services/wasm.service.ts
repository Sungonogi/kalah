import {Injectable} from "@angular/core";
import {Observable} from 'rxjs';

import {ComMoveRequest, ComMoveResponse} from '../models/COM.models';

@Injectable({
    providedIn: 'root'
})
export class WasmService {

    private worker = new Worker(
        new URL('../workers/engine.worker', import.meta.url),
        {type: 'classic'}
    );


    public askForMove(request: ComMoveRequest): Observable<ComMoveResponse> {
        return new Observable<ComMoveResponse>((observer) => {
            const handleMessage = (event: MessageEvent) => {
                observer.next(event.data);
                observer.complete();
                this.worker.removeEventListener('message', handleMessage);
            };

            this.worker.addEventListener('message', handleMessage);
            this.worker.postMessage(request);

            // Cleanup in case of unsubscription
            return () => {
                this.worker.removeEventListener('message', handleMessage);
            };
        });
    }
    
}
