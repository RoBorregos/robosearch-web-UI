import {ResultStruct, GroupMatchesStruct, MatchStruct, SpanStruct} from 'home_page/ResultStruct.js'

/**
 * 
 * @param {!string} stringQuery 
 * @param {!boolean} onlyRoBo
 * @param {function({results: !Array<ResultStruct>, error: ?string, rateLimit: !boolean}):undefined} callback 
 */
function requestResults(stringQuery, onlyRoBo, callback) {
  const xhttp = new XMLHttpRequest();
  xhttp.responseType = "json";

  xhttp.onreadystatechange = function() {
    if (this.readyState === this.DONE) {
      const toReturn = {results: [], error: null, rateLimit: false};
      console.log("json response:");
      console.log(this.response);
      switch (this.status) {
        case 200: {
          toReturn.results = formatResults(this.response);
          break;
        }

        case 401: // Unauthorized / bad credentials
        case 403: // Forbidden / several bad credentials / abuse rate limits (rate-limit)
        case 400: // Bad request / bad input
        case 422: // invalid input
        {
          // Let's check if a rate-limit error.
          if (parseInt(this.getResponseHeader("x-ratelimit-remaining")) === 0) {
            toReturn.rateLimit = true;
            console.log("Rate limit error; total=" + this.getResponseHeader("x-ratelimit-limit"));
          }
        }
        // falls through

        default: {
          if (this.status >= 300 && this.status < 400) {
            // Even that the redirects are okay: https://developer.github.com/v3/#http-redirects
            // they should be done automatically: https://stackoverflow.com/questions/228225/prevent-redirection-of-xmlhttprequest
            console.warn("Redirection failed. Tell the developer.");
          }
          // {message, ?documentation_url, ?errors}
          console.warn("Error in request: " + this.response.message);
          toReturn.error = this.response.message;
        }
      }
      console.log("headers:");
      console.log(this.getAllResponseHeaders());
      callback(toReturn);
    }
  };

  // TODO: Maybe check if use POST instead, using a FormData object.
  const url = new URL("https://api.github.com/search/code");
  url.searchParams.set("q", stringQuery + (onlyRoBo ? "+org:roborregos" : ""));
  url.searchParams.set("per_page", "15");
  xhttp.open("GET", url.toString(), true);
  xhttp.setRequestHeader("Accept", "application/vnd.github.v3.text-match+json");
  xhttp.send();
}

/**
 * Test if is a valid query.
 * Specifically, check the query to be smaller than 256 - "+org:roborregos".length 
 * and have less than 5 logical operands.
 * 
 * https://developer.github.com/v3/search/#limitations-on-query-length
 * 
 * @param {!string} query
 * @return {!boolean} 
 */
function checkQuery(query) {
  return query.length <= 256 - "+org:roborregos".length &&
    query.split(/\s+/g).filter(e => ["AND", "OR", "NOT"].includes(e)).length 
      <= 5;
}

/**
 * 
 * @param {!string} jsonResult 
 * @returns {!Array<ResultStruct>}
 */
function formatResults(jsonResult) {
  const results = [];
  for (const file of jsonResult.items) {
    const resultStruct = new ResultStruct();
    
    resultStruct.fileName = file.name;
    resultStruct.filePath = file.path;
    resultStruct.fileByCommitUrl = file.html_url;
    // resultStruct.fileByMasterUrl = ?

    // this.branch = ?
    resultStruct.commit = new URL(file.url).searchParams.get("ref");

    resultStruct.apiByCommitUrl = file.url;
    resultStruct.apiByMasterUrl = file.repository.contents_url.replace("{+path}", file.path);


    resultStruct.repositoryName = file.repository.name;
    resultStruct.repositoryUrl = file.repository.html_url;
    // The description can be not set, and github api says then `null`.
    resultStruct.repositoryDescription = file.repository.description || "";
    resultStruct.repositoryIsFork = file.repository.fork;
    resultStruct.repositoryIsPrivate = file.repository.private;

    resultStruct.repositoryOwnerUser = file.repository.owner.login;
    resultStruct.repositoryOwnerUrl = file.repository.owner.html_url;


    for (const text_match of file.text_matches) {
      const groupMatch = new GroupMatchesStruct();

      groupMatch.fragment = text_match.fragment;

      for (const match of text_match.matches) {
        const matchStruct = new MatchStruct();

        matchStruct.text = match.text;
        // The response is 0-based, start=inclusive, end=exclusive.
        matchStruct.fragmentSpan = new SpanStruct();
        matchStruct.fragmentSpan.absolute = true;
        matchStruct.fragmentSpan.startAbs = match.indices[0];
        matchStruct.fragmentSpan.endAbs = match.indices[1];

        groupMatch.matches.push(matchStruct);
        
        resultStruct.totalAppearances++;
      }

      resultStruct.groupsMatches.push(groupMatch);
    }

    results.push(resultStruct);
  }

  return results;
}

export {requestResults, checkQuery};
