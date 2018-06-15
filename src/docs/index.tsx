import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CmsComponentContextContainer } from '@/lib/cmscomponentcontext';
import { CmsComponentSlot } from '@/lib/cmscomponentslot';


import { initialContext } from "./initialcontext"

import '@/lib/Datasources/StaticDatasource'
import '@/lib/Datasources/IndexedDatasource'
import './calltoaction'
import './testimonial'
import { test } from '@/test';

test();

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
if (module.hot) {
  module.hot.accept();
}

