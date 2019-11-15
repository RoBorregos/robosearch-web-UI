import React, {Component} from 'react';

import {GroupMatchesStruct} from '../../ResultStruct.js';
import {computeSplitedAndHighlitedFragment} from './FragmentFormatter.js';

import './CodeFragment.css';

class RCodeFragment extends Component {
  /**
   * @param {!{data: !GroupMatchesStruct, onClickToOpen: function():undefined}} props
   */
	constructor(props) {
    super(props);
    this.onClickToOpen = this.onClickToOpen.bind(this);
  }

  onClickToOpen() {
    this.props.onClickToOpen();
  }

	render() {
    const data = this.props.data;

    // const divCodeLines = 
    //   data.fragment.split("\n").map((stringLine, index) => (       
    //     <pre key={index.toString()}>
    //       {stringLine}
    //     </pre>
    //   ));
    // TODO: Clone only the neccesary: fragment and matches.
    const dataClone = JSON.parse(JSON.stringify(data));
    const divCodeLines = computeSplitedAndHighlitedFragment(dataClone);

		return (
			<div className={"fragment-div"}>
        <div className={"code-lines-div"} onClick={this.onClickToOpen}>
          {divCodeLines}
        </div>

        <div className={"footer-div"}>
          {data.fragment.split("\n").length} lines - {data.matches.length} appearances
        </div>
			</div>
		);
  }
}

export default RCodeFragment;
