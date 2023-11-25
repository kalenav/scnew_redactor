import { Component, Input } from '@angular/core';
import { ScnTreeNode } from 'src/app/model/scn-tree-node';

@Component({
    selector: 'scn-list-item',
    templateUrl: './scn-list-item.component.html',
    styleUrls: ['./scn-list-item.component.scss'],
})
export class ScnListItemComponent {
    @Input() public scnTreeNode!: ScnTreeNode;
    @Input() public isRoot: boolean = false;
}
