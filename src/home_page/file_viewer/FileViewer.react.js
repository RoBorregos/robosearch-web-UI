import React, { Component } from 'react';

import RCodeViewer from 'home_page/file_viewer/code_viewer/CodeViewer.react.js';

class RFileViewer extends Component {
  /** 
   * @param {!{searchParams: !URLSearchParams}} props 
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
