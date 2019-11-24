import React, { Component } from 'react';

class RCodeViewer extends Component {
  /** 
   * @param {!{defaultSearchParams: !URL.searchParams}} props 
   */
  constructor(props) {
    super(props);
    this.state = {code: ""};
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
