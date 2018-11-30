import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-terminal-button',
  templateUrl: './terminal-button.component.html',
  styleUrls: ['./terminal-button.component.css']
})
export class TerminalButtonComponent implements OnInit {

  @Input() style;
  @Input() command: string;
  @Input() runCommand: (string) => void;

  constructor() { }

  ngOnInit() {
  }
}
