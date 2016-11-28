'use babel';

import { $ } from 'atom-space-pen-views';

import Widget from './widget';
import DebuggerPane from './debugger-pane'
import OutputPane from './output-pane'

export default class DebuggerView extends Widget {
  constructor() {
    super(DebuggerView.HTML);
    this._body = this._child('.body');

    this._create_panes();
    this._install_tab_selection_handler();
    this._install_button_handlers();

    this.selected_tab = 'output';
  }

  get output_pane() {
    return this._panes_map['output'];
  }

  get call_stack_pane() {
    return this._panes_map['call_stack'];
  }

  get variables_pane() {
    return this._panes_map['variables'];
  }

  get breakpoints_pane() {
    return this._panes_map['breakpoints'];
  }

  get debugger_pane() {
    return this._panes_map['debugger'];
  }

  set selected_tab(tab_id) {
    this._tabs.removeClass('active');
    this._tabs.filter(`[data-tab=${tab_id}]`).addClass('active');
    this._panes.forEach((pane) => { pane.visible = false; });
    this._panes_map[tab_id].visible = true;
  }

  enable_button(button_id, enabled = true) {
    const btn = this._child(`#${button_id}`);

    btn.prop('disabled', !enabled);
    if (enabled) {
      btn.removeClass('disabled');
    } else {
      btn.addClass('disabled');
    }
  }

  _create_panes() {
    this._panes_map = {
      output: new OutputPane(),
      call_stack: new Widget(),
      variables: new Widget(),
      breakpoints: new Widget(),
      debugger: new DebuggerPane()
    };

    this._panes.forEach((pane) => {
      pane.appendTo(this._body);
    });
  }

  _install_tab_selection_handler() {
    this._tabs.click((ev) => {
      this.selected_tab = $(ev.target).data('tab');
    });
  }

  _install_button_handlers() {
    this._buttons.click((ev) => {
      this.emit(ev.target.id);
    });
  }

  get _buttons() {
    return this._child('.toolbar button');
  }

  get _tabs() {
    return this._child('.tabs button');
  }

  get _panes() {
    return Object.keys(this._panes_map).map((id) => {return this._panes_map[id]} );
  }
}

DebuggerView.EVENT = {
  RUN: 'run',
  NEXT: 'next',
  STEP: 'step',
  STOP: 'stop',
  CONFIGURE: 'configure'
};

DebuggerView.HTML =
  `
  <div class="toolbar">
    <button class="btn" title="Open Byebug Debugger Site">Byebug Debugger</button>
    <div class="btn-group">
      <button id="${DebuggerView.EVENT.RUN}" class="btn icon icon-playback-play" title="Run (F8)">
        Run
      </button>
      <button disabled id="${DebuggerView.EVENT.NEXT}" class="btn icon icon-jump-right disabled"
              title="Step over (F10)">
        Next
      </button>
      <button disabled id="${DebuggerView.EVENT.STEP}" class="btn icon icon-steps disabled"
              title="Step into (F11)">
        Step
      </button>
      <button disabled id="${DebuggerView.EVENT.STOP}" class="btn icon icon-stop disabled">
        Stop
      </button>
    </div>
    <button id="${DebuggerView.EVENT.CONFIGURE}" class="btn icon icon-gear">
      Configure project
    </button>
  </div>

  <div class="body">
  </div>

  <div class="tabs btn-group">
    <button class="btn" data-tab="output">Output</button>
    <button class="btn" data-tab="call_stack">Call stack</button>
    <button class="btn" data-tab="variables">Variables</button>
    <button class="btn" data-tab="breakpoints">Breakpoints</button>
    <button class="btn" data-tab="debugger">Debugger</button>
  </div>
  `;
