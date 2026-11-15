import { PROFILE } from '../../data/profile';

export type TerminalAction =
  | { type: 'navigate'; path: string }
  | { type: 'open'; url: string }
  | { type: 'clear' };

export interface CommandResult {
  lines: string[];
  history: string[];
  action?: TerminalAction;
}

//ページのパス名
const PAGE_PATHS = new Map([
  ['about', '/about'],
  ['skills', '/skills'],
  ['products', '/products'],
]);

// 外部リンクのURL
const EXTERNAL_LINKS = new Map([
  ['x', { label: 'X', url: PROFILE.xUrl }],
  ['github', { label: 'GitHub', url: PROFILE.githubUrl }],
]);

// コマンドの実行結果を返す関数
export function executeCommand(input: string, history: readonly string[]): CommandResult {
  const commandLine = input.trim();
  if (!commandLine) return { lines: [], history: [...history] };

  const commandName = commandLine.split(/\s+/, 1)[0];
  const remainder = commandLine.slice(commandName.length);
  const args = remainder.trim() ? remainder.trim().split(/\s+/) : [];
  const command = commandName.toLowerCase();
  const nextHistory = [...history, commandLine];
  // コマンドの実行結果を返すための関数
  const respond = (lines: string[], action?: TerminalAction): CommandResult => ({
    lines,
    history: nextHistory,
    action,
  });

  switch (command) {
    case 'help':
      return args.length > 0
        ? respond(['Usage: help'])
        : respond([
          'Available commands: help, hello, cd, ls, echo, history, open, clear',
          'cd <about|skills|products>',
          'open <x|github>',
          'echo <text>',
        ]);

    case 'hello':
      return respond(args.length > 0 ? ['Usage: hello'] : ['Hello!']);

    case 'cd': {
      if (args.length !== 1) return respond(['Usage: cd <about|skills|products>']);
      const target = args[0].toLowerCase();
      const path = PAGE_PATHS.get(target);
      return path
        ? respond([`Opening ${target}...`], { type: 'navigate', path })
        : respond([`Page not found: ${target}`]);
    }

    case 'ls':
      return respond(args.length > 0
        ? ['Usage: ls']
        : ['👤 About Me', '💻 Skills', '🚀 Products']);

    case 'echo': {
      // 最初の区切り文字だけを除き、それ以降の空白と大文字・小文字は保持する。
      const message = remainder.replace(/^\s/, '');
      return respond(message.trim() ? [message] : ['Usage: echo <text>']);
    }

    case 'history':
      return respond(args.length > 0
        ? ['Usage: history']
        : nextHistory.map((item, index) => `${index + 1}: ${item}`));

    case 'open': {
      if (args.length !== 1) return respond(['Usage: open <x|github>']);
      const destination = EXTERNAL_LINKS.get(args[0].toLowerCase());
      return destination
        ? respond([`Opening ${destination.label}...`], { type: 'open', url: destination.url })
        : respond(['Usage: open <x|github>']);
    }

    case 'clear':
      return args.length > 0
        ? respond(['Usage: clear'])
        : respond([], { type: 'clear' });

    default:
      return respond([`Command not found: ${commandLine}`]);
  }
}
