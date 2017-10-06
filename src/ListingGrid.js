import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import './App.css';

class ListingGrid extends Component {

  constructor(props) {
    super(props);

    //this bindings
    this.filterList = this.filterList.bind(this);

    //set up the states
    this.state = {
      displayList: [],
      filterVal: '',
      status: 'Loading'
    };
  }

  componentWillMount(){
    //determine if we're waiting for data or already have it
    this.props.employmentOrPortfolio && this.setState({displayList: this.props.employmentOrPortfolio, status: 'Live'});
  }
  
  componentDidMount(){
    this.props.footerFix();
  }

  componentDidUpdate(){
    this.props.footerFix();
  }

  componentWillReceiveProps(nextProps){
    //When the API promise returns, update our grid, and apply a filter if needed, also works if API data changes live
    if(nextProps.employmentOrPortfolio){
      if(this.state.filterVal){
        this.filterList();
      }else{
        this.setState({displayList: nextProps.employmentOrPortfolio, status: 'Live'});
      }
    }
  }

  filterList(e){//DELETE - this should allow for people entering lists html, css, angular. either that or I only allow one word in the box
    //if there's an event, use it, otherwise get the input value from the state
    let term;
    if(e){
      term = e.target.value;
    }else{
      term = this.state.filterVal;
    }

    //filter out the ones with a matched skill
    let updatedList = this.props.employmentOrPortfolio;
    updatedList = updatedList.filter(function(item){
      //Search the skills array and see if the input value features anywhere
      let result = item.skills.find( (skill) => (skill.toLowerCase().search(term.toLowerCase())!== -1) );
      return result;
    });

    //update the work grid and store the textbox value for use in startListening() 
    this.setState({displayList: updatedList, filterVal: term, status: 'Live'}); //DELETE - IS THERE ANOTHER WAY TO ACCESS THIS WITHOUT HAVING TO SET A STATE?
  }

  render() {
    return (
      <div className="container">
        <h1 className="center-text">{this.props.heading}</h1>
        	<div className="row">
          {this.state.status === 'Loading' 
          ?
            <Loading />
          :
            <div className="skill-search col-sm-offset-3 col-sm-6 col-xs-12">
              <input type="text" placeholder="Search a skill e.g jQuery" onChange={this.filterList} />
            </div>
          }
          </div>
          {this.state.displayList.length === 0 && this.state.filterVal && /*DELETE - THIS SHOWS WHEN THERE ARE NO RESULTS as well as loading*/
            <p className="center-text">No matches found.</p>
          }
					<div className="row">
			        	{
			        		this.state.displayList.map(item => (
			        			<div key={item.urlRef} className="work-history-box col-md-3 col-sm-6 col-xs-6">
									    <Link to={this.props.match.url + '/' + item.urlRef} className="hover">
									      <div className="work-history-box-inner">
									        <img className="company-logo" src={"/assets/" + item.logoURL} alt={item.companyName} />
									        <div className="info-box">
                            {item.timePeriod.map((period, index) => (
  									          <span key={period}>
  								          	 {period}
                               {(index + 1) !== item.timePeriod.length && <span>, </span>}
  									          </span>
                            ))}
									        </div>
									      </div>
									    </Link>
									  </div>
									))
								}
			    </div>
	        
      </div>
    );
  }
}

export default ListingGrid;
