import React, { Component } from 'react';

import RSearchBox from './search_box/SearchBox.react.js'

import './TopBar.css';

import roborregos_logo from './assets/roborregos_logo.png'
import roborregos_name from './assets/roborregos_name.png'
import github_logo from './assets/github_logo.png'

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

  render() {
    return (
      <div className={"top-bar-div"}>
        <div className={"name-div"}>
          <a href={this.state.pageUrl}>
            <img src={roborregos_logo} className={"img-logo"} alt="roborregos logo" />
            <span className={"title-name"}>RoBoSearch</span>
            <span className={"title-beta"}>beta</span>
          </a>
        </div>

        <div className={"search-switch-div"}>
          <RSearchBox defaultQuery={this.props.defaultQuery} onQuery={this.onQueryInSearch} />

          <div className={"switchs-div"}>
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
        </div>

        <div className={"by-div"}>
          <a href="https://roborregos.com"> 
            <img src={roborregos_name} className={"img-name"} alt="roborregos name" />
          </a>
          <span className={"vertical-line"}>|</span>
          <a href="https://github.com/RoBorregos"> 
            <img src={github_logo} className={"github-img"} alt="roborregos github" />
          </a>
        </div>
      </div>
    );
  }
}

export default RTopBar;
