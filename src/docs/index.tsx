/// <reference path="index.d.ts"/>
/// <reference types="webpack-env" />
/// <reference path="../../dist/lib/cms.d.ts"/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ICmsComponentContext } from "cms"

import { App } from "./mycomponents/app"

var mainContext :ICmsComponentContext = null;

function render() {
  ReactDOM.render(<App initialContext={ mainContext } />, document.getElementById('root'));
}

async function loadMainContext(): Promise<ICmsComponentContext> {
    var fetchResult = await fetch("./home.json")
    var context = await fetchResult.json();
    console.log(JSON.stringify(context,null,4))
    return context
}

console.log('loading')
loadMainContext().then((context:ICmsComponentContext) => {
    mainContext = context;
    render();
});

if (module.hot) {
  module.hot.accept('./mycomponents/app', () => render());
}

