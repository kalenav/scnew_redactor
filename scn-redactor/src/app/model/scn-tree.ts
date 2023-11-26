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
    private readonly semanticVicinity: Record<ScEdgeIdtf, SemanticVicinityByEdgeType> = {
        [ScEdgeIdtf.EdgeAccessConstFuzPerm]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeAccessConstFuzTemp]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeAccessConstNegPerm]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeAccessConstNegTemp]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeAccessConstPosPerm]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeAccessConstPosTemp]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeAccessVarFuzPerm]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeAccessVarFuzTemp]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeAccessVarNegPerm]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeAccessVarNegTemp]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeAccessVarPosPerm]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeAccessVarPosTemp]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeDCommonConst]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeDCommonVar]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeUCommonConst]: new SemanticVicinityByEdgeType(),
        [ScEdgeIdtf.EdgeUCommonVar]: new SemanticVicinityByEdgeType(),
    };

    constructor(semanticVicinity?: Partial<Record<ScEdgeIdtf, SemanticVicinityByEdgeType>>) {
        if (semanticVicinity !== undefined) {
            for (const edgeType in semanticVicinity) {
                this.semanticVicinity[edgeType as ScEdgeIdtf] = new SemanticVicinityByEdgeType({
                    idtf: semanticVicinity[edgeType as ScEdgeIdtf]!.idtf,
                    sources: semanticVicinity[edgeType as ScEdgeIdtf]!.sources.slice(),
                    targets: semanticVicinity[edgeType as ScEdgeIdtf]!.targets.slice()
                })
            }
        }
    }

    public get(edgeType: ScEdgeIdtf): SemanticVicinityByEdgeType {
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