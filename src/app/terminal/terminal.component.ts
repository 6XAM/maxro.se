import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseCommand, AboutCommand, CDCommand, LSCommand } from '../shared/command.model';
import { Directory, TerminalState, mergeStates } from '../shared/terminal-state.model';

@Component({
  selector: 'app-terminal-root',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {

  @ViewChild('terminalRoot') private myScrollContainer: ElementRef;

  quickCommands: object[] = [
    {cmd: 'cd', style: { backgroundColor: '#480000' }},
    {cmd: 'ls', style: { backgroundColor: '#004800' }},
    {cmd: 'about', style: { backgroundColor: '#000048' }}
  ];

  outputs = [
    'Welcome to maxro.se, the home of all things Maxwell Rosenzweig!',
    '',
    'I designed my website to act like a pseudo-terminal. Try typing some of the following commands to see what\'s available:',
    '',
    '\u00A0\u00A0\u00A0\u00A0 about',
    '\u00A0\u00A0\u00A0\u00A0 ls',
    '\u00A0\u00A0\u00A0\u00A0 cd',
    '',
    'If you are on mobile, quick-command buttons are provided above the command prompt.'
  ];

  root: Directory = new Directory('');

  state: TerminalState = new TerminalState(this.root);

  commands: {[index: string]: BaseCommand} = {
    'about': new AboutCommand(this.getCurrentState.bind(this), this.setCurrentState.bind(this)),
    'cd': new CDCommand(this.getCurrentState.bind(this), this.setCurrentState.bind(this)),
    'ls': new LSCommand(this.getCurrentState.bind(this), this.setCurrentState.bind(this))
  };

  isMobile: boolean = /Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);

  getCurrentState(): TerminalState {
    return this.state;
  }

  setCurrentState(newState: object): void {
    mergeStates(this.state, newState);
  }

  constructor() {
    this.root.addChild('projects');
    this.root.addChild('links');
    this.root.addChild('work');
  }

  ngOnInit() {
  }

  execCommand(command: string): void {
    this.outputs.push('user@maxro.se/local: ' + this.state.currentPath.getPath() + ' $' + command);
    let params = command.split(' ');
    command = params[0];
    params = params.splice(1);
    if (this.commands[command]) {
      this.outputs = this.outputs.concat(this.commands[command].run(params));
    } else {
      this.outputs.push(command + ': command not found.');
    }
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
