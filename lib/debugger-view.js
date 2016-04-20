"use babel";

import Widget from './widget';

export default class DebuggerView extends Widget {
  constructor() {
    super(DebuggerView.HTML);
  }
}

DebuggerView.HTML =
  `
  <div class="padded">
    <div class="inset-panel">
      <div class="panel-heading">Byebug debugger</div>
        <div class="panel-body padded">
          <div class="btn-group">
              <button class="btn icon icon-playback-play">
                Run
              </button>
              <button class="btn icon icon-jump-right">
                Step over
              </button>
              <button class="btn icon icon-sign-in">
                Step into
              </button>
              <button class="btn icon icon-stop">
                Stop
              </button>
          </div>
          <ul class="tab-bar inset-panel">
            <li class="tab active"><div class="title">Call stack</div></li>
            <li class="tab"><div class="title">Variables</div></li>
            <li class="tab"><div class="title">Breakpoints</div></li>
          </ul>
          <div>
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
            Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
