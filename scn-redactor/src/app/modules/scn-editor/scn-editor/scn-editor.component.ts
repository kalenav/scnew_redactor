import { Component } from '@angular/core';
import { ScnMockTree } from 'src/app/mock/scn-tree.mock';
import { ScnTree } from 'src/app/model/scn-tree';
import { ScClientService } from 'src/app/services/sc-client.service';

@Component({
    selector: 'scn-editor',
    templateUrl: './scn-editor.component.html',
    styleUrls: ['./scn-editor.component.scss']
})
export class ScnEditorComponent {
    public readonly scnTree: ScnTree = ScnMockTree;

    constructor(private readonly client: ScClientService) {}
}
