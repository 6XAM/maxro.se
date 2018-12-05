import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AboutCommand, CDCommand, LSCommand, CDQuickCommand, AboutQuickCommand, LSQuickCommand} from '../shared/command.model';
import { Directory, TerminalState, mergeStates } from '../shared/terminal-state.model';

@Component({
  selector: 'app-terminal-root',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit, AfterViewChecked {

  @ViewChild('terminalRoot') private terminalRootElement: ElementRef;
  root: Directory = new Directory('');
  state: TerminalState = new TerminalState(this.root);

  isMobile: boolean = /Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);
  shouldScroll = false;

  getCurrentState(): TerminalState {
    return this.state;
  }

  setCurrentState(newState: object): void {
    mergeStates(this.state, newState);
  }

  constructor(private cd: ChangeDetectorRef) {
    this.root.addChild('projects');
    this.root.addChild('links');
    this.root.addChild('work');
    this.state.commands.cd = new CDCommand(this.getCurrentState.bind(this), this.setCurrentState.bind(this));
    this.state.commands.about = new AboutCommand(this.getCurrentState.bind(this), this.setCurrentState.bind(this));
    this.state.commands.ls = new LSCommand(this.getCurrentState.bind(this), this.setCurrentState.bind(this));
    this.state.quickCommands.push(new CDQuickCommand(this.getCurrentState.bind(this), this.setCurrentState.bind(this)));
    this.state.quickCommands.push(new AboutQuickCommand(this.getCurrentState.bind(this), this.setCurrentState.bind(this)));
    this.state.quickCommands.push(new LSQuickCommand(this.getCurrentState.bind(this), this.setCurrentState.bind(this)));
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    if (this.state.shouldScroll) {
      this.terminalRootElement.nativeElement.scrollTop = this.terminalRootElement.nativeElement.scrollHeight;
      this.shouldScroll = false;
    }
  }

  execCommand(command: string): void {
    this.state.outputs.push('user@maxro.se/local: ' + this.state.currentPath.getPath() + ' $' + command);
    let params = command.split(' ');
    command = params[0];
    params = params.splice(1);
    if (this.state.commands[command]) {
      this.state.commands[command].run(params);
    } else {
      this.state.outputs.push(command + ': command not found.');
    }
  }
}
