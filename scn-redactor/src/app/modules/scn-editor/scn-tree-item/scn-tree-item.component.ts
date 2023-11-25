import { Component, Input } from '@angular/core';
import { ScnTreeNode } from 'src/app/model/scn-tree-node';
import { ScEdgeIdtf } from 'src/app/shared/sc-edge-idtf.enum';

@Component({
    selector: 'scn-tree-item',
    templateUrl: './scn-tree-item.component.html',
    styleUrls: ['./scn-tree-item.component.scss']
})
export class ScnTreeItemComponent {
    @Input({ required: true }) public scnTreeNode!: ScnTreeNode;
    @Input() public isRoot: boolean = false;

    public readonly ScEdgeIdtf = ScEdgeIdtf;

    public getSemanticVicinityByRelation(relation: ScEdgeIdtf): ScnTreeNode[] {
        return this.scnTreeNode.semanticVicinity[relation] ?? [];
    }
}
