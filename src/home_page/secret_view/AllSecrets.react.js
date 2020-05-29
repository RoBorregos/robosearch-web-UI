import React, { Component } from 'react';

import style from 'home_page/secret_view/SecretView.module.css';

class RAllSecrets extends Component {
  /**
   * @param {!{searchParams: !URLSearchParams}} props
   */
  constructor(props) {
    super(props);

    this.state = {codes: []};
  }

  onClickOnCode = (idCode) => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("secrets", true);
    url.searchParams.set("secret_id", idCode);
    console.log("Going for secret at:" + url.toString());

    window.location.href = url.toString();
  }

  componentDidMount() {
    fetch(
      `https://secret-depths-42003.herokuapp.com/api/class/get-all-code/`,
    ).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    }).then(json => {
      console.log("Codes arrived");
      console.log(json);
      this.setState({codes: json});
    }).catch((error) => {
      console.error('There has been a error:', error);
    });
  }

  render() {
    if (this.props.searchParams.has("secret_id")) {
      return <div>allsecrets</div>;
    }

    return (
      <div className={style.permissionDiv}>
        {this.state.codes.map(((c, i) => (
          <div key={i.toString()} onClick={() => this.onClickOnCode(c.id)}>
            {c.id} ; {c.filename}
          </div>
        )))}
      </div>
    )
  }
}

export default RAllSecrets;
