import * as React from 'react';
import { componentRegistry } from '../Components/CmsComponentRegistry';
import { resolveBinding, PropBindingConfig } from '../Helpers/PropBindingHelper';

export interface ICmsComponentConfig {
    componentClassName: string
    properties: PropBindingConfig
}

type IReactComponentProps = {
    componentClass: React.ComponentType<any>
    children?: React.ReactNode[]
}

function ReactComponent({componentClass, children, ...props}: IReactComponentProps) {
   return React.createElement(componentClass, props, children)
}


export function resolvePropBinding(bindingConfig: any, context: any): any {
    var value = resolveBinding(bindingConfig, context)
    //turn any returned component configs into react components
    if (value && value.componentClassName) {
        return CmsComponentFromConfig({ config: value, bindingContext: context })
    } else {
        return value;
    }
}


export function resolvePropBindings(propBindings: PropBindingConfig, context: any): any {
    var props:{[index: string]: any} = {}
    Object.keys(propBindings).forEach(propName => {
        var binding = propBindings[propName];
        //accept arrays of bindings or single binding
        if (Array.isArray(binding)) {
            var value = binding.map(i => resolvePropBinding(i, context));
        } else {
            value = resolvePropBinding(binding, context);
        }
        props[propName] = value
    });
    return props;
}



type IBoundReactComponentProps = {
    componentClass: React.ComponentType<any>, 
    propBindings?: PropBindingConfig, 
    bindingContext?: any, 
}    

function BoundReactComponent({componentClass, propBindings, bindingContext, ...props}:  IBoundReactComponentProps) {
    if (!componentClass) return null;
    propBindings = propBindings || {};
  //  console.log("rendering bound react component")
    var resolvedProps = resolvePropBindings(propBindings, bindingContext || {})

    return ReactComponent({componentClass: componentClass, ...props, ...resolvedProps});
}

type IResolvedComponentClassProps = {
    componentClass: React.ComponentType<any>
}

type IUnresolvedComponentClassProps = {
    componentClassName: string
}

function ResolveComponentClass(wrappedComponent: React.SFC<IResolvedComponentClassProps>) {
    return function({ componentClassName, ...props }: IUnresolvedComponentClassProps) {
        if (!componentClassName) return null;
        var componentClass = componentRegistry.get(componentClassName);
        if (!componentClass) { 
            console.warn("couldn't find component with class", componentClassName)
            return null;
        }
        return wrappedComponent({ ...props, componentClass: componentClass })
    }
}

export const CmsComponent = ResolveComponentClass(BoundReactComponent);
export const CmsStaticComponent = ResolveComponentClass(ReactComponent);

export function CmsComponentFromConfig({ config, bindingContext, ...props }: { config: ICmsComponentConfig, bindingContext: any }) {
  //  console.log("rendering ",config, bindingContext)
    if (!config) return null;
    return CmsComponent({ ...props,  componentClassName: config.componentClassName, propBindings: config.properties, bindingContext: bindingContext  } as IUnresolvedComponentClassProps)
}





