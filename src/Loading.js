import React, { Component } from 'react';
import './App.css';

class Loading extends Component {

  render() {

    return (
      <div className="loading">
			  <img src="/assets/images/lemonload150.gif" width="75" alt="loading animation" />
			  <p>One Mo'...</p>
			</div>
    );

  }
}

export default Loading;
