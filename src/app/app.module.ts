import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TerminalComponent } from './terminal/terminal.component';
import { AppTerminalButtonComponent } from './app-terminal-button/app-terminal-button.component';
import { TerminalButtonComponent } from './terminal-button/terminal-button.component';

@NgModule({
  declarations: [
    AppComponent,
    TerminalComponent,
    AppTerminalButtonComponent,
    TerminalButtonComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
