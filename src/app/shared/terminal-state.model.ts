import {BaseCommand, QuickCommand} from './command.model';

export class Directory {
  name: string;
  parent: Directory;
  children: Directory[] = [];

  constructor(name: string, parent?: Directory, children?: Directory[]) {
    this.name = name;
    this.parent = parent;
    if (children) {
      this.children = children;
    }
  }

  getChildren(showHidden: boolean = false): Directory[] {
    if (showHidden) {
      return this.children;
    }
    const ret: Directory[] = [];
    for (const child of this.children) {
      if (child.name.charAt(0) !== '.') {
        ret.push(child);
      }
    }
    return ret;
  }

  getChild(name: string): Directory {
    for (const child of this.children) {
      if (child.name === name) {
        return child;
      }
    }
    return undefined;
  }

  getPath(): string {
    if (this.parent) {
      return this.parent.getPath() + this.name +  '/';
    } else {
      return this.name + '/';
    }
  }

  addChild(name: string): Directory {
    const child: Directory = new Directory(name, this);
    this.children.push(child);
    return child;
  }
}

export class TerminalState {
  fileSystem: Directory;
  currentPath: Directory;
  shouldScroll = false;
  quickCommands: QuickCommand[] = [];
  commands: {[index: string]: BaseCommand} = {};
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

  constructor(fileSystem?: Directory, currentPath?: Directory) {
    this.fileSystem = fileSystem;
    if (currentPath) {
      this.currentPath = currentPath;
    } else {
      this.currentPath = fileSystem;
    }
  }
}

export function mergeStates(stateOld: object, stateNew: object): void {
  for (const key of Object.keys(stateNew)) {
    stateOld[key] = stateNew[key];
  }
}
