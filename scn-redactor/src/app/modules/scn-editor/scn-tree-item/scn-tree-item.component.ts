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
    public readonly groupSymbols: Record<ScEdgeIdtf, { from: string, to: string }> = {
        [ScEdgeIdtf.EdgeAccessConstFuzPerm]: { from: '/϶', to: 'ϵ/' },
        [ScEdgeIdtf.EdgeAccessConstFuzTemp]: { from: '~/϶', to: 'ϵ/~' },
        [ScEdgeIdtf.EdgeAccessConstNegPerm]: { from: '!϶', to: '∉' }, // there is no reverse crossed epsilon in UTF
        [ScEdgeIdtf.EdgeAccessConstNegTemp]: { from: '~!϶', to: '~∉' },
        [ScEdgeIdtf.EdgeAccessConstPosPerm]: { from: '϶', to: 'ϵ' },
        [ScEdgeIdtf.EdgeAccessConstPosTemp]: { from: '~϶', to: '~ϵ' },
        [ScEdgeIdtf.EdgeAccessVarFuzPerm]: { from: '_/϶', to: '_ϵ/' },
        [ScEdgeIdtf.EdgeAccessVarFuzTemp]: { from: '_~/϶', to: '_ϵ/~' },
        [ScEdgeIdtf.EdgeAccessVarNegPerm]: { from: '_!϶', to: '_∉' },
        [ScEdgeIdtf.EdgeAccessVarNegTemp]: { from: '_~!϶', to: '_~∉' },
        [ScEdgeIdtf.EdgeAccessVarPosPerm]: { from: '_϶', to: '_ϵ' },
        [ScEdgeIdtf.EdgeAccessVarPosTemp]: { from: '_~϶', to: '_~ϵ' },
        [ScEdgeIdtf.EdgeDCommonConst]: { from: '⇒', to: '⇐' },
        [ScEdgeIdtf.EdgeDCommonVar]: { from: '_⇒', to: '_⇐' },
        [ScEdgeIdtf.EdgeUCommonConst]: { from: '⇔', to: '⇔' },
        [ScEdgeIdtf.EdgeUCommonVar]: { from: '_⇔', to: '_⇔' }
    };

    public getSemanticVicinityByEdgeType(relation: ScEdgeIdtf): SemanticVicinityByEdgeType {
        return this.scnTreeNode.semanticVicinity.get(relation);
    }
}
