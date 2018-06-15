/// <reference path="cms.d.ts"/>
import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as Cms from "cms";

const { CmsComponentSlot, CmsComponentContextContainer } = Cms;

import { initialContext } from "./initialcontext"

import './calltoaction'
import './testimonial'


const App = () => (
  <CmsComponentContextContainer baseContext={initialContext}>
  <div className="App">
   
      <CmsComponentSlot slotId="dataComponents"/>
      <CmsComponentSlot slotId="main">
        <h3>Layout Goes Here</h3>
      </CmsComponentSlot>
  </div>
  </CmsComponentContextContainer>
);

ReactDOM.render(<App />, document.getElementById('root'));

//Hot Module Replacement
//if (module.hot) {
 // module.hot.accept();
//}

