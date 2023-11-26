import { ScnTree, ScnTreeNode, SemanticVicinity, SemanticVicinityByEdgeType } from "../model/scn-tree";
import { ScEdgeIdtf } from "../shared/sc-edge-idtf.enum";

export const ScnMockTree = new ScnTree(new ScnTreeNode({
    idtf: "lvl0",
    semanticVicinity: new SemanticVicinity({
        [ScEdgeIdtf.EdgeAccessConstPosPerm]: new SemanticVicinityByEdgeType({
            targets: [
                new ScnTreeNode({ idtf: "lvl1-1" }),
                new ScnTreeNode({
                    idtf: "lvl1-2",
                    semanticVicinity: new SemanticVicinity({
                        [ScEdgeIdtf.EdgeAccessConstPosPerm]: new SemanticVicinityByEdgeType({
                            targets: [new ScnTreeNode({ idtf: "lvl2-1" })]
                        })
                    })
                })
            ],
            sources: [new ScnTreeNode({ idtf: "lvl1-2" })]
        }),
        [ScEdgeIdtf.EdgeDCommonConst]: new SemanticVicinityByEdgeType({
            idtf: "основной идентификатор*",
            targets: [new ScnTreeNode({ idtf: "lvl2-2" })]
        })
    })
}));