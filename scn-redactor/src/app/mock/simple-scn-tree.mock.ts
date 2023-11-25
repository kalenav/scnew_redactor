import { ScnTreeNode } from "../model/scn-tree-node";

export const SimpleScnTree: ScnTreeNode = new ScnTreeNode({
    idtf: "lvl1",
    children: [
        new ScnTreeNode({ idtf: "lvl2-1" }),
        new ScnTreeNode({
            idtf: "lvl2-2", children: [
                new ScnTreeNode({ idtf: "lvl3-1" }),
                new ScnTreeNode({ idtf: "lvl3-2" })
            ]
        }),
        new ScnTreeNode({ idtf: "lvl2-3" }),
        new ScnTreeNode({
            idtf: "lvl2-4", children: [
                new ScnTreeNode({ idtf: "lvl3-3" }),
                new ScnTreeNode({ idtf: "lvl3-4" })
            ]
        })
    ]
})