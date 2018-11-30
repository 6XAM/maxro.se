import {Directory, TerminalState} from './terminal-state.model';

export abstract class BaseCommand {
  constructor(protected getCurrentState: () => TerminalState, protected setCurrentState: (state: object) => void)  { }
  abstract run(params: string[]): string[];
}

export class AboutCommand extends BaseCommand {
  run(params: string[]): string[] {
    const path: string = this.getCurrentState().currentPath.getPath();
    switch (path) {
      case '/':
        return [
          'About: maxro.se/',
          'I am a Computer Science and Mathematics student at the University of Florida.',
          'In school, my favorite subjects to work with are predicate calculus and data structures/algorithms.',
          '',
          'Hint: for more information on other topics, try \'ls\' and/or \'cd\' before using \'about!\''
        ];
      default:
        return ['invalid about with directory \'' + path + '\''];
    }
  }
}

export class CDCommand extends  BaseCommand {
  run(params: string[]): string[] {
    if (!params[0]) {
      return ['cd: Specify a directory. Use \'ls\' to see files and directories'];
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
      return [];
    }
    return ['cd: ' + params[0] + ': No such directory'];
  }
}

export class LSCommand extends  BaseCommand {
  run(params: string[]): string[] {
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
    return ret;
  }
}

// export class ManCommand extends Command {
//   run(params: string[]): string[] {
//
//   }
// }
