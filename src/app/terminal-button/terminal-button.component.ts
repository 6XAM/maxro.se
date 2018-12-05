import { Component, Input, OnInit } from '@angular/core';
import {QuickCommand} from '../shared/command.model';

@Component({
  selector: 'app-terminal-button',
  templateUrl: './terminal-button.component.html',
  styleUrls: ['./terminal-button.component.css']
})
export class TerminalButtonComponent implements OnInit {

  @Input() quickCommand: QuickCommand;

  constructor() { }

  ngOnInit() {
  }
}
