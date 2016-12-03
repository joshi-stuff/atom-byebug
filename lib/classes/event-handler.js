'use babel';

import { EventEmitter } from 'events';

export default class EventHandler extends EventEmitter {
  constructor() {
    super();
    this._enabled = true;
  }

  emit(event_name, ...args) {
    if(this._enabled) {
      super.emit(event_name, ...args);
    }
  }

  enable() {this._enabled = true}
  disable() {this._enabled = false}

  repeat(source_handler, source_event, repeat_event) {
    source_handler.on(source_event, (...args) => {
      this.emit(repeat_event, ...args);
    });
  }
}
