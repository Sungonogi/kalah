import { TestBed } from "@angular/core/testing";
import { WasmService } from "./wasm.service";
import { ComMoveRequest, ComMoveResponse } from "../models/COM.models";
import { Observable } from "rxjs";
import { PlayerType } from "../models/player-type.enum";
import { mockBoardPosition } from '../mocks/mocks';

describe("WasmService", () => {
  let service: WasmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WasmService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return a move response", (done) => {
    const request: ComMoveRequest = {
      playerType: PlayerType.HardCom,
      boardPosition: mockBoardPosition
    };


    service.askForMove(request).subscribe((response: ComMoveResponse) => {
      expect(response.move).toEqual(3);
      done();
    });
  });
});
