import React, { Component } from 'react';

import './SearchBox.css';

class RSearchBox extends Component {
  /**
   * @param {!{defaultQuery: !string, onQuery: function(string): undefined}} props 
   */
  constructor(props) {
    super(props);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.search = this.search.bind(this);

    this.state = {stringQuery: props.defaultQuery};
  }

  handleTyping(event) {
    this.setState({stringQuery: event.target.value});
  }

  handleEnter(event) {
    // Check for an enter.
    if (event.charCode === 13) {
      this.search();
    }
  }

  search() {
    if (this.state.stringQuery.replace(/ /g, "").length > 0) {
      console.log("Value in searchbox: " + this.state.stringQuery);
      this.props.onQuery(this.state.stringQuery);
    }
  }

  render() {
    return (
      <div className={"search-box-div"}>
        <input 
          type="text" 
          value={this.state.stringQuery} 
          onChange={this.handleTyping} 
          onKeyPress={this.handleEnter} 
          name="inputQuery" 
          autoFocus
          className={"search-box-input"}
        />
        <input 
          type="button" 
          value="GO" 
          name="submitQuery"
          onClick={this.search}
          className={"search-box-input"}
        />
      </div>
    );
  }
}

export default RSearchBox;
