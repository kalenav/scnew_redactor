import { ScEdgeIdtf } from "../shared/sc-edge-idtf.enum";

export class ScnTreeNode {
    public readonly idtf: string;
    public readonly childrenByRelation: Partial<Record<ScEdgeIdtf, ScnTreeNode[]>>;
    public readonly children: ScnTreeNode[];

    constructor(params: Partial<ScnTreeNode>) {
        this.idtf = params.idtf ?? '';
        this.childrenByRelation = params.childrenByRelation ?? {};
        this.children = params.children ?? [];
    }
}