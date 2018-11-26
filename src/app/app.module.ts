import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TerminalComponent } from './terminal/terminal.component';
import { TerminalButtonComponent } from './terminal-button/terminal-button.component';
import { TerminalPromptComponent } from './terminal-prompt/terminal-prompt.component';

@NgModule({
  declarations: [
    AppComponent,
    TerminalComponent,
    TerminalButtonComponent,
    TerminalPromptComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
