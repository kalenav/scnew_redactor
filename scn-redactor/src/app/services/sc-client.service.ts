import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ScAddr, ScClient, ScTemplate, ScType } from 'src/ts-sc-client/src';

@Injectable({
    providedIn: 'root'
})
export class ScClientService {
    private readonly scClient: ScClient;

    constructor() {
        this.scClient = new ScClient(environment.webSocketAddress);
    }

    public async getLinkedEntities(entityScAddr: ScAddr): Promise<ScAddr[]> {
        const linkedEntitiesScAddrs: ScAddr[] = [];
    
        const template = new ScTemplate();
        const conceptClass = (await this.scClient.resolveKeynodes([{ id: "concept_class", type: ScType.NodeConst }]))["concept_class"];
    
        template.triple(
            conceptClass,
            ScType.EdgeAccessVarPosPerm,
            ScType.NodeVar
        );
    
        const res = await this.scClient.templateSearch(template);
        console.log(res); // []

        return linkedEntitiesScAddrs;
    }
}