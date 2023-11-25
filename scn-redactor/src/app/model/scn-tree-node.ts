import { ScEdgeIdtf } from "../shared/sc-edge-idtf.enum";

export class ScnTreeNode {
    public readonly idtf: string;
    public readonly semanticVicinity: Partial<Record<ScEdgeIdtf, ScnTreeNode[]>>;

    constructor(params: Partial<ScnTreeNode>) {
        this.idtf = params.idtf ?? '';
        this.semanticVicinity = params.semanticVicinity ?? {};
    }
}