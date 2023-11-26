import { ScEdgeIdtf } from "../shared/sc-edge-idtf.enum";

export class SemanticVicinityByEdgeType {
    public readonly idtf: string;

    /**
     * @description The array of nodes that are the sources of arcs that the node is the target for.
     */
    public readonly sources: Array<ScnTreeNode>;

    /**
     * @description The array of nodes that are the targets for arcs that the node is the source of.
     */
    public readonly targets: Array<ScnTreeNode>;

    constructor(params?: Partial<SemanticVicinityByEdgeType>) {
        this.idtf = params?.idtf ?? '';
        this.sources = params?.sources ?? [];
        this.targets = params?.targets ?? [];
    }
}

export class SemanticVicinity {
    private readonly semanticVicinity: Record<ScEdgeIdtf, Array<SemanticVicinityByEdgeType>> = {
        [ScEdgeIdtf.EdgeAccessConstFuzPerm]: [],
        [ScEdgeIdtf.EdgeAccessConstFuzTemp]: [],
        [ScEdgeIdtf.EdgeAccessConstNegPerm]: [],
        [ScEdgeIdtf.EdgeAccessConstNegTemp]: [],
        [ScEdgeIdtf.EdgeAccessConstPosPerm]: [],
        [ScEdgeIdtf.EdgeAccessConstPosTemp]: [],
        [ScEdgeIdtf.EdgeAccessVarFuzPerm]: [],
        [ScEdgeIdtf.EdgeAccessVarFuzTemp]: [],
        [ScEdgeIdtf.EdgeAccessVarNegPerm]: [],
        [ScEdgeIdtf.EdgeAccessVarNegTemp]: [],
        [ScEdgeIdtf.EdgeAccessVarPosPerm]: [],
        [ScEdgeIdtf.EdgeAccessVarPosTemp]: [],
        [ScEdgeIdtf.EdgeDCommonConst]: [],
        [ScEdgeIdtf.EdgeDCommonVar]: [],
        [ScEdgeIdtf.EdgeUCommonConst]: [],
        [ScEdgeIdtf.EdgeUCommonVar]: []
    };

    constructor(semanticVicinity?: Partial<Record<ScEdgeIdtf, Array<SemanticVicinityByEdgeType>>>) {
        if (semanticVicinity !== undefined) {
            for (const edgeType in semanticVicinity) {
                for (const currEdgeSemanticVicinity of semanticVicinity[edgeType as ScEdgeIdtf]!) {
                    this.semanticVicinity[edgeType as ScEdgeIdtf].push(new SemanticVicinityByEdgeType({
                        idtf: currEdgeSemanticVicinity.idtf,
                        sources: currEdgeSemanticVicinity.sources.slice(),
                        targets: currEdgeSemanticVicinity.targets.slice()
                    }));
                }
            }
        }
    }

    public get(edgeType: ScEdgeIdtf): Array<SemanticVicinityByEdgeType> {
        return this.semanticVicinity[edgeType];
    }
}

export class ScnTreeNode {
    public readonly idtf: string;
    public readonly semanticVicinity: SemanticVicinity;
    public readonly isLink: boolean;
    public readonly htmlContents: string;

    constructor(params?: Partial<ScnTreeNode>) {
        this.idtf = params?.idtf ?? '...';
        this.semanticVicinity = params?.semanticVicinity ?? new SemanticVicinity();
        this.isLink = params?.isLink ?? false;
        this.htmlContents = params?.htmlContents ?? '';
    }
}

export class ScnTree {
    public readonly root: ScnTreeNode;

    constructor(root: ScnTreeNode) {
        this.root = root;
    }
}