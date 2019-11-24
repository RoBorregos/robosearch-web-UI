import React, { Component } from 'react';

import RCodeViewer from './code_viewer/CodeViewer.react';

class RFileViewer extends Component {
  /** 
   * @param {!{searchParams: !URL.searchParams}} props 
   */
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <RCodeViewer defaultSearchParams={this.props.searchParams} />
      </div>
    );
  }
}

export default RFileViewer;
