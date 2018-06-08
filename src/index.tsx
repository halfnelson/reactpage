import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CMSComponent, CMSComponentConfig } from '@/lib/cmscomponent';
import { PropBindingType } from  "@/lib/propbindinghelper"
import '@/lib/Datasources/StaticDatasource'

import './index.css';
import './calltoaction'
import './testimonial'

const images = require('./*.svg');

const pageContext = {
  company: {
    name: "Papilio",
    images: {
      logoimages: [ "http://placehold.it/200x200", "https://i.imgur.com/E02AGYU.jpg" ]
    },
    reviews: [
     {
        rating: 2,
        text: "rubbish"
     },{
      rating: 5,
      text: "awesome"
     }
   ]
  }
}

function bind(propertyName: string, expr: string) {
  return { propertyName: propertyName, type: PropBindingType.Dynamic, bindingExpression: expr }
}

function sbind(propertyName: string, value: any) {
  return { propertyName: propertyName, type: PropBindingType.Static,  bindingExpression: value }
}

var datasourceConfig: CMSComponentConfig = {
    className: "StaticDatasource",
    propBindings: [
      sbind("name", "company"),
      sbind("data", pageContext.company)
    ]
}

var callToActionConfig: CMSComponentConfig = {
  className: "CallToAction",
  propBindings: [
    bind("title", "company.name"),
    bind("imageUrl", "company.images.logoimages[1]")
  ]
}

var testimonialConfig: CMSComponentConfig = {
  className: "Testimonial",
  propBindings: [
    bind("rating","company.reviews[rating<3].rating"),
    bind("blurb","company.reviews[rating<3].text")
  ]
}

const widgetConfig = [
  datasourceConfig,
  callToActionConfig,
  testimonialConfig
]

const App = () => (
  <div className="App">
    <img className="App-logo" src={images.logo} alt="React" />
    <h1 className="App-Title">Hello Parcel xx React x TypeScript</h1>
    <CMSComponent id="callToAction1" children={widgetConfig} />
    <div>After Cms Component</div>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));

//Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}

