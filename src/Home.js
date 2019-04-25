import React, { Component } from 'react';
import './App.css';
import fire from './fire.js';

class Home extends Component {

	constructor(props) {
    super(props);

    //set up the states
    this.state = {
      paragraph: null, 
      skillsList: null
    };
  }

  componentDidMount(){
    let self = this;
    fire.database().ref('/frontPage').on('value', function(snapshot) {
      self.setState({
        paragraph: snapshot.val().paragraph, 
        skillsList: snapshot.val().skillsList
      });
    });
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
              <p>{this.state.paragraph}</p>
              <h2 className="inline">Some key skills: </h2>
              <p className="small-list inline">{this.state.skillsList}</p>
            </div>
          </div>
        </div>
      </div>
    );

  }
}

export default Home;
