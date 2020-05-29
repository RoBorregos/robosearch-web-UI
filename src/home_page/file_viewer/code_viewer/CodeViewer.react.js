import React, { Component } from 'react';

// TODO: Fix the use of addons and instead of
// this and choose here what mode, use loadmode.js.
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import {Controlled as RCodeMirror} from 'react-codemirror2';

import {validateAndRequestCodeWithParams} from 'home_page/file_viewer/code_viewer/CodeRequester.js';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'home_page/file_viewer/code_viewer/CodeMirrorCustom.css';


class RCodeViewer extends Component {
  /** 
   * @param {!{defaultSearchParams: !URLSearchParams}} props 
   */
  constructor(props) {
    super(props);
    /** @type {!{code: !string}} */
    this.state = {code: ""};
  }

  componentDidMount() {
    validateAndRequestCodeWithParams(
      this.props.defaultSearchParams,
      r => this.setState({code: r !== null ? r.code : ""}),
    );
  }

  render() {
    const CMOptions = {
      // This is set when files is get.
      mode: this.getModeNameByExtension(),
      lineNumbers: true,
      // Enables browser text search and helps to set the height
      // of the editor automatically.
      viewportMargin: Infinity,
      readOnly: true,
    };

    return (
      <div>
        <RCodeMirror
          value={this.state.code}
          options={CMOptions}
          onBeforeChange={(editor, data, value) => {
            this.setState({code: value});
          }}
        />
      </div>
    );
  }

  getModeNameByExtension() {
    if (!this.props.defaultSearchParams.has('file')) {
      return null;
    }
    const filePath = this.props.defaultSearchParams.get('file');

    const extension = /.+\.([^.]+)$/.exec(filePath);
    if (!extension) {
      return null;
    }

    switch(extension[1]) {
      case 'js':
        return 'javascript';
      case 'c':
      case 'h':
      case 'cpp':
      case 'ino':
        return 'clike';
      case 'py':
        return 'python';
      default:
        return null;
    }
  }
}

export default RCodeViewer;
