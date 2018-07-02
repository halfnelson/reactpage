/// <reference path="../../dist/lib/cms.d.ts"/>

import * as express from "express";
import * as path from "path";

import * as React from "react";
import { renderToString } from "react-dom/server";
import { cmsConfig, CmsContextStore, CmsComponentContextContainer, CmsContextFromFile } from "cms"

import  getDataFromTree  from "./getDataFromTree"

import "fetch-everywhere"


import '../docs/mycomponents/calltoaction'
import '../docs/mycomponents/testimonial'
import '../docs/mycomponents/app'

const app = express();


console.log("serving from "+ servepath)


cmsConfig.CmsServerRoot = "http://localhost:2048"

var servepath = path.resolve( __dirname, "../docs" );
const asyncMiddleware = (fn: express.RequestHandler) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };


app.get("/index.html", asyncMiddleware(staticRender))
app.get("/",staticRender)

app.use( express.static( servepath ) );


async function getAppAsString(url:string): Promise<string> {
    var mainContextStore :CmsContextStore = new CmsContextStore({ url: url });

    const jsx = ( <CmsComponentContextContainer contextStore={ mainContextStore }>
                       <CmsContextFromFile contextPath="/home.json" name="home" parameters={{ url: "{url}"}} />
                  </CmsComponentContextContainer> );

    await getDataFromTree( jsx );
    console.log("Got data from tree", mainContextStore);

    return renderToString( jsx );
}



async function staticRender( req: express.Request, res: express.Response, next: express.NextFunction ) {

    const reactDom = await getAppAsString(req.originalUrl)

    res.writeHead( 200, { "Content-Type": "text/html" } );
    res.end( htmlTemplate( reactDom ) );
}

function htmlTemplate( reactDom: string ) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>my UI</title>
    </head>
    
    <body>
        <noscript>
            You need to enable JavaScript to run this app.
        </noscript>
        <div id="root">${ reactDom }</div>
       
    </body>
    
    </html>
    `;
    // <script src="./index.js"></script>
}

app.get( "/*", asyncMiddleware(staticRender)  );

app.listen( 2048 );

