import React, { Component } from 'react';
import './App.css';

class Contact extends Component {

	constructor(props) {
    super(props);

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    //set up the states
    this.state = {
      email: '', 
      subject: '',
      message: ''
    };
  }

  handleUserInput(e) {
    const name = e.target.name;
    const val = e.target.value;
    this.setState({[name]: val});
  }

  handleSubmit(e) {

    //AJAX stuff
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/assets/mailform.php', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {//Call a function when the state changes.
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        (xhr.responseText === 'received') && (document.getElementById('formFeedback').style.display = "inline-block");
      }
    }
    xhr.send(
      "theiremail=" + this.state.email + 
      "&subject=" + this.state.subject + 
      "&message=" + this.state.message);

    //reset states
    this.setState({email: '', subject: '', message: ''});

    e.preventDefault();
  }

  render() {

    return (
      <div className="container center-text mid-height">
        <div className="row">
          <h1>Contact</h1>
          <p>Phone: <a href="tel:+447809628057">+44780 962 8057</a></p>
          <p>Email: <a href="mailto:liamjlewis@gmail.com">liamjlewis@gmail.com</a></p>
          <hr />
        </div>
        <div className="row">
          <span id="formFeedback" style={{color: "green", padding: "1rem 0", display: "none", width: "100%"}}>Sent</span>
          <form className="contact-form" onSubmit={this.handleSubmit}>
            <div className="col-md-offset-4 col-md-4 col-sm-offset-3 col-sm-6 col-xs-12">
              <label style={{display: 'none'}} htmlFor="email">Email address</label>
              <input type="email" required name="email"
                placeholder="Your email"
                value={this.state.email}
                onChange={this.handleUserInput}  />
            </div>
            <div className="col-md-offset-4 col-md-4 col-sm-offset-3 col-sm-6 col-xs-12">
              <label style={{display: 'none'}} htmlFor="subject">Subject</label>
              <input type="subject" name="subject"
                placeholder="Subject"
                value={this.state.subject}
                onChange={this.handleUserInput}  />
            </div>
            <div className="col-md-offset-4 col-md-4 col-sm-offset-3 col-sm-6 col-xs-12">
              <label style={{display: 'none'}} htmlFor="message">Message</label>
              <textarea type="textarea" required name="message"
                placeholder="Message"
                value={this.state.message}
                onChange={this.handleUserInput} rows="4" /><br />
              <button type="submit" className="btn btn-primary send-btn" disabled={(this.state.email === '' && this.state.message === '')}>SEND</button>
            </div>
          </form>
        </div>
      </div>
    );

  }
}

export default Contact;
