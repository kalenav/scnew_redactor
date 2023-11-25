import { NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { SimpleScnTree } from 'src/app/mock/simple-scn-tree.mock';
import { ScnTreeNode } from 'src/app/model/scn-tree-node';
import { ScClientService } from 'src/app/services/sc-client.service';

@Component({
    selector: 'scn-editor',
    templateUrl: './scn-editor.component.html',
    styleUrls: ['./scn-editor.component.scss']
})
export class ScnEditorComponent {
    public readonly scnTreeControl: NestedTreeControl<ScnTreeNode> = new NestedTreeControl<ScnTreeNode>(node => node.children);
    public readonly dataSource: MatTreeNestedDataSource<ScnTreeNode> = new MatTreeNestedDataSource<ScnTreeNode>();

    constructor(private readonly client: ScClientService) {
        this.dataSource.data = [SimpleScnTree];
    }
}
