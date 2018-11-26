import {ChangeDetectorRef, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-terminal-prompt',
  templateUrl: './terminal-prompt.component.html',
  styleUrls: ['./terminal-prompt.component.css']
})
export class TerminalPromptComponent implements OnInit {

  command = '';
  promptCaretBeginPos = 0;
  promptCaretEndPos = 0;
  promptFocused = true;
  isFlash = true;

  constructor(private cd: ChangeDetectorRef) {
    setInterval(() => {
      this.promptCaretBeginPos = (<HTMLInputElement>document.getElementById('realPrompt')).selectionStart;
      this.promptCaretEndPos = (<HTMLInputElement>document.getElementById('realPrompt')).selectionEnd;
      this.cd.markForCheck();
    }, 5);
    setInterval(() => {
      this.isFlash = !this.isFlash;
      this.cd.markForCheck();
    }, 500);
  }

  ngOnInit() {
  }

  onPromptClick() {
    document.getElementById('realPrompt').focus();
    this.promptFocused = true;
  }

  onPromptBlur() {
    this.isFlash = true;
    this.promptFocused = false;
  }

  onKeyPress(e) {
    if (e.key === 'Return') {

    }
  }
}
