import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScnEditorComponent } from './components/scn-editor/scn-editor.component';
import { ScnListItemComponent } from './components/scn-list-item/scn-list-item.component';

@NgModule({
    declarations: [
        AppComponent,
        ScnEditorComponent,
        ScnListItemComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
