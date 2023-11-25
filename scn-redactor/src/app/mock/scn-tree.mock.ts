import { ScnTreeNode } from "../model/scn-tree-node";
import { ScEdgeIdtf } from "../shared/sc-edge-idtf.enum";

export const ScnMockTreeRoot = new ScnTreeNode({
    idtf: "lvl0",
    semanticVicinity: {
        [ScEdgeIdtf.EdgeAccessConstPosPerm]: [
            new ScnTreeNode({ idtf: "lvl1-1" }),
            new ScnTreeNode({
                idtf: "lvl1-2", semanticVicinity: {
                    [ScEdgeIdtf.EdgeAccessConstPosPerm]: [new ScnTreeNode({ idtf: "lvl3-1" })]
                }
            }),
            new ScnTreeNode({ idtf: "lvl1-1" })
        ],
        [ScEdgeIdtf.EdgeAccessConstNegPerm]: [
            new ScnTreeNode({ idtf: "lvl2-1" }),
            new ScnTreeNode({ idtf: "lvl2-2" })
        ],
    }
})