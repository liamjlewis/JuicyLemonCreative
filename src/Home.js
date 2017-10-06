import React, { Component } from 'react';
import './App.css';

class Home extends Component {

	constructor(props) {
    super(props);

    //set up the states
    this.state = {};
  }

  componentDidMount(){
    this.fixFlex();
  }

  componentDidUpdate(){
    this.fixFlex();
  }

  fixFlex(){
    var wrap = document.querySelectorAll('.component-top')[0];
    var nav = document.querySelectorAll('nav')[0];
    var footer = document.querySelectorAll('footer')[0];
    var midArea = window.innerHeight - nav.clientHeight - footer.clientHeight;
    
    function reset(){
      wrap.style.height = 'auto'
    }
    
    reset();
    
    if(wrap.clientHeight <= midArea){
      wrap.style.height = midArea+'px';
    }else{
      reset();
    }
  }

  render() {

    return (
      <div className="container component-top">
        <div className="row height100">
          <div className="col-sm-5 flex-center-inner mid-height">
            <img className="big-logo-home" alt="Giant Juicy Lemon" src="/assets/images/big-logo-home.png" onLoad={this.fixFlex} />
          </div>
          <div className="col-sm-7 flex-center-inner home-blurb mid-height">
            <div>
              <p>Juicy Lemon Creative is the portfolio of me, Liam Lewis. I'm a Front-End Web Developer with 5+ years professional experience working in varied environments including creative agency, corporate and freelance. I work as a contractor, usually in eCommerce, mainly using using React, AngularJS and WordPress (amongst others).
              </p>
              <h2 className="inline">Some key skills: </h2>
              <p className="small-list inline">
                HTML5, CSS3, JavaScript ES6, jQuery, ReactJS, NodeJS, AngularJS, WordPress, Bootstrap, AJAX, PHP, MySQL, SASS/LESS, Git, SVN, web and graphic design, cross-device & browser compatibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  }
}

export default Home;
