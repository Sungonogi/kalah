import {TestBed} from "@angular/core/testing";

import {testCases} from "../mocks/min-max";
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
            timeLimit: 1000,
        };

        service.askForMove(request).subscribe((response: ComMoveResponse) => {
            expect(response.move).toBeGreaterThanOrEqual(0);
            done();
        });
    });

    it("should return the correct move for the testcases sequentially", async () => {

        const testPlayers = testCases.flatMap((testCase) => [
            {testCase, player: PlayerType.HardCom},
            {testCase, player: PlayerType.Stickfish}
        ]);
        
        for (const {testCase, player} of testPlayers) {
            const request: ComMoveRequest = {
                playerType: player,
                boardPosition: testCase.boardPosition,
                timeLimit: 1000,
            };

            const startTime = new Date().getTime();

            await new Promise<void>((resolve) => {
                service.askForMove(request).subscribe((response: ComMoveResponse) => {
                    const time = new Date().getTime() - startTime;
                    if (time > 100) {
                        console.log(
                            'It took too long for the following request: ',
                            request.boardPosition,
                            response.move,
                            testCase.correctMove,
                            time
                        );
                    }

                    expect(response.move)
                        .withContext(JSON.stringify({board: request.boardPosition, comment: response.comment}))
                        .toBe(testCase.correctMove);
                    resolve();
                });
            });
        }
    });

    // mainly for measuring performance
    it("HardCom should be somewhat fast", async () => {
        const request: ComMoveRequest = {
            playerType: PlayerType.Stickfish,
            boardPosition: mockBoardPosition,
            maxDepth: 11,
        };

        const startTime = new Date().getTime();

        await new Promise<void>((resolve) => {
            service.askForMove(request).subscribe(() => {
                const time = new Date().getTime() - startTime;
                console.log(`Time taken by HardCom: ${time}ms`);
                expect(time).toBeLessThan(1000);
                resolve();
            });
        });
    });

    it("Stickfish should be somewhat fast", async () => {
        const request: ComMoveRequest = {
            playerType: PlayerType.Stickfish,
            boardPosition: mockBoardPosition,
            maxDepth: 11,
        };

        const startTime = new Date().getTime();

        await new Promise<void>((resolve) => {
            service.askForMove(request).subscribe(() => {
                const time = new Date().getTime() - startTime;
                console.log(`Time taken by Stickfish: ${time}ms`);
                expect(time).toBeLessThan(1000);
                resolve();
            });
        });
    });

});
