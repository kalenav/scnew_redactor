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
            targets: [new ScnTreeNode({ isLink: true, htmlContents: "le mock identifier with a <a href='https://ru.wikipedia.org/wiki/%D0%9B%D0%B8%D1%81%D0%B8%D1%86%D0%B0'>link</a> to smth" })]
        })
    })
}));