import React, { Component } from 'react';

import RBottomPanel from 'home_page/file_viewer/bottom_panel/BottomPanel.react.js';
import RLeftPanel from 'home_page/file_viewer/left_panel/LeftPanel.react.js';
import RCodeViewer from 'home_page/file_viewer/code_viewer/CodeViewer.react.js';

import style from 'home_page/file_viewer/FileViewer.module.css';

class RFileViewer extends Component {
  /** 
   * @param {!{searchParams: !URLSearchParams}} props 
   */
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={style.parentDiv}>
        <div className={style.leftPanel}><RLeftPanel /></div>

        <div className={style.centralParentPanel}>
          <div className={style.centralTopPanel}>
            <RCodeViewer defaultSearchParams={this.props.searchParams} />
          </div>
          <div className={style.centralBottomPanel}>
            <RBottomPanel />
          </div>
        </div>
      </div>
    );
  }
}

export default RFileViewer;
