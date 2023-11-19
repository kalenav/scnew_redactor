import { ScAddr, ScTemplate } from "../../ts-sc-client/src";

export class ScnListItem {
    private children!: ScnListItem[];

    private readonly depth: number = 1;
    private readonly scAddr: ScAddr;

    constructor(scAddr: ScAddr) {
        this.scAddr = scAddr;
        (async () => { this.children = await this.getChildren() })();
    }

    private async getChildren(): Promise<ScnListItem[]> {
        const children: ScnListItem[] = [];

        const realtionTempAddr: ScAddr = new ScAddr(1);
        const childTempAddr: ScAddr = new ScAddr(2);
        const dialogTempAddr: ScAddr = new ScAddr(3);
        const template: ScTemplate = new ScTemplate();
        template.triple(this.scAddr, realtionTempAddr, childTempAddr);

        return children;
    }
}