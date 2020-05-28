import React, { Component } from 'react';

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
    return (
      <div>
        <RCodeMirror
          value={this.state.code}
          options={{
            mode: null,
            lineNumbers: true,
            // Enables browser text search and helps to set the height
            // of the editor automatically.
            viewportMargin: Infinity,
            readOnly: true,
          }}
          onBeforeChange={(editor, data, value) => {
            this.setState({code: value});
          }}
        />
      </div>
    );
  }
}

export default RCodeViewer;
