import React, { Component } from 'react';

import './ErrorNotice.css';

class RErrorNotice extends Component {
  /** 
   * @param {!{error: ?string, rateLimit: !boolean}} props 
   */
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.error === null && !this.props.rateLimit) {
      return <div />;
    }

    const errorMessage = this.props.rateLimit ? 
      "Limit of requests exceeded, try again in a minute." :
      this.props.error;
    return (
      <div className={"error-notice-div"}>
        <p className={"error-paragraph"}>
          There has been an error while making the request. Try again.
        </p>
        <p className={"error-paragraph"}><code>{errorMessage}</code></p>
      </div>
    );
  }
}

export default RErrorNotice;
