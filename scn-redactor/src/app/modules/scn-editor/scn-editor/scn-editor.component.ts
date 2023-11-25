import { Component } from '@angular/core';
import { ScnMockTreeRoot } from 'src/app/mock/scn-tree.mock';
import { ScnTreeNode } from 'src/app/model/scn-tree-node';
import { ScClientService } from 'src/app/services/sc-client.service';

@Component({
    selector: 'scn-editor',
    templateUrl: './scn-editor.component.html',
    styleUrls: ['./scn-editor.component.scss']
})
export class ScnEditorComponent {
    public readonly scnTreeRoot: ScnTreeNode = ScnMockTreeRoot;

    constructor(private readonly client: ScClientService) {}
}
