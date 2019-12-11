/**
 * File that contains some utils to, from the URL's params, render the
 * correct content.
 */

/**
 * An Enum (Object of strings) to be use like that contains the destinations
 * of redirections.
 */
const Destinations = {
  HOME: "home",
  RESULTS: "results",
  FILE_VIEWER: "file_viewer",
};

/**
 * @param {!URLSearchParams} params
 * @return {!string} A value of `Destinations`.
 */
function getDestinationFromURLParams(params) {
  const keys = [...params.keys()];

  if (['file_url', 'file', 'repo', 'owner'].every(v => keys.includes(v))) {
    return Destinations.FILE_VIEWER;
  } else if (['q'].every(v => keys.includes(v))) {
    return Destinations.RESULTS;
  } else {
    return Destinations.HOME;
  }
}

export {Destinations, getDestinationFromURLParams};
