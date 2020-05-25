import React, { Component } from 'react';

import ResultStruct from 'home_page/ResultStruct.js'
import RResultDiv from 'home_page/result_viewer/ResultDiv.react.js';

class RResultViewer extends Component {
  /**
   * @param {!{results: !Array<!ResultStruct>, onClickToOpenFile: !function(!string, !string, !string):undefined}} props
   */
	constructor(props) {
		super(props);
	}

	render() {
    const listOfResultDivs = this.props.results.map((resultStruct, index) => {
      return <RResultDiv 
        key={index.toString()} 
        data={resultStruct} 
        onClickToOpen={this.props.onClickToOpenFile} 
        />;
    });

		return <div> {listOfResultDivs}</div>;
	}
}

export default RResultViewer;
