import {TestBed} from "@angular/core/testing";

import {testCases} from "../mocks/minMax";
import {mockBoardPosition} from "../mocks/mocks";
import {ComMoveRequest, ComMoveResponse} from "../models/COM.models";
import {PlayerType} from "../models/player-type.enum";
import {WasmService} from "./wasm.service";

describe("WasmService", () => {
    let service: WasmService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WasmService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should return a legal move", (done) => {
        const request: ComMoveRequest = {
            playerType: PlayerType.HardCom,
            boardPosition: mockBoardPosition,
        };

        service.askForMove(request).subscribe((response: ComMoveResponse) => {
            expect(response.move).toBeGreaterThanOrEqual(0);
            done();
        });
    });

    it("should return the correct move for the testcases sequentially", async () => {
        for (const testCase of testCases) {
            const request: ComMoveRequest = {
                playerType: PlayerType.HardCom,
                boardPosition: testCase.boardPosition,
            };

            const startTime = new Date().getTime();

            await new Promise<void>((resolve) => {
                service.askForMove(request).subscribe((response: ComMoveResponse) => {
                    const time = new Date().getTime() - startTime;
                    if (time > 100) {
                        console.log(
                            request.boardPosition,
                            response.move,
                            testCase.correctMove,
                            time
                        );
                    }

                    expect(response.move)
                        .withContext(JSON.stringify(request.boardPosition))
                        .toBe(testCase.correctMove);
                    resolve();
                });
            });
        }
    });
});
