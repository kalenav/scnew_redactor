import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScnEditorComponent } from './scn-editor/scn-editor.component';
import { MatTreeModule } from '@angular/material/tree';
import { ScnTreeItemComponent } from './scn-tree-item/scn-tree-item.component';

@NgModule({
    declarations: [
        ScnEditorComponent,
        ScnTreeItemComponent
    ],
    imports: [
        CommonModule,
        MatTreeModule
    ],
    exports: [
        ScnEditorComponent
    ]
})
export class ScnEditorModule { }
