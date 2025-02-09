import { TestBed } from "@angular/core/testing";
import { WasmService } from "./wasm.service";
import { ComMoveRequest, ComMoveResponse } from "../models/COM.models";
import { PlayerType } from "../models/player-type.enum";
import { mockBoardPosition } from '../mocks/mocks';
import { testCases } from '../mocks/minMax';

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
      boardPosition: mockBoardPosition
    };

    service.askForMove(request).subscribe((response: ComMoveResponse) => {
      expect(response.move).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  it('should return the correct move for the testcases sequentially', async () => {
    
    for (const testCase of testCases) {
      const request: ComMoveRequest = {
        playerType: PlayerType.HardCom,
        boardPosition: testCase.boardPosition
      };

      await new Promise<void>((resolve) => {
        service.askForMove(request).subscribe((response: ComMoveResponse) => {
          console.log(request.boardPosition, response.move, testCase.correctMove);
          expect(response.move).toBe(testCase.correctMove);
          resolve();
        });
      });
    }

  });


});
