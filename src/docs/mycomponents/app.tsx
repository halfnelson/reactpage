import * as React from 'react';
import { CmsComponentSlot, CmsComponentContextContainer } from "cms"

import './calltoaction'
import './testimonial'

export const App = ({ initialContext }: {[index:string]: any } ) => (
    <CmsComponentContextContainer baseContext={ initialContext }>
    <div className="App">
        <CmsComponentSlot slotId="dataComponents"/>
        <CmsComponentSlot slotId="main">
          <h3>Layout Goes Here</h3>
        </CmsComponentSlot>
    </div>
    </CmsComponentContextContainer>
  );
  