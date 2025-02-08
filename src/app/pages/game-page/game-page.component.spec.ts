import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { BoardService } from "../../services/board.service";
import { BoardComponent } from "./board/board.component";
import { GamePageComponent } from "./game-page.component";
import { startParamsStoreMock } from '../../mocks/mocks';
import { StartParamsStore } from '../../stores/start-params/start-params.store';

describe("GamePageComponent", () => {
  let component: GamePageComponent;
  let fixture: ComponentFixture<GamePageComponent>;
  const boardServiceMock = jasmine.createSpyObj(
    "BoardService",
    ["resetBoard", "stopGame", "resetCallbacks"],
    {
      boardPosition: signal(null),
      animatedBoardPosition: signal({ gameOver: false }),
    }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePageComponent, BoardComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        provideHttpClient(),
        provideHttpClientTesting(),
        // we have to provide the BoardService mock for the BoardComponent which is part of this component
        { provide: BoardService, useValue: boardServiceMock },
        { provide: StartParamsStore, useValue: startParamsStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GamePageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
