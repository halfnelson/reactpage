import * as JsonQuery from 'json-query'

export enum PropBindingType {
    Dynamic,
    Static
}

export interface PropBindingConfig {
    type: PropBindingType
    propertyName: string
    bindingExpression: string
}

type Binding = () => any

export function resolveBindingExpression(bindingExpression: string, context: any) {
    var result = JsonQuery(bindingExpression,{
        data: context
    })
    return result.value
}

function getBinding(bindingConfig: PropBindingConfig, context: any): Binding {
    switch (bindingConfig.type) {
        case PropBindingType.Static: {
            return () => bindingConfig.bindingExpression;
        }
        case PropBindingType.Dynamic: {
            return () => resolveBindingExpression(bindingConfig.bindingExpression, context)
        }
    }
}

export function resolvePropBindings(propBindings: PropBindingConfig[], context: any): any {
    var props = {}
    propBindings.forEach(propBinding => {
        props[propBinding.propertyName] = getBinding(propBinding, context)()
    });
    return props;
}
