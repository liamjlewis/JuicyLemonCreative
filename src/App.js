import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import windowSize from 'react-window-size';
import fire from './fire.js';
import './App.css';

import Nav from './Nav';
import Home from './Home';
import ListingGrid from './ListingGrid';
import ListItem from './ListItem';
import Contact from './Contact';
import Footer from './Footer';

class App extends Component {

  constructor(props) {
    super(props);

    //this bindings
    this.startListening = this.startListening.bind(this);

    //set up the states
    this.state = {
      employment: [],
      portfolio: [],
      dbRef: fire.database().ref('/'),
      midHeight: {midHeight: 0}
    };
  }

  componentDidMount() {
    this.startListening();
  }

  componentWillUnmount() {
    this.stopListening();
  }

  startListening(){//DELETE - THIS SHOULD BE IN THE APP COMPONENT TO STOP IT BEING CALLED/REDEFINED OVER AND OVER
    //Get the data, fires initially and if the API changes
    let self = this;

    this.state.dbRef.on('value', function(snapshot) {
      self.setState({
        employment: {employmentOrPortfolio: snapshot.val().employment}, 
        portfolio: {employmentOrPortfolio: snapshot.val().portfolio}
      });
    });
  };

  stopListening(){
    //remove the listener, not really needed here but good practice
    this.state.dbRef.off();
  };

  footerFix(){ //keep the footer at the bottom even when there's little content
    var footer = document.querySelectorAll('footer')[0], footerBottom;
    function reset(){
      footer.style.position = 'initial';
      footer.style.top = 'auto';
      footer.style.width = 'auto'
      footerBottom = footer.offsetTop + footer.offsetHeight;
    }
    reset();
    if(footerBottom <= window.innerHeight){
      footer.style.position = 'absolute';
      footer.style.top = (window.innerHeight - footer.offsetHeight)+'px';
      footer.style.width = '100%';
    }else{
      reset();
    }
  }

  render() {
    return (
      <div className="App">

        {/*Components area*/}
          <Router>
            <div>
              <Route path="/" render={props => <Nav {...{winWidth: this.props.windowWidth}} {...props} />} />

              <Route path="/" exact={true} render={props => <Home {...props} />} />
              <Route path="/work-list" exact={true} render={props => <ListingGrid heading="Work History" {...this.state.employment} {...{footerFix: this.footerFix}} {...props} />} />
              <Route path="/portfolio" exact={true} render={props => <ListingGrid heading="Portfolio" {...this.state.portfolio} {...{footerFix: this.footerFix}} {...props} />} />
              <Route path="/portfolio/:urlRef" render={props => <ListItem {...this.state.portfolio} {...{footerFix: this.footerFix, eOrP: 'e'}} {...props} />} />
              <Route path="/work-list/:urlRef" render={props => <ListItem {...this.state.employment} {...{footerFix: this.footerFix, eOrP: 'p'}} {...props} />} />
              <Route path="/contact" exact={true} render={props => <Contact {...props} />} />

              <Route path="/" component={Footer} />
            </div>
          </Router>

      </div>
    );
  }
}

export default windowSize(App);

/*DELETE - Note that this should become generic so I can use it for employmentOrPortfolio and portfolio*/
/*DELETE - Note that I should make it so if you navigate to a work item from here it passes the API listener as a prop and avoids unnecessary calls -OR- make the API call in app.js and then pass the json down as props*/
/*DELETE - Note, go through the site and see if any code is repeated, if so put it in a component*/
/*DELETE - Note, if I type something in that doesn't match a skill and then add it in the API it won't show me until I add or remove a letter and trigger it again. This totally fine, no one's gonna do that.*/
/*DELETE - Note, it seems to stop trying to access the API after a while when the connection is bad.*/
/*DELETE - the window rezizing 'midHeight' code is repeated*/
/*DELETE - If I load full res on the contact, then shrink, then go to home it's a mess */

/*
        Mobile
Working Demos
        Fonts
        Contact
        Home
        Fill in the API data and home content
        link up emails
SEARCHING BY SKILL and going back does not save search
stick a round icon-like picture of me on the homepage
test
Secure DB
make firebase private
masonry
animations
re-instate full homepage
listing page footer when no results and get rid of dates
404
Transitions
*/

/*
DELETE - this is a size matching function, I realised I actually don't need it
DELETE - that setTimeout in ListingGrid aint right. Something to do with all the async activities maybe.
DELETE - http://localhost:3000/#/work-list/whisk <--- if you navigate there from other bottom nav it shows a link to itself
DELETE - list items, bottom nav moves around a lot
DELETE - VM15942 .lp?dframe=t&id=1174419&pw=tTyPu9npKQ&ns=juicylemoncreative:5 [Deprecation] Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check https://xhr.spec.whatwg.org/.


THE BELOW GOES ON THIS PAGE, SENT AS A PROPERTY WHERE NEEDED LIKE SO: {...{matchHeights: this.matchHeights, winWidth: this.props.windowWidth}}
  matchHeights(elementClass){
    let matchThem = document.getElementsByClassName(elementClass);
    let topHeight = 0;
    for(let a in matchThem){
      if( !isNaN(parseInt(a, 10)) ){
        matchThem[a].style.height = 'auto';
        (matchThem[a].offsetHeight > topHeight) && (topHeight = matchThem[a].offsetHeight);
      }
    }
    for(let b in matchThem){
      if( !isNaN(parseInt(b, 10)) ){
        matchThem[b].style.height = topHeight+'px';
      }
    }
  }

AND ON THE LISTING GRID PAGE IN COMPONENTWILLRECIEVEPROPS (NEEDS ONE ON INIT TOO)
  //keep those boxes the same height
  this.props.matchHeights('work-history-box');

*/