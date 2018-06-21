import * as JsonQuery from 'json-query'

export interface PropBindingConfig {
    [index: string]: any
}

export function resolveBindingExpression(bindingExpression: string, context: any) {
    var result = JsonQuery(bindingExpression,{
        data: context
    })
    return result.value
}

const BindingIndicatorStart = "{";
const BindingIndicatorEnd = "}";

///TODO: allow binding to substrings
function resolveBinding(bindingConfig: any, context: any): any {
    if (typeof bindingConfig == "string") {
        //escaped binding macro
        if (bindingConfig.startsWith(BindingIndicatorStart+BindingIndicatorStart)) {
            return bindingConfig.substr(BindingIndicatorStart.length);
        } 
        //binding macro
        else if (bindingConfig.startsWith(BindingIndicatorStart)) {
            var bindingExpr = bindingConfig.substring(BindingIndicatorStart.length, bindingConfig.length - BindingIndicatorEnd.length)
            return resolveBindingExpression(bindingExpr, context);
        } else {
            return bindingConfig;
        }
    } else {
        return bindingConfig;
    }
}

export function resolvePropBindings(propBindings: PropBindingConfig, context: any): any {
    var props:{[index: string]: any} = {}
    Object.keys(propBindings).forEach(propName => {
        props[propName] = resolveBinding(propBindings[propName], context)
    });
    return props;
}

