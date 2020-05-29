import React, { Component } from 'react';

import RSearchBox from 'home_page/top_bar/search_box/SearchBox.react.js'

import style from 'home_page/top_bar/TopBar.module.css';

import roborregos_logo from 'home_page/top_bar/assets/roborregos_logo.png'
import roborregos_name from 'home_page/top_bar/assets/roborregos_name.png'
import github_logo from 'home_page/top_bar/assets/github_logo.png'

class RTopBar extends Component {
  /**
   * @param {!{defaultQuery: !string, defaultOnlyRoboRepos: !boolean, defaultUseExpSearch: !boolean}} props
   */
  constructor(props) {
    super(props);
    this.onChangeOnlyRoboRepos = this.onChangeOnlyRoboRepos.bind(this);
    this.onChangeUseExpSearch = this.onChangeUseExpSearch.bind(this);
    this.onQueryInSearch = this.onQueryInSearch.bind(this);

    this.state = {
      enableExpSearchSwitch: props.defaultOnlyRoboRepos, 
      onlyRoboRepos: props.defaultOnlyRoboRepos,
      useExpSearch: props.defaultUseExpSearch && props.defaultOnlyRoboRepos,
      // To avoid problems with react knowing if the object window.location changed,
      // init once this data.
      // TODO: Check if there is a safer way to do this.
      pageUrl: window.location.origin + window.location.pathname,
    };
  }

  onChangeOnlyRoboRepos() {
    const nextOnlyRoboRepos = !this.state.onlyRoboRepos;
    this.setState({
      onlyRoboRepos: nextOnlyRoboRepos,
      useExpSearch: nextOnlyRoboRepos ? this.state.useExpSearch : false,
      enableExpSearchSwitch: nextOnlyRoboRepos,
    });
  }

  onChangeUseExpSearch() {
    this.setState({useExpSearch: !this.state.useExpSearch});
  }

  /**
   * @param {!string} query 
   */
  onQueryInSearch(query) {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("q", query);
    url.searchParams.set("robo", this.state.onlyRoboRepos);
    url.searchParams.set("exp", this.state.useExpSearch);
    console.log("Going for query at:" + url.toString());

    window.location.href = url.toString();
  }

  onClickSecrets() {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("secrets", true);
    console.log("Going for secrets at:" + url.toString());

    window.location.href = url.toString();
  }

  render() {
    return (
      <div className={style.parentDiv}>
        <div className={style.nameDiv}>
          <a href={this.state.pageUrl} className={style.nameUrl}>
            <img src={roborregos_logo} className={style.imgLogo} alt="roborregos logo" />
            <span className={style.titleName}>RoBoSearch</span>
            <span className={style.titleBeta}>beta</span>
          </a>
        </div>

        <div className={style.inputsDiv}>
          <RSearchBox defaultQuery={this.props.defaultQuery} onQuery={this.onQueryInSearch} />

          <div className={style.switchsDiv}>
            <input 
              name="onlyRoboRepos" 
              type="checkbox" 
              onChange={this.onChangeOnlyRoboRepos} 
              checked={this.state.onlyRoboRepos}
            /> 
            Only RoBorregos Repos
            <input 
              name="useExpSearch"
              onChange={this.onChangeUseExpSearch}
              type="checkbox" 
              disabled={!this.state.enableExpSearchSwitch}
              checked={this.state.useExpSearch}
            /> 
            Use Experimental Search
          </div>

          <div className={style.switchsDiv}>
            <input 
              type="button" 
              value="Check secrets" 
              name="secretFiles"
              onClick={this.onClickSecrets}
            />
          </div>
        </div>

        <div className={style.byDiv}>
          <a href="https://roborregos.com"> 
            <img src={roborregos_name} className={style.imgName} alt="roborregos name" />
          </a>
          <span className={style.verticalLine}>|</span>
          <a href="https://github.com/RoBorregos"> 
            <img src={github_logo} className={style.githubImg} alt="roborregos github" />
          </a>
        </div>
      </div>
    );
  }
}

export default RTopBar;
