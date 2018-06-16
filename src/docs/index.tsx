/// <reference path="index.d.ts"/>
/// <reference path="../../dist/lib/cms.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as Cms from "cms";

const { CmsComponentSlot, CmsComponentContextContainer } = Cms;

import './mycomponents/calltoaction'
import './mycomponents/testimonial'



async function main() {
    var fetchResult = await fetch("./home.json")
    var initialContext = await fetchResult.json();
    const App = () => (
      <CmsComponentContextContainer baseContext={ initialContext }>
      <div className="App">
      
          <CmsComponentSlot slotId="dataComponents"/>
          <CmsComponentSlot slotId="main">
            <h3>Layout Goes Here</h3>
          </CmsComponentSlot>
      </div>
      </CmsComponentContextContainer>
    );

    console.log(JSON.stringify(initialContext,null,4))
    ReactDOM.render(<App />, document.getElementById('root'));
}
console.log('loading')
main()
//Hot Module Replacement
//if (module.hot) {
 // module.hot.accept();
//}

