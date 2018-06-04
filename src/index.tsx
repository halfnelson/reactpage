import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import { CMSComponent, CMSComponentConfig, PropBindingType } from '@/cmscomponent';
import './calltoaction'
import './testimonial'

const images = require('./*.svg');

const pageContext = {
  company: {
    name: "Papilio",
    images: {
      logoimages: [ "http://placehold.it/200x200", "https://pixabay.com/get/eb35b90c2cfd033ed1584d05fb1d4e97e07ee3d21cac104497f8c171a5e9b5ba_340.jpg" ]
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
    <CMSComponent id="callToAction1" context={pageContext} children={widgetConfig} />
    <div>After Cms Component</div>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));

//Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}

