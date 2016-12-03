'use babel';

import DefaultHandler from './default-handler';

export default class Command {
  constructor(handler, command) {
    this._handler = handler;
    this._command = command;
    this._resolve = null;
  }

  run() {
    const handler = this._handler;

    return new Promise((resolve, reject) => {
      const received_handler = (line) => {
        this._on_line(line)
      }
      const enter_prompt_handler = () => {
        handler.removeListener(DefaultHandler.EVENT.RECEIVED, received_handler);
        handler.removeListener(DefaultHandler.EVENT.ENTER_PROMPT, enter_prompt_handler);
        const result = this._output;
        resolve(result);
      }
      handler.on(DefaultHandler.EVENT.RECEIVED, received_handler);
      handler.on(DefaultHandler.EVENT.ENTER_PROMPT, enter_prompt_handler);

      handler.send(this._command);
    });
  }

  _on_line(line) {}
  get _output() {return null}
}
