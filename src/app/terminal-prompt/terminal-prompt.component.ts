import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TerminalState} from '../shared/terminal-state.model';

@Component({
  selector: 'app-terminal-prompt',
  templateUrl: './terminal-prompt.component.html',
  styleUrls: ['./terminal-prompt.component.css']
})
export class TerminalPromptComponent implements OnInit {

  @Input() getCurrentState: () => TerminalState;
  @Output() command: EventEmitter<string> = new EventEmitter<string>();

  commandText = '';

  promptCaretBeginPos = 0;
  promptCaretEndPos = 0;
  promptFocused = true;
  isFlash = true;

  prevCommands = [ '' ]; // Most recent outputs at end of array.
  prevCommandsIndex = 0; // prevCommands[0] is current command, and must always be updated whenever prevCommandsIndex changed from 0.

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

  onPromptClick(): void {
    document.getElementById('realPrompt').focus();
    this.promptFocused = true;
  }

  onPromptBlur(): void {
    this.isFlash = true;
    this.promptFocused = false;
  }

  onKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowUp': {
        if (!(this.prevCommandsIndex >= this.prevCommands.length - 1)) {
          if (this.prevCommandsIndex === 0) {
            this.prevCommands[0] = this.commandText;
          }
          this.prevCommandsIndex++;
          this.commandText = this.prevCommands[this.prevCommandsIndex];
        }
        break;
      }
      case 'ArrowDown': {
        if (!(this.prevCommandsIndex === 0)) {
          this.prevCommandsIndex--;
          this.commandText = this.prevCommands[this.prevCommandsIndex];
        }
        break;
      }
      case 'Enter': {
        this.command.emit(this.commandText);
        this.prevCommandsIndex = 0;
        this.prevCommands[0] = this.commandText;
        this.commandText = '';
        this.prevCommands.unshift('');
        break;
      }
      default:
        break;
    }
  }
}
