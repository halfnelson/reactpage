import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {  CMSComponentConfig, CmsComponentFromId, CMSComponentContextContainer } from '@/lib/cmscomponent';
import { PropBindingType } from  "@/lib/propbindinghelper"
import '@/lib/Datasources/StaticDatasource'
import '@/lib/Datasources/IndexedDatasource'

import './index.css';
import './calltoaction'
import './testimonial'
import { ICMSComponentContext } from '@/lib/cmscomponentcontext';

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
      bind("setData","setData"),
      sbind("name", "company"),
      sbind("data", pageContext.company)
    ]
}

var indexedDSConfig: CMSComponentConfig = {
  className: "IndexedDatasource",
  propBindings: [
    bind("setData","setData"),
    sbind("name", "selectedReviewData"),
    bind("data", "data.company.reviews"),
    bind("index", "data.selectedReview")
  ]
}


var callToActionConfig: CMSComponentConfig = {
  className: "CallToAction",
  propBindings: [
    bind("title", "data.company.name"),
    bind("imageUrl", "data.company.images.logoimages[1]"),
    bind("selectedReview", "data.selectedReview"),
    bind("setData", "setData")
  ]
}

var testimonialConfig: CMSComponentConfig = {
  className: "Testimonial",
  propBindings: [
    bind("rating","data.selectedReviewData.rating"),
    bind("blurb","data.selectedReviewData.text")
  ]
}

const widgetConfig = [
  datasourceConfig,
  indexedDSConfig,
  callToActionConfig,
  testimonialConfig
]

var initialContext: ICMSComponentContext = {
   data: {
      selectedReview: 0
   },
   componentConfig: {
     "staticDatasource1": datasourceConfig,
     "indexDatasource1": indexedDSConfig,
     "callToActionConfig1": callToActionConfig,
     "testimonialConfig1": testimonialConfig,
   },
   setData: (name,data) => {}
}

const App = () => (
  <div className="App">
    <img className="App-logo" src={images.logo} alt="React" />
    <h1 className="App-Title">Hello Parcel xx React x TypeScript</h1>
    <CMSComponentContextContainer baseContext={initialContext}>
       <CmsComponentFromId componentId="staticDatasource1" />
       <CmsComponentFromId componentId="indexDatasource1" />
       <CmsComponentFromId componentId="callToActionConfig1" />
       <CmsComponentFromId componentId="testimonialConfig1" />
    </CMSComponentContextContainer>
    
    <div>After Cms Component</div>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));

//Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}

