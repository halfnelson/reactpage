import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CMSComponent, CMSComponentConfig } from '@/lib/cmscomponent';
import { PropBindingType } from  "@/lib/propbindinghelper"
import '@/lib/Datasources/StaticDatasource'
import '@/lib/Datasources/IndexedDatasource'

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

var indexedDSConfig: CMSComponentConfig = {
  className: "IndexedDatasource",
  propBindings: [
    sbind("name", "selectedReviewData"),
    bind("data", "company.reviews"),
    bind("index", "selectedReview")
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
    bind("rating","selectedReviewData.rating"),
    bind("blurb","selectedReviewData.text")
  ]
}

const widgetConfig = [
  datasourceConfig,
  indexedDSConfig,
  callToActionConfig,
  testimonialConfig
]

var initialContext = {
   data: {
      selectedReview: 0
   },
   updateContext: (d) => {}
}

const App = () => (
  <div className="App">
    <img className="App-logo" src={images.logo} alt="React" />
    <h1 className="App-Title">Hello Parcel xx React x TypeScript</h1>
    <CMSComponent id="callToAction1" children={widgetConfig} componentContext={initialContext} />
    <div>After Cms Component</div>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));

//Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}

