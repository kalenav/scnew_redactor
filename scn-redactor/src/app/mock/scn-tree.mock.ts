import { ScAddr } from "ts-sc-client";
import { ScnTree, ScnTreeNode, SemanticVicinity, SemanticVicinityByEdgeType } from "../model/scn-tree";
import { ScEdgeIdtf } from "../shared/sc-edge-idtf.enum";

export const ScnMockTree = new ScnTree(new ScnTreeNode({
    scAddr: new ScAddr(100),
    idtf: "lvl0",
    semanticVicinity: new SemanticVicinity({
        [ScEdgeIdtf.EdgeAccessConstPosPerm]: [
            new SemanticVicinityByEdgeType({
                targets: [
                    new ScnTreeNode({ scAddr: new ScAddr(102), idtf: "lvl1-1" }),
                    new ScnTreeNode({
                        scAddr: new ScAddr(101),
                        idtf: "lvl1-2",
                        semanticVicinity: new SemanticVicinity({
                            [ScEdgeIdtf.EdgeAccessConstPosPerm]: [new SemanticVicinityByEdgeType({
                                targets: [new ScnTreeNode({ scAddr: new ScAddr(103), idtf: "lvl2-1" })]
                            })]
                        })
                    })
                ],
                sources: [new ScnTreeNode({ scAddr: new ScAddr(105), idtf: "lvl1-3" })]
            }),
            new SemanticVicinityByEdgeType({
                relationScAddr: new ScAddr(1001),
                idtf: "ключевой sc-элемент'",
                targets: [new ScnTreeNode({ scAddr: new ScAddr(104), idtf: "lvl1-4" })]
            })
        ],
        [ScEdgeIdtf.EdgeDCommonConst]: [new SemanticVicinityByEdgeType({
            relationScAddr: new ScAddr(1002),
            idtf: "основной идентификатор*",
            targets: [
                new ScnTreeNode({
                    scAddr: new ScAddr(106),
                    isLink: true,
                    htmlContents: "le mock identifier with a <a href='https://ru.wikipedia.org/wiki/%D0%9B%D0%B8%D1%81%D0%B8%D1%86%D0%B0'>link</a> to smth",
                    semanticVicinity: new SemanticVicinity({
                        [ScEdgeIdtf.EdgeAccessConstPosPerm]: [new SemanticVicinityByEdgeType({
                            sources: [new ScnTreeNode({ scAddr: new ScAddr(107), idtf: "lang_en" })]
                        })]
                    })
                }),
                new ScnTreeNode({
                    scAddr: new ScAddr(108),
                    isLink: true,
                    htmlContents: "hhhhhhhhh",
                    semanticVicinity: new SemanticVicinity({
                        [ScEdgeIdtf.EdgeAccessConstPosPerm]: [new SemanticVicinityByEdgeType({
                            sources: [new ScnTreeNode({ scAddr: new ScAddr(109), idtf: "lang_ru" })]
                        })]
                    })
                })
            ]
        })]
    })
}));