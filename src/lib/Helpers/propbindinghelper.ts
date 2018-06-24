import * as JsonQuery from 'jsonata'
import * as React from 'react'


export interface PropBindingConfig {
    [index: string]: any
}

export function resolveBindingExpression(bindingExpression: string, context: any) {
    var result = JsonQuery(bindingExpression).evaluate( context );
    return result;
}

const BindingIndicatorStart = "{";
const BindingIndicatorEnd = "}";


export function resolveBinding(bindingConfig: any, context: any): any {
    if (typeof bindingConfig == "string") {
        //regular string that looks like a binding macro but is escaped
        if (bindingConfig.startsWith(BindingIndicatorStart+BindingIndicatorStart)) {
            return bindingConfig.substr(BindingIndicatorStart.length);
        } 
        //binding macro
        else if (bindingConfig.startsWith(BindingIndicatorStart)) {
            var bindingExpr = bindingConfig.substring(BindingIndicatorStart.length, bindingConfig.length - BindingIndicatorEnd.length)
            return resolveBindingExpression(bindingExpr, context);
        } else {
            //regular string
            return bindingConfig;
        }
    }  else {
        return bindingConfig;
    }
}



