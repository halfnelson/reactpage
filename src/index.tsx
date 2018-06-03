import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
const images = require('./*.svg');

const App = () => (
  <div className="App">
    <img className="App-logo" src={images.logo} alt="React" />
    <h1 className="App-Title">Hello Parcel xx React x TypeScript</h1>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));

//Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}

