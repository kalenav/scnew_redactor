import { Component } from '@angular/core';
import { ScClientService } from 'src/app/services/sc-client.service';

@Component({
    selector: 'scn-editor',
    templateUrl: './scn-editor.component.html',
    styleUrls: ['./scn-editor.component.scss']
})
export class ScnEditorComponent {
    constructor(private readonly client: ScClientService) {}
}
