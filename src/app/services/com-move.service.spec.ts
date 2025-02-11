
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';

import {ComMoveService} from './com-move.service';
import {WasmService} from './wasm.service';

describe('ComMoveService', () => {
    let service: ComMoveService;
    const wasmServiceMock = jasmine.createSpyObj('WasmService', ['askForMove']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: WasmService, useValue: wasmServiceMock},
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(ComMoveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

});
