import * as React from 'react';
import { componentRegistry } from "cms"


export const App = (props: any) => (
    <div className="App">
      {props["slot-dataComponent"]}            
      {props["slot-main"]}
    </div>
);

  

componentRegistry.register("App", App)