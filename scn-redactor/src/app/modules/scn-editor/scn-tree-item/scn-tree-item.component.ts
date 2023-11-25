import { Component, Input } from '@angular/core';
import { ScnTreeNode, SemanticVicinityByEdgeType } from 'src/app/model/scn-tree';
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
    public readonly groupSymbols: Partial<Record<ScEdgeIdtf, { from: string, to: string }>> = {
        [ScEdgeIdtf.EdgeAccessConstPosPerm]: { from: '->', to: '<-' }
    };

    public getSemanticVicinityByEdgeType(relation: ScEdgeIdtf): SemanticVicinityByEdgeType {
        return this.scnTreeNode.semanticVicinity.get(relation);
    }
}
