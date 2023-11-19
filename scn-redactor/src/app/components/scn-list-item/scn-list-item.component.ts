import { Component, Input, OnInit } from '@angular/core';
import { ScClientService } from 'src/app/services/sc-client.service';
import { ScAddr } from 'src/ts-sc-client/src';

@Component({
    selector: 'scn-list-item',
    templateUrl: './scn-list-item.component.html',
    styleUrls: ['./scn-list-item.component.scss']
})
export class ScnListItemComponent implements OnInit {
    @Input() public scAddr!: ScAddr;
    @Input() public depth: number = 1;

    public linkedEntitiesScAddrs!: ScAddr[];

    constructor(private readonly client: ScClientService) {}

    ngOnInit(): void {
        this.setLinkedEntitiesScAddrs();
    }

    private async setLinkedEntitiesScAddrs(): Promise<void> {
        if (this.depth === 0) {
            this.linkedEntitiesScAddrs = [];
        }
        this.linkedEntitiesScAddrs = await this.client.getLinkedEntities(this.scAddr);
    }
}
