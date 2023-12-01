import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScnEditorComponent } from './scn-editor/scn-editor.component';
import { MatTreeModule } from '@angular/material/tree';
import { ScnTreeItemComponent } from './scn-tree-item/scn-tree-item.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        ScnEditorComponent,
        ScnTreeItemComponent
    ],
    imports: [
        CommonModule,
        MatTreeModule,
        MatButtonModule,
        MatIconModule
    ],
    exports: [
        ScnEditorComponent
    ]
})
export class ScnEditorModule { }
