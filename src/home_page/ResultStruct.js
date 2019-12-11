class ResultStruct {
  constructor() {
    this.fileName = "";
    this.filePath = "";
    // .html_url    (same as this.fileByMasterUrl but uses commit instead of branch)
    this.fileByCommitUrl = "";
    // https://github.com/{.repository.fullname}/blob/{branch}/{.path}
    this.fileByMasterUrl = "";

    // I dont see an easy way. Only getting it from this.apiByMasterUrl
    // as the ref (and only param) of .url
    // Or maybe going to the branches_url and see if there is only one "protected" branch
    // that might be the only one that github searchs on.
    // --------------> default_branch ==== .repository.url api -> .default_branch   or
    // --------------> default_branch ==== .repository.contents_url api -> .url (ref param)
    this.branch = "";
    // I don't see a easy way to obtain it, only the ref (and only param) of .url
    this.commit = "";

    // .url
    this.apiByCommitUrl = "";
    // .repository.contents_url{+path} = .path
    // With this, grabs the default branch
    this.apiByMasterUrl = "";

    // this.content = api->.download_url [a website .txt]   or   api->.content|.encoding(base64)

    this.repositoryName = "";
    this.repositoryUrl = "";
    this.repositoryDescription = "";
    this.repositoryIsPrivate = false;
    this.repositoryIsFork = false;
    // TODO: Look for how to get this.
    this.repositoryOwnerName = "";
    this.repositoryOwnerUser = "";
    this.repositoryOwnerUrl = "";

    // The individual appearances, this means, how many `MatchStruct`s.
    this.totalAppearances = 0;
    // Of type [`GroupMatchesStruct`].
    this.groupsMatches = [];
  }
}

class GroupMatchesStruct {
  constructor() {
    // The whole fragment of text that this group of results are in.
    // TODO: Make this more githubapi-agnostic, making this null and
    // MatchStruct::text nullable.
    this.fragment = "";
    // Of type [`MatchStruct`].
    this.matches = [];
  }
}

class MatchStruct {
  constructor() {
    // The matched text. It seems that is always a "searched-token"...
    this.text = "";

    // Of type `SpanStruct`.
    this.fragmentSpan = null;
    this.fileSpan = null;
  }
}

class SpanStruct {
  constructor() {
    // The absolute index of the span, since the begining.
    // 0-based.
    // Start: includes, end: excludes.
    this.absolute = false;
    this.startAbs = 0;
    this.endAbs = 0;

    // Line is 1-based and columnOffset is 0-based.
    // Start: includes, end: excludes.
    this.lineColumn = false;
    this.startLine = 0;
    this.startColumnOffset = 0;
    this.endLine = 0;
    this.endColumnOffset = 0;
  }
}

export {ResultStruct, GroupMatchesStruct, MatchStruct, SpanStruct};