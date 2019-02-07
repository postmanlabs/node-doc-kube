import React, { Component } from 'react';
import '../css/App.css';

class App extends Component {

  state = {
    value: "", 
    validUrl: true,
    encodedUrlReady: false,
    encodedUrl: ""
  }

  host = window.location.hostname;

  handleChange = (event) => {
    this.setState({
      value: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    let data = {
      originalUrl: this.refs['new-url'].value
    };

    fetch('http://' + this.host + ':5500/encode', {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log(response);
      if (response.ok) {
        response.json().then(json => {
          if (json === "Try again") {
            this.setState({
              validUrl: false
            });
          } else {
            this.setState({
              encodedUrlReady: true,
              encodedUrl: `https://${json}`
            })
          }
        });
      }
    })

    // this.props.onSubmit(data);
    // this.refs['new-url'].reset();
  }

  render() {
    return (
      <div className="App">

        <div className="nav">
          <a href="/" className="nav-brand">catURL</a>
        </div>

        <a href="https://github.com/loopDelicious/cat-kube">
          <img className="snipe" src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png" />
        </a>

        <div className="guts">

          <div className="message-contents">
            <form id="encoder" onSubmit={this.handleSubmit}>
              <div className="submit-encoder">
                <h3>enter an original url to create a custom cat url: </h3>
                <input type="text" id="notes" className="encode-text" ref="new-url" value={this.state.value} placeholder="http://www.google.com" onChange={this.handleChange} autoFocus />
                <input type="submit" className="btn submit-btn" value="cattify" />
              </div>
            </form>
          </div>

          {!this.state.validUrl ?
            <div className="error-message">
              <h3>Please enter a valid URL.</h3>
            </div>
            : null } 

          {this.state.encodedUrlReady ?
            <div className="display-contents">
              <div className='display-intro'>
                  <h3>is now: </h3>
              </div>
              <div className="display">
                  <input type="text" className="new-url" value={this.state.encodedUrl} readOnly />
                  <input type="button" className="btn copy-btn" value="copy" data-clipboard-action="copy" data-clipboard-target=".new-url" />
              </div>
            </div>
            : null }

          <div id="attribution">created by: <a href='http://www.github.com/loopDelicious'>Joyce Lin</a></div>
          <div className='disclaimer'>
            <span>Intended for entertainment use only. No guarantees made. No one endorses anything contained in the URLs. 
              <p> {"\n"}{"\n"} </p>
              CatURL is not responsible for any content linked through its service. Use at your own risk.  It's a litter bit amazing.
            </span>
          </div>
        
        </div>

      </div>
    );
  }
}

export default App;
