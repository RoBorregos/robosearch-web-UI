import React, { Component } from 'react';

import {validateAndRequestCodeWithParams} from './CodeRequester.js';

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
        <pre>{this.state.code}</pre>
      </div>
    );
  }
}

export default RCodeViewer;
