import { Component, OnInit } from '@angular/core';
import { ScnMockTree } from 'src/app/mock/scn-tree.mock';
import { ScnTree, ScnTreeNode, SemanticVicinity } from 'src/app/model/scn-tree';
import { ScClientService } from 'src/app/services/sc-client.service';
import { ScAddr } from 'ts-sc-client';
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
    public currRoot!: ScnTreeNode;

    public readonly openSubject: Subject<ScAddr> = new Subject<ScAddr>();
    public readonly editSubject: Subject<ScAddr> = new Subject<ScAddr>();
    public readonly deleteSubject: Subject<ScAddr> = new Subject<ScAddr>();
    public readonly createSubject: Subject<CreateNodeParams> = new Subject<CreateNodeParams>();

    private readonly defaultDepth: number = 1;
    private readonly defaultRoot: ScAddr = new ScAddr(16103); // concept_user_interface_component
    private readonly scnPageScAddr: ScAddr = new ScAddr(131101);

    private readonly createdScnPages: ScAddr[] = [];

    constructor(private readonly client: ScClientService) {
        this.initialize();
    }

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

    private async initialize(): Promise<void> {
        this.setCurrRoot(await this.buildScnTreeFromRoot(this.defaultRoot));
    }

    private async setCurrRoot(tree: ScnTree): Promise<void> {
        this.currRoot = tree.root;
    }

    private async buildScnTreeFromRoot(rootScAddr: ScAddr, depth: number = this.defaultDepth): Promise<ScnTree> {
        const rootNode: ScnTreeNode = new ScnTreeNode({
            scAddr: rootScAddr,
            idtf: await this.client.getNodeMainIdtfByScAddr(rootScAddr),
            semanticVicinity: await this.client.getNodeSemanticVicinity(rootScAddr, depth)
        });

        return new ScnTree(rootNode);
    }

    private async test(): Promise<void> {
        console.log(await this.client.getNodeSemanticVicinity(this.defaultRoot));
    }
}
