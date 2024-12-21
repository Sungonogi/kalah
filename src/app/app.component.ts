import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {HeaderComponent} from "./components/header/header.component";
import { WasmService } from './services/wasm.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, HeaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

    constructor(private readonly wasmService: WasmService) {
    }

    ngOnInit() {
        this.wasmService.runHello();
    }
}
