import { Component, OnInit } from '@angular/core';
import { ScnTree, ScnTreeNode } from 'src/app/model/scn-tree';
import { ScClientService } from 'src/app/services/sc-client.service';
import { ScAddr, ScTemplate, ScType } from 'ts-sc-client';
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
    public currRoot: ScnTreeNode | null = null;

    public readonly openSubject: Subject<ScAddr> = new Subject<ScAddr>();
    public readonly editSubject: Subject<ScAddr> = new Subject<ScAddr>();
    public readonly deleteSubject: Subject<ScAddr> = new Subject<ScAddr>();
    public readonly createSubject: Subject<CreateNodeParams> = new Subject<CreateNodeParams>();

    private readonly defaultDepth: number = 1;
    private readonly createdScnPages: ScAddr[] = [];

    constructor(private readonly client: ScClientService) {
        this.initialize();
    }

    ngOnInit(): void {
        this.openSubject.subscribe((scAddr: ScAddr) => {
            this.openNodeSemanticVicinity(scAddr);
            this.client.openScnPage(scAddr);
        });

        this.createSubject.subscribe((params: CreateNodeParams) => {
            console.log(`creating edge from ${params.from.value} of type ${params.edgeType} with relation ${params.relationScAddr?.value}`);
        });

        this.editSubject.subscribe((scAddr: ScAddr) => {
            console.log(`editing ${scAddr.value}`);
        });

        this.deleteSubject.subscribe((scAddr: ScAddr) => {
            if (confirm(`Are you sure you want to delete node ${scAddr.value}?`)) {
                // i'll wait before i'm sure that the kb can be recovered in case of catastrophic failure
                // this.client.deleteScElement(scAddr);
                this.client.removeElementFromScnPage(scAddr);
                this.openNodeSemanticVicinity(this.currRoot!.scAddr);
            }
        });
    }

    private async openNodeSemanticVicinity(scAddr: ScAddr): Promise<void> {
        this.currRoot = null;
        this.setCurrRoot(await this.buildScnTreeFromRoot(scAddr));
    }

    private async initialize(): Promise<void> {
        const { uiStartScElement } = await this.client.findKeynodes('ui_start_sc_element');
        this.client.templateSearch(new ScTemplate().triple(uiStartScElement, ScType.EdgeAccessVarPosPerm, ScType.Unknown)).then((res) => {
            if (res.length > 0) {
                this.openNodeSemanticVicinity(res[0].get(2));
            }
            else this.openNodeSemanticVicinity(new ScAddr(1))
        });
    }

    private async setCurrRoot(tree: ScnTree): Promise<void> {
        this.currRoot = tree.root;
    }

    private async buildScnTreeFromRoot(rootScAddr: ScAddr, depth: number = this.defaultDepth): Promise<ScnTree> {
        const rootNode: ScnTreeNode = new ScnTreeNode({
            scAddr: rootScAddr,
            idtf: await this.client.getNodeMainIdtfByScAddr(rootScAddr) ?? await this.client.getNodeSystemIdtfByScAddr(rootScAddr) ?? '...',
            semanticVicinity: await this.client.getNodeSemanticVicinity(rootScAddr, depth)
        });

        return new ScnTree(rootNode);
    }
}
