/// <reference path="index.d.ts"/>
/// <reference types="webpack-env" />
/// <reference path="../../dist/lib/cms.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {  CmsContextStore,  CmsComponentContextContainer, CmsContextFromFile } from "cms"

import './mycomponents/calltoaction'
import './mycomponents/testimonial'
import './mycomponents/app'

var mainContextStore :CmsContextStore = new CmsContextStore({ url: "http://example.com" });

function render() {
  ReactDOM.render(
    <CmsComponentContextContainer contextStore={ mainContextStore }>
       <CmsContextFromFile contextPath="/home.json" name="home" parameters={{ url: "{url}"}} />
    </CmsComponentContextContainer>
    , document.getElementById('root'));
}

render()
if (module.hot) {
    module.hot.accept('./mycomponents/app', () => render());
}




