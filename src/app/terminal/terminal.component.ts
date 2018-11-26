import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terminal-root',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {

  commands = [
    'Welcome to maxro.se, the home of all things Maxwell Rosenzweig!',
    '',
    'This page is designed to act like a pseudo-terminal. Try typing some of the following commands to see what\'s available:',
    '',
    '\u00A0\u00A0\u00A0\u00A0 about',
    '\u00A0\u00A0\u00A0\u00A0 links',
    '\u00A0\u00A0\u00A0\u00A0 help',
    '',
    'If you are on mobile, inline buttons are provided to make the experience more convenient for you.'
  ];

  constructor() { }

  ngOnInit() {
  }

}
