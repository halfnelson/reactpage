import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import { CMSComponent, CMSComponentConfig, CMSDatasourceConfig, PropBindingType } from '@/cmscomponent';
import './calltoaction'
import './testimonial'
import './Datasources/StaticDatasource'

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

var dataConfig: CMSDatasourceConfig = {
  className: "StaticDatasource",
  config: {
     data: pageContext
  }
}


var callToActionConfig: CMSComponentConfig = {
  className: "CallToAction",
  propBindings: [
    { propertyName: "title", type: PropBindingType.Dynamic, bindingExpression: "company.name" },
    { propertyName: "imageUrl", type: PropBindingType.Dynamic, bindingExpression: "company.images.logoimages[1]" }
  ]
}

var testimonialConfig: CMSComponentConfig = {
  className: "Testimonial",
  propBindings: [
    { propertyName: "rating", type: PropBindingType.Dynamic, bindingExpression: "company.reviews[rating<3].rating" },
    { propertyName: "blurb", type: PropBindingType.Dynamic, bindingExpression: "company.reviews[rating<3].text" }
  ]
}

const widgetConfig = [
  callToActionConfig,
  testimonialConfig
]

const App = () => (
  <div className="App">
    <img className="App-logo" src={images.logo} alt="React" />
    <h1 className="App-Title">Hello Parcel xx React x TypeScript</h1>
    <CMSComponent id="callToAction1" datasource={dataConfig} children={widgetConfig} />
    <div>After Cms Component</div>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));

//Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}

