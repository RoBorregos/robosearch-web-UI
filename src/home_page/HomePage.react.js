import React, { Component } from 'react';

import RResultViewer from './result_viewer/ResultViewer.react.js';
import RTopBar from './top_bar/TopBar.react';
import RErrorNotice from './error_notice/ErrorNotice.react.js';
import {requestResults, checkQuery} from './RequesterHelper.js';
import {ResultStruct} from './ResultStruct.js';

class RHomePage extends Component {
  /** @param {!{}} props */
  constructor(props) {
    super(props);
    this.onClickResultToOpenFile = this.onClickResultToOpenFile.bind(this);

    const valuesFromURL = 
      this.getValuesFromURL(new URL(window.location.href).searchParams);
    const validQuery = checkQuery(valuesFromURL.query);
    /** @type {!{query: !string, onlyRobo: !boolean, expSearch: !boolean, queryResults: !Array<!ResultStruct>, errorInRequest: ?{error: ?string, rateLimit: !boolean}} */
    this.state = {
      ...valuesFromURL,
      errorInRequest: validQuery ? null : {error: "Invalid query", rateLimit: false},
      queryResults: [],
    };

    if (validQuery) {
      this.getResultsOfSearch(this.state.query);
    }
  }

  /**
   * @param {!string} apiUrlOfFile
   */
  onClickResultToOpenFile(apiUrlOfFile) {
    const url = new URL(window.location.origin + window.location.pathname);
    // url.pathname = "file";
    url.searchParams.set("q", this.state.query);
    url.searchParams.set("robo", this.state.onlyRobo);
    url.searchParams.set("exp", this.state.expSearch);
    url.searchParams.set("file_url", apiUrlOfFile);
    console.log("File at:" + url.toString());

    window.location.href = url.toString();
  }

  render() {
    const bodyContent = this.state.errorInRequest === null ?
      <RResultViewer 
        results={this.state.queryResults} 
        onClickToOpenFile={this.onClickResultToOpenFile}
      /> :
      <RErrorNotice 
        error={this.state.errorInRequest.error} 
        rateLimit={this.state.errorInRequest.rateLimit} 
      />;

    return (
      <div>
        <RTopBar 
          query={this.state.query} 
          onlyRoboRepos={this.state.onlyRobo} 
          useExpSearch={this.state.expSearch} 
        />
        {bodyContent}
      </div>
    );
  }

  getValuesFromURL(urlParams) {
    const query = urlParams.get("q") || "";
    // TODO: Include here selecting the default values.
    const onlyRobo = urlParams.get("robo") !== "false";
    const expSearch = urlParams.get("exp") !== "false";

    const state = {query, onlyRobo, expSearch};
    console.log("Value from URL: ");
    console.log(state);

    return state;
  }

  getResultsOfSearch(query) { 
    if (query.replace(/\s/g, "").length > 0) {
      requestResults(query, this.state.onlyRobo, (resposeObject) => {
        console.log(resposeObject);
        if (resposeObject.error === null) {
          this.setState({
            queryResults: resposeObject.results,
            errorInRequest: null,
          });
        } else {
          this.setState({
            errorInRequest: {
              error: resposeObject.error, 
              rateLimit: resposeObject.rateLimit,
            },
          });
        }
      });
    }
  }
}

export default RHomePage;
