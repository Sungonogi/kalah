import { Component } from '@angular/core';

const board_size = Array(5).fill(0).map((x,i)=> '' + i); // [0,1,2,3,4]
@Component({
  selector: 'game-component',
  templateUrl: './game.component.html',
})
export class GameComponent {
  title = 'default';
  protected readonly board_size = board_size;

  public constructor() {
    console.log(board_size);
  }

}
