import React, { Component } from 'react';

import RAllSecrets from 'home_page/secret_view/AllSecrets.react.js';

import style from 'home_page/secret_view/SecretView.module.css';

class RSecretView extends Component {
  /**
   * @param {!{searchParams: !URLSearchParams}} props
   */
  constructor(props) {
    super(props);

    this.state = {idUsuario: ""};
  }

  handleTyping = (event) => {
    this.setState({idUsuario: event.target.value});
  }

  onClickCheckUser = () => {
    if (this.state.idUsuario.length === 0) {
      return;
    }

    fetch(
      `https://secret-depths-42003.herokuapp.com/api/class/users/check-admin/${this.state.idUsuario}`,
    ).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    }).then(json => {
      console.log("An admin=" + json.admin);
      if (json.admin) {
        const d = new Date();
        d.setTime(d.getTime() + (1*60*1000));
        const expires = "expires="+ d.toUTCString();
        document.cookie = "key=value;" + expires;
      }
      this.forceUpdate();
    }).catch((error) => {
      console.error('There has been a error:', error);
    });
  }

  render() {
    if (!document.cookie) {
      return (
        <div className={style.permissionDiv}>
          <div>It seems you don't have permission</div>
          <input
            type="text" 
            value={this.state.idUsuario} 
            onChange={this.handleTyping}
          />
          <input 
            type="button" 
            value="Check user"
            onClick={this.onClickCheckUser}
          />
        </div>
      );
    } else {
      return <RAllSecrets searchParams={this.props.searchParams} />;
    }
  }
}

export default RSecretView;
