import { Component, OnInit } from '@angular/core';
import { ScnMockTree } from 'src/app/mock/scn-tree.mock';
import { ScnTree, ScnTreeNode } from 'src/app/model/scn-tree';
import { ScClientService } from 'src/app/services/sc-client.service';
import { ScAddr, ScType } from 'src/ts-sc-client/src';
import { Subject } from 'rxjs';
import { ScEdgeIdtf } from 'src/app/shared/sc-edge-idtf.enum';

export interface CreateNodeParams {
    from: ScAddr,
    edgeType: ScEdgeIdtf,
    relationScAddr?: ScAddr
}

@Component({
    selector: 'scn-editor',
    templateUrl: './scn-editor.component.html',
    styleUrls: ['./scn-editor.component.scss']
})
export class ScnEditorComponent implements OnInit {
    public readonly openSubject: Subject<ScAddr> = new Subject<ScAddr>();
    public readonly editSubject: Subject<ScAddr> = new Subject<ScAddr>();
    public readonly deleteSubject: Subject<ScAddr> = new Subject<ScAddr>();
    public readonly createSubject: Subject<CreateNodeParams> = new Subject<CreateNodeParams>();

    private currRootScAddr: ScAddr = new ScAddr(0);

    private readonly defaultDepth: number = 2;

    constructor(private readonly client: ScClientService) {}

    ngOnInit(): void {
        this.openSubject.subscribe((scAddr: ScAddr) => {
            console.log(`opening ${scAddr.value}`);
        });

        this.createSubject.subscribe((params: CreateNodeParams) => {
            console.log(`creating edge from ${params.from.value} of type ${params.edgeType} with relation ${params.relationScAddr?.value}`);
        });

        this.editSubject.subscribe((scAddr: ScAddr) => {
            console.log(`editing ${scAddr.value}`);
        });

        this.deleteSubject.subscribe((scAddr: ScAddr) => {
            console.log(`deleting ${scAddr.value}`);
        });
    }

    public get root(): ScnTreeNode {
        return this.buildScnTreeFromRoot(this.currRootScAddr).root;
    }

    private buildScnTreeFromRoot(root: ScAddr, depth: number = this.defaultDepth): ScnTree {
        return ScnMockTree;
    }
}
