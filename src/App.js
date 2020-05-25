import React, { Component } from 'react';

import RHomePage from 'home_page/HomePage.react.js'

/**
 * TODO: Review if this component is really necessary. Maybe could be the one
 * that calls Redirecter.js.
 */
class App extends Component {
  /** @param {!{url: !URL}} props */
  constructor(props) {
    super(props);
  }

  render() {
    return <RHomePage urlParams={this.props.url.searchParams} />;
  }
}

export default App;
