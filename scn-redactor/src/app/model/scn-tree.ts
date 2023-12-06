import { ScAddr } from "ts-sc-client";
import { ScEdgeIdtf } from "../shared/sc-edge-idtf.enum";

interface RelationInfo {
    scAddr: ScAddr,
    idtf: string
}

export class SemanticVicinityByEdgeType {
    public readonly relationScAddr: ScAddr | null;
    public readonly idtf: string;
    public readonly edgeType: ScEdgeIdtf;

    /**
     * @description The array of nodes that are the sources of arcs that the node is the target for.
     */
    public readonly sources: Array<ScnTreeNode>;

    /**
     * @description The array of nodes that are the targets for arcs that the node is the source of.
     */
    public readonly targets: Array<ScnTreeNode>;

    constructor(params: Partial<SemanticVicinityByEdgeType>) {
        this.relationScAddr = params.relationScAddr ?? null;
        this.idtf = params.idtf ?? '';
        this.edgeType = params.edgeType ?? ScEdgeIdtf.EdgeDCommonConst;
        this.sources = params.sources ?? [];
        this.targets = params.targets ?? [];
    }

    // it is assumed that the vicinities are non-intersecting
    public merge(another: SemanticVicinityByEdgeType): void {
        this.sources.push(...another.sources);
        this.targets.push(...another.targets);
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
                    this.add(edgeType as ScEdgeIdtf, currEdgeSemanticVicinity);
                }
            }
        }
    }

    public add(edgeType: ScEdgeIdtf, vicinity: SemanticVicinityByEdgeType): void {
        this.semanticVicinity[edgeType].push(vicinity);
    }

    public get(edgeType: ScEdgeIdtf): Array<SemanticVicinityByEdgeType> {
        return this.semanticVicinity[edgeType];
    }

    public collapse(): void {
        for (const edgeType in this.semanticVicinity) {
            const assertedEdgeType: ScEdgeIdtf = edgeType as ScEdgeIdtf;

            const allRelationsForCurrEdgeType: [null, ...RelationInfo[]] = [null];
            this.semanticVicinity[assertedEdgeType].forEach((vicinity: SemanticVicinityByEdgeType) => {
                if (!!vicinity.relationScAddr
                    && !allRelationsForCurrEdgeType.some((relationInfo: RelationInfo | null) => relationInfo?.scAddr === vicinity.relationScAddr)
                ) {
                    allRelationsForCurrEdgeType.push({ scAddr: vicinity.relationScAddr!, idtf: vicinity.idtf });
                }
            });

            const vicinitiesSnapshot: SemanticVicinityByEdgeType[] = this.semanticVicinity[assertedEdgeType].slice();
            this.semanticVicinity[assertedEdgeType] = allRelationsForCurrEdgeType.map((relationInfo: RelationInfo | null) => {
                const currVicinity: SemanticVicinityByEdgeType = new SemanticVicinityByEdgeType({
                    relationScAddr: relationInfo?.scAddr,
                    idtf: relationInfo?.idtf,
                    edgeType: assertedEdgeType
                });

                vicinitiesSnapshot
                    .filter((vicinity: SemanticVicinityByEdgeType) => vicinity.relationScAddr === (relationInfo?.scAddr ?? null))
                    .forEach((vicinity: SemanticVicinityByEdgeType) => { currVicinity.merge(vicinity) });

                return currVicinity;
            });
        }
    }
}

export class ScnTreeNode {
    public readonly scAddr: ScAddr;
    public readonly idtf: string;
    public readonly semanticVicinity: SemanticVicinity;
    public readonly isLink: boolean;
    public readonly htmlContents: string;

    constructor(params: Partial<ScnTreeNode> & { scAddr: ScAddr }) {
        this.scAddr = params.scAddr;
        this.idtf = params.idtf ?? '...';
        this.semanticVicinity = params.semanticVicinity ?? new SemanticVicinity();
        this.isLink = params.isLink ?? false;
        this.htmlContents = params.htmlContents ?? '';
    }
}

export class ScnTree {
    public readonly root: ScnTreeNode;

    constructor(root: ScnTreeNode) {
        this.root = root;
    }
}
