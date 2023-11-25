import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScnEditorComponent } from './scn-editor/scn-editor.component';
import { ScnListItemComponent } from './scn-list-item/scn-list-item.component';
import { MatTreeModule } from '@angular/material/tree';

@NgModule({
    declarations: [
        ScnEditorComponent,
        ScnListItemComponent
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
