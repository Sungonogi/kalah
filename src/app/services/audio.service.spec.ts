import {TestBed} from '@angular/core/testing';

import {AudioService} from './audio.service';

describe('AudioService', () => {
    let service: AudioService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AudioService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call the callback function', () => {
        const callback = jasmine.createSpy('callback');
        service.moveAudio(callback);
        service['moveSound'].dispatchEvent(new Event('ended'));
        expect(callback).toHaveBeenCalled();
    });
});
