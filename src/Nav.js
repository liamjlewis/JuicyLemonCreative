import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

class Nav extends Component {

  constructor(props) {
    super(props);
    
    this.showMobMenu = this.showMobMenu.bind(this);

    this.state = {winWidth: 0, mobMenuVisible: false};

  }

  componentWillReceiveProps(nextProps){
    this.setState({winWidth: nextProps.winWidth});
  }

  showMobMenu(command){
    if(command === 'open'){
      this.setState({mobMenuVisible: true});
    }else{
      this.setState({mobMenuVisible: false});
    }
  }

  render() {

    return (
      <nav>
      {this.state.winWidth > 768 ?
        <div className="container">
          <div className="row">
            <ul className="col-lg-12">
              <a href="/assets/liam-lewis-cv.pdf" target="_blank" download><li>download CV</li></a>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/work-list">Work History</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/"><img src="/assets/images/lemon-mini.png" alt="Logo" /></Link></li>
            </ul>
          </div>
        </div>
      :
        <div>
          <div className="burger-btn" onClick={() => this.showMobMenu('open')}>&#9776;</div>
          {this.state.mobMenuVisible &&
            <div className="mob-nav-house">
              <span className="mob-nav-close" onClick={this.showMobMenu}>X</span>
               <ul className="col-lg-12">
                <li onClick={this.showMobMenu}><Link to="/"><img src="/assets/images/lemon-mini.png" alt="Logo" /></Link></li>
                <li onClick={this.showMobMenu}><Link to="/portfolio">Portfolio</Link></li>
                <li onClick={this.showMobMenu}><Link to="/work-list">Work History</Link></li>
                <li onClick={this.showMobMenu}><Link to="/contact">Contact</Link></li>
                <a onClick={this.showMobMenu} href="/assets/liam-lewis-cv.pdf" target="_blank" download><li>download CV</li></a>
              </ul>
            </div>
          }
        </div>
      }
      </nav>
    );

  }
}

export default Nav;