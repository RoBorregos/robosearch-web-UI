import React, { Component } from 'react';

import RCodeFragment from './code_fragment/CodeFragment.react.js'

import './ResultDiv.css';

class RResultDiv extends Component {
  /**
   * @param {!{data: !ResultStruct, onClickToOpen: function(string):undefined}} props
   */
	constructor(props) {
    super(props);
    this.onClickToOpen = this.onClickToOpen.bind(this);
  }

  onClickToOpen() {
    this.props.onClickToOpen(this.props.data.apiByMasterUrl);
  }

	render() {
    const data = this.props.data;

    const privateSpan = data.repositoryIsPrivate ? <span>PRIVATE</span> : null;

    const codeFragments = data.groupsMatches.map((match, key) => {
      return <RCodeFragment 
        key={key.toString()} 
        data={match} 
        onClickToOpen={this.onClickToOpen} 
        />
    });

		return (
			<div className="result-div">
        <div className="header-result-div">
          <div className="user-repo-div">
            <a className="repository-link" href={data.repositoryUrl}>
              {data.repositoryOwnerUser}/{data.repositoryName} 
            </a>
            <span className="branch-span"> (master-{data.commit.substr(0, 7)})</span>
          </div>
          <div className="path-file-div">
            <span className="path-file-span" onClick={this.onClickToOpen}>
              {data.filePath}
            </span>
            {privateSpan !== null ? <span>&nbsp;[{privateSpan}]</span> : <span />}
          </div>
          <div className="github-link-div">
            <a className="github-file-link" href={data.fileByCommitUrl}>
              GITHUB
            </a>
          </div>
        </div>

        <div className="num-appearances-div">{data.totalAppearances} appearances</div>

        <div className="fragments-container-div">
          {codeFragments}
        </div>
			</div>
		);
	}
}

export default RResultDiv;
