import {Directory, TerminalState} from './terminal-state.model';

export abstract class StateModifier {
  constructor(protected getCurrentState: () => TerminalState, protected setCurrentState: (state: object) => void)  { }
}

export abstract class BaseCommand extends StateModifier {
  abstract run(params: string[]): void;
}

export abstract class QuickCommand extends StateModifier {
  color: string;
  text: string;
  abstract run(): void;
}

export class AboutQuickCommand extends QuickCommand {
  aboutCommand: AboutCommand;
  constructor(getCurrentState: () => TerminalState, setCurrentState: (state: object) => void) {
    super(getCurrentState, setCurrentState);
    this.color = '#004800';
    this.text = 'about';
    this.aboutCommand = new AboutCommand(getCurrentState, setCurrentState);
  }
  run(): void {
    this.getCurrentState().outputs.push('user@maxro.se/local: ' + this.getCurrentState().currentPath.getPath() + ' $' + this.text);
    this.aboutCommand.run();
    this.getCurrentState().shouldScroll = true;
  }
}

export class CDQuickCommand extends QuickCommand {
  constructor(getCurrentState: () => TerminalState, setCurrentState: (state: object) => void) {
    super(getCurrentState, setCurrentState);
    this.color = '#480000';
    this.text = 'cd';
  }
  run(): void {
    const currentCommands = this.getCurrentState().quickCommands.splice(0);
    this.getCurrentState().quickCommands = [];
    const childrenDirs = this.getCurrentState().currentPath.getChildren();
    if (this.getCurrentState().currentPath.parent) {
      this.getCurrentState().quickCommands.push(
        new CDExplicitQuickCommand(
          this.getCurrentState, this.setCurrentState, this.getCurrentState().currentPath.parent, '..', currentCommands
        )
      );
    }
    for (const child of childrenDirs) {
      this.getCurrentState().quickCommands.push(
        new CDExplicitQuickCommand(
          this.getCurrentState, this.setCurrentState, child, child.name, currentCommands
        )
      );
    }
  }
}

export class CDExplicitQuickCommand extends QuickCommand {
  targetDir: Directory;
  prevCommands: QuickCommand[];
  constructor(getCurrentState: () => TerminalState,
              setCurrentState: (state: object) => void,
              targetDir: Directory,
              targetDirName: string,
              prevCommands: QuickCommand[]) {
    super(getCurrentState, setCurrentState);
    this.targetDir = targetDir;
    this.text = 'cd ' + targetDirName;
    this.color = '#600000';
    this.prevCommands = prevCommands;
  }
  run(): void {
    this.getCurrentState().outputs.push('user@maxro.se/local: ' + this.getCurrentState().currentPath.getPath() + ' $' + this.text);
    this.setCurrentState({currentPath: this.targetDir, quickCommands: this.prevCommands});
    this.getCurrentState().shouldScroll = true;
  }
}

export class LSQuickCommand extends QuickCommand {
  constructor(getCurrentState: () => TerminalState, setCurrentState: (state: object) => void) {
    super(getCurrentState, setCurrentState);
    this.color = '#000048';
    this.text = 'ls';
  }
  run(): void {
    const currentCommands = this.getCurrentState().quickCommands.splice(0);
    this.getCurrentState().quickCommands = [
      new LSExplicitQuickCommand(this.getCurrentState, this.setCurrentState, false, currentCommands),
      new LSExplicitQuickCommand(this.getCurrentState, this.setCurrentState, true, currentCommands),
    ];
  }
}

export class LSExplicitQuickCommand extends QuickCommand {
  lsCommand: LSCommand;
  showAll: boolean;
  prevCommands: QuickCommand[];
  constructor(getCurrentState: () => TerminalState,
              setCurrentState: (state: object) => void,
              showAll: boolean,
              prevCommands: QuickCommand[]) {
    super(getCurrentState, setCurrentState);
    this.color = '#000060';
    this.text = 'ls' + (showAll ? ' -a' : '');
    this.showAll = showAll;
    this.lsCommand = new LSCommand(getCurrentState, setCurrentState);
    this.prevCommands = prevCommands;
  }
  run(): void {
    this.getCurrentState().outputs.push('user@maxro.se/local: ' + this.getCurrentState().currentPath.getPath() + ' $' + this.text);
    this.lsCommand.run(this.showAll ? ['-a'] : []);
    this.getCurrentState().quickCommands = this.prevCommands;
    this.getCurrentState().shouldScroll = true;
  }
}

export class AboutCommand extends BaseCommand {
  run(): void {
    const path: string = this.getCurrentState().currentPath.getPath();
    console.log(path);
    switch (path) {
      case '/':
        this.getCurrentState().outputs = this.getCurrentState().outputs.concat([
          'About: maxro.se/',
          'I am a Computer Science and Mathematics student at the University of Florida.',
          'In school, my favorite subjects to work with are predicate calculus and data structures/algorithms.',
          '',
          'Hint: for more information on other topics, try \'ls\' and/or \'cd\' before using \'about!\''
        ]);
        break;
      default:
        this.getCurrentState().outputs.push('invalid about with directory \'' + path + '\'');
        break;
    }
    this.getCurrentState().shouldScroll = true;
  }
}

export class CDCommand extends BaseCommand {
  run(params: string[]): void {
    if (!params[0]) {
      this.getCurrentState().outputs.push('cd: Specify a directory. Use \'ls\' to see files and directories');
    }

    let targetDir: Directory;
    const currentPath = this.getCurrentState().currentPath;

    if (params[0] === '..') {
      targetDir = currentPath.parent;
    } else if (params[0] === '.') {
      targetDir = currentPath;
    } else {
      targetDir = currentPath.getChild(params[0]);
    }
    if (targetDir) {
      this.setCurrentState({
        currentPath: targetDir
      });
    } else {
      this.getCurrentState().outputs.push('cd: ' + params[0] + ': No such directory');
    }
    this.getCurrentState().shouldScroll = true;
  }
}

export class LSCommand extends BaseCommand {
  run(params: string[]): void {
    let showHidden = false;
    const currentPath = this.getCurrentState().currentPath;

    for (const param of params) {
      if (param === '-a') {
        showHidden = true;
      }
    }

    const children: Directory[] = currentPath.getChildren(showHidden);
    const ret: string[] = [];

    if (showHidden) {
      ret.push('.');
      if (currentPath.parent) {
        ret.push('..');
      }
    }
    if (children) {
      for (const child of children) {
        ret.push(child.name);
      }
    }
    ret.sort();
    this.getCurrentState().outputs = this.getCurrentState().outputs.concat(ret);
    this.getCurrentState().shouldScroll = true;
  }
}

// export class ManCommand extends Command {
//   run(params: string[]): string[] {
//
//   }
// }
