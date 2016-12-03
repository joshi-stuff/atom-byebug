'use babel';

import { $ } from 'atom-space-pen-views';

import Widget from './widget';

export default class CallStackPane extends Widget {
  constructor() {
    super(CallStackPane.HTML);
    this._content = this._child('.content');
  }

  clear() {
    this._content.html('');
  }

  show(stack_trace) {
    let html = `<table>
      <tr>
        <th>Method</th>
        <th>File</th>
        <th>Line</th>
      </tr>
    `;

    stack_trace.forEach((frame) => {
      html += `<tr class="frame" data-file="${frame.file}" data-line="${frame.line}">
        <td>${frame.method.replace('<', '&lt;')}</td>
        <td>${frame.file}</td>
        <td>${frame.line}</td>
      </tr>`;
    });

    html += '</table>';

    this._content.html(html);

    this._child('tr.frame').each((i, tr) => {
      const $tr = $(tr);

      $tr.click(() => {
        const file = $tr.data('file');
        const line = $tr.data('line');

        atom.workspace.open(
          file, {
            initialLine: line-1,
            pending: true
          }
        );
      });
    });
  }
}

CallStackPane.HTML = '<div class="content"></div>';
