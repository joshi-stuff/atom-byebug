"use babel";

import {} from 'atom';
import { View } from 'atom-space-pen-views';

export default class DebuggerView extends View {
  constructor() {
    super();
    atom.workspace.addBottomPanel({ item: this, visible: true });
  }

  static content() {
    /*
    @div class: 'atom-debugger', =>
      @header class: 'header', =>
        @span class: 'header-item title', 'Atom Debugger'
        @span class: 'header-item sub-title', outlet: 'targetLable'
      @div class: 'btn-toolbar', =>
        @div class: 'btn-group', =>
          @div class: 'btn', outlet: 'runButton', 'Run'
          @div class: 'btn disabled', outlet: 'continueButton', 'Continue'
          @div class: 'btn disabled', outlet: 'interruptButton', 'Interrupt'
          @div class: 'btn disabled', outlet: 'nextButton', 'Next'
          @div class: 'btn disabled', outlet: 'stepButton', 'Step'
    */
    debugger;
    return this.div({}, "hola");
    /*
    return this.div({
      "class": 'atom-debugger'
    }, (function(_this) {
      return function() {
        _this.header({
          "class": 'header'
        }, function() {
          _this.span({
            "class": 'header-item title'
          }, 'Atom Debugger');
          return _this.span({
            "class": 'header-item sub-title',
            outlet: 'targetLable'
          });
        });
        return _this.div({
          "class": 'btn-toolbar'
        }, function() {
          return _this.div({
            "class": 'btn-group'
          }, function() {
            _this.div({
              "class": 'btn',
              outlet: 'runButton'
            }, 'Run');
            _this.div({
              "class": 'btn disabled',
              outlet: 'continueButton'
            }, 'Continue');
            _this.div({
              "class": 'btn disabled',
              outlet: 'interruptButton'
            }, 'Interrupt');
            _this.div({
              "class": 'btn disabled',
              outlet: 'nextButton'
            }, 'Next');
            return _this.div({
              "class": 'btn disabled',
              outlet: 'stepButton'
            }, 'Step');
          });
        });
      };
    })(this));
    */
  }
}
