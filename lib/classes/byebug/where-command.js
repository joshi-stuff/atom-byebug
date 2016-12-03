'use babel';

import Command from './command';

export default class WhereCommand extends Command {
  constructor(handler) {
    super(handler, 'where');
    this._stack_trace = [];
  }

  _on_line(line) {
    const i = line.indexOf('#');
    line = line.substring(i);
    line = line.replace(/#[^ ]*/,'').replace(/^ */,'')
    const parts = line.split(' at ');
    const parts2 = parts[1].split(':');
    const frame = {
      method: parts[0],
      file: parts2[0],
      line: parts2[1]
    };

    this._stack_trace.push(frame);
  }

  get _output() {
    return this._stack_trace;
  }
}
