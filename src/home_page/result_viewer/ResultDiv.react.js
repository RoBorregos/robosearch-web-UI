import React, { Component } from 'react';

import RCodeFragment from 'home_page/result_viewer/code_fragment/CodeFragment.react.js'

import style from 'home_page/result_viewer/ResultDiv.module.css';

class RResultDiv extends Component {
  /**
   * @param {!{data: !ResultStruct, onClickToOpen: !function(!string, !string, !string):undefined}} props
   */
	constructor(props) {
    super(props);
    this.onClickToOpen = this.onClickToOpen.bind(this);
  }

  onClickToOpen() {
    this.props.onClickToOpen(
      this.props.data.repositoryOwnerUser,
      this.props.data.repositoryName,
      this.props.data.filePath,
    );
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
			<div className={style.parentDiv}>
        <div className={style.resultHeader}>
          <div className={style.userRepo}>
            <a className={style.repositoryLink} href={data.repositoryUrl}>
              {data.repositoryOwnerUser}/{data.repositoryName} 
            </a>
            <span className={style.branchSpan}> (master-{data.commit.substr(0, 7)})</span>
          </div>
          <div className={style.pathFileDiv}>
            <span className={style.pathFileSpan} onClick={this.onClickToOpen}>
              {data.filePath}
            </span>
            {privateSpan !== null ? <span>&nbsp;[{privateSpan}]</span> : <span />}
          </div>
          <div className={style.githubLinkDiv}>
            <a className={style.githubFileLink} href={data.fileByCommitUrl}>
              GITHUB
            </a>
          </div>
        </div>

        <div className={style.numAppearances}>{data.totalAppearances} appearances</div>

        <div className={style.fragments}>
          {codeFragments}
        </div>
			</div>
		);
	}
}

export default RResultDiv;
