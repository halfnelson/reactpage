/// <reference path="index.d.ts"/>
/// <reference types="webpack-env" />
/// <reference path="../../dist/lib/cms.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CmsApp, CmsContextStore, ICmsComponentConfig, CmsComponentContext, CmsComponentFromConfig } from "cms"

import './calltoaction'
import './testimonial'
import './app'

var mainContextStore :CmsContextStore = new CmsContextStore({});

function render(main: ICmsComponentConfig) {
  ReactDOM.render(
    <CmsApp contextStore={ mainContextStore }>
        <CmsComponentContext.Consumer>
          { (context) => (<CmsComponentFromConfig config={main} bindingContext={context} />) }
        </CmsComponentContext.Consumer>
    </CmsApp>
    , document.getElementById('root'));
}

async function loadMainComponent(): Promise<ICmsComponentConfig> {
    var fetchResult = await fetch("./home.json")
    var component = await fetchResult.json() as ICmsComponentConfig;
    console.log(JSON.stringify(component,null,4))
    return component
}

console.log('loading')
loadMainComponent().then((component) => {
    render(component);
    if (module.hot) {
      module.hot.accept('./mycomponents/app', () => render(component));
    }
});



