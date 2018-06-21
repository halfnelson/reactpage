import * as React from 'react';
import { CmsComponentSlot, componentRegistry, CmsComponentContext, CmsComponentFromContext } from "cms"


export const App = (props: any) => (
    <div className="App">
      <CmsComponentSlot slotId="dataComponents" />            
      <CmsComponentSlot slotId="main">
        <h3>Layout Goes Here</h3>
      </CmsComponentSlot>
    </div>
);

  

componentRegistry.register("App", App)