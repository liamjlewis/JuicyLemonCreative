import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import './App.css';

class ListItem extends Component {

	constructor(props) {    
    super(props);

    this.getItemFromUrlRef = this.getItemFromUrlRef.bind(this);

    //set up the states
    this.state = {
      nextItem: '',
      prevItem: '',
      status: 'Loading'
    };
	}

	componentWillMount(){
		//If no props have been provided set placeholeder, otherwise extract the item in question
		if(this.props.employmentOrPortfolio === undefined){
			this.setState({thisItem: {"companyName":"","description":null,"logoURL":null,"relatedItems":[{"name":"", "urlRef":""}],"siteURL":null,"skills":[""],"timePeriod":[""],"urlRef":null}});
		}else{
			this.getItemFromUrlRef(this.props.employmentOrPortfolio, this.props.match.params.urlRef);
		}
	}

  componentWillReceiveProps(nextProps){
  	window.z = nextProps;
  	if(nextProps.employmentOrPortfolio){
	  	//If this page is navigated to directly, here we wait for the API promise
	  	this.getItemFromUrlRef(nextProps.employmentOrPortfolio, nextProps.match.params.urlRef);
	  }
  }

  componentDidMount(){
    this.props.footerFix();
  }

  componentDidUpdate(){
		this.props.footerFix();
  }

  getItemFromUrlRef(bigArray, urlRef){
  	let index;

  	function findThisItem(x, i){
  		index = i;
			return x.urlRef === urlRef;
		}

  	this.setState({thisItem: bigArray.find(findThisItem.bind(this)), status: 'Live'});
  	
  	//set the PrevItem and nextItem
		if(index !== 0){
			this.setState({prevItem: {
				name: bigArray[(index-1)].companyName,
				urlRef: bigArray[(index-1)].urlRef}
			});
		}else{
			this.setState({prevItem: ''});
		}
  	if((index+1) < bigArray.length){
			this.setState({nextItem: {
				name: bigArray[(index+1)].companyName,
				urlRef: bigArray[(index+1)].urlRef}
			});
		}else{
			this.setState({nextItem: ''});
		}
  	//fallback for bad URLs or errors DELETE - this should be done differently or go to a 404
  	//this.state.thisItem === undefined && this.setState({thisItem: {"companyName":"Nothing found, apologies","description":null,"logoURL":null,"relatedItems":[""],"siteURL":null,"skills":[""],"timePeriod":[""],"urlRef":null}});
  }

  render() {

    return (
			<div className="container">
			  <div className="list-item-wrap">
			    <Link to={this.props.match.url.replace('/'+this.props.match.params.urlRef, '')} style={{cursor: 'pointer'}}>&lt;Back</Link>
			    {this.state.status === 'Loading' 
          ?
            <Loading />
          :
				    <div className="row">
				      <div className="col-sm-4 col-sm-push-8 col-xs-12 list-item-big-img">
				        <img style={{maxWidth: '100%'}} src={'/assets/' + this.state.thisItem.logoURL} alt={'The logo of ' + this.state.thisItem.companyName} />
				        {(this.state.thisItem.siteURL !== '') && 
	      	        <div className="link-area">
	      		        <h2>Link: </h2>
	      		        <p className="small-list">
	      		        	<a href={this.state.thisItem.siteURL} target="_blank">
	      		        		{(this.state.thisItem.siteURL.charAt(0) !== '/') 
	      		        		? this.state.thisItem.siteURL.replace('http://www.', '')
	      		        																	.replace('https://www.', '')
      		        																		.replace('https://', '')
      		        																		.replace('.com/', '.com')
      		        																		.replace('.co.uk/','.co.uk') 
	      		        		: 'Click here'}
      		        		</a>
	      		        </p>
	      		    	</div>
				      	}
				      </div>
				      <div className="col-sm-8 col-sm-pull-4 col-xs-12">
				        <h1 className="list-item-h1"><span>{this.state.thisItem.companyName}</span>
				        	<small>
				            	{this.state.thisItem.timePeriod.map((dates, i) => (
					              <span key={dates+i}>
					          		  {dates + (( (i+1) !== this.state.thisItem.timePeriod.length ) ? ', ' :  ' ') /*show the comma if not last*/ }
					              </span>
											))}
				        	</small>
				        </h1>
				        <div dangerouslySetInnerHTML={ {__html: this.state.thisItem.description} } />
				        {this.state.thisItem.skills[0] !== '' &&
					        <div>
						        <h2>Skills:</h2>
						        <p className="small-list">
						    	    {this.state.thisItem.skills.map((skills, i) => (
						            <span key={skills+i}>
						        		  {skills + (( (i+1) !== this.state.thisItem.skills.length ) ? ', ' :  ' ') /*show the comma if not last*/ }
						            </span>
											))}
						    		</p>
						    	</div>
						    }
					    	{this.state.thisItem.relatedItems[0].name !== '' && 1 === 0 && //deactivated for now with '1 === 0'
					    		<div>
							    	<h2>Related {(this.props.eOrP === 'e') ? 'employment' : 'portfolio'} item:</h2>
							        <p className="small-list">
							    	    {this.state.thisItem.relatedItems.map((portfolio, i) => (
							            <span key={portfolio+i}>
								            <Link to={ ((this.props.eOrP === 'e') ? '/work-list/' : '/portfolio/') + portfolio.urlRef }>
								        		  {portfolio.name + (( (i+1) !== this.state.thisItem.relatedItems.length ) ? ', ' :  ' ') /*show the comma if not last*/ }
								        		</Link>
							            </span>
												))}
							    	</p>
						    	</div>
						    }
				      </div>
				    </div>
			    }
			    <div className="row">
			      <div className="col-lg-12 bottom-nav">
			        <p>
			        	{this.state.prevItem.urlRef  &&
				        	<Link to={this.props.match.url.replace(this.props.match.params.urlRef, '') + this.state.prevItem.urlRef} className="red">
				        		&lt; {this.state.prevItem.name}
				        	</Link>
				        }
				        {this.state.prevItem.urlRef && this.state.nextItem.urlRef  &&
				        	<span> | </span>
				        }
				        {this.state.nextItem.urlRef &&
				        	<Link to={this.props.match.url.replace(this.props.match.params.urlRef, '') + this.state.nextItem.urlRef} className="red">{this.state.nextItem.name} &gt;</Link>
				        }
			        </p>
			      </div>
			    </div>
			  </div>
			</div>
    );

  }
}

export default ListItem;