import React, { Component } from 'react';
import './App.css';

class Footer extends Component {

  render() {
  	let dt = new Date(),
  	theYear = dt.getFullYear();
    return (
      <footer>© Copyright Liam Lewis {theYear}</footer>
    );

  }
}

export default Footer;