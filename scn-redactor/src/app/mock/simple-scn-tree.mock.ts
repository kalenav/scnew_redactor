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
        })
    ]
})