/**
 * File that contains the necessary to make the call to fetch the code and related things
 * of a file via the github api at https://api.github.com/repos
 * 
 * An example to see the returned by the API:
 * https://api.github.com/repos/RoBorregos/RoboCup_RescueMaze_2019/contents/Librerias/MotoresPuentes/MotoresPuentes.h
 */

/**
 * Given the URLSearchParams from the url of the page, validates that contains the necessary
 * params and makes the call to the Github API to fetch the file's data. The callback is called
 * with the results or null if error.
 * 
 * @param {!URLSearchParams} searchParams
 * @param {!function(?{file: !string, repo: !string, owner: !string, branch: !string, code: !string}):undefined} callback
 */
function validateAndRequestCodeWithParams(searchParams, callback) {
  // TODO: Move this checking to a more general place in HomePage.
  const keys = [...searchParams.keys()];
  if (!['file', 'repo', 'owner'].every(v => keys.includes(v))) {
    callback(null);
    return;
  }

  const [file, repo, owner] = [
    searchParams.get('file'),
    searchParams.get('repo'),
    searchParams.get('owner'),
  ];

  let fileAPIURL = [
    "https://api.github.com/repos",
    owner,
    repo,
    "contents",
    file,
  ].join("/");

  // Make the request and get the branch and file's content.
  requestResults(fileAPIURL, result => {
    // TODO: Return the actual error.
    if (result.error !== null) {
      callback(null);
    } else {
      if (result.JSONObject.encoding !== 'base64') {
        callback(null);
        return;
      }
      // TODO: Add a checking here if there is not ref argument.
      let branch = result.JSONObject.url.match(/.+\?ref=(.+)/)[1];
      const code = window.atob(result.JSONObject.content);
      callback({file, repo, owner, branch, code});
    }
  });
}

/**
 * TODO: Unify this with the one at RequestHelper.js
 *
 * @param {!string} urlRequest 
 * @param {function({JSONObject: ?Object, error: ?string, rateLimit: !boolean}):undefined} callback 
 */
function requestResults(urlRequest, callback) {
  const xhttp = new XMLHttpRequest();
  xhttp.responseType = "json";

  xhttp.onreadystatechange = function() {
    if (this.readyState === this.DONE) {
      const toReturn = {JSONObject: null, error: null, rateLimit: false};
      console.log("json response:");
      console.log(this.response);
      switch (this.status) {
        case 200: {
          toReturn.JSONObject = this.response;
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

  xhttp.open("GET", urlRequest, true);
  xhttp.send();
}

export {validateAndRequestCodeWithParams};
