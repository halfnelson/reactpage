import * as React from 'react';
import { componentRegistry } from '../Components/CmsComponentRegistry';
import { resolvePropBindings, PropBindingConfig } from '../Helpers/PropBindingHelper';

export interface ICmsComponentConfig {
    className: string
    properties: PropBindingConfig
}

type IReactComponentProps = {
    componentClass: React.ComponentType<any>
    children?: React.ReactNode[]
}

function ReactComponent({componentClass, children, ...props}: IReactComponentProps) {
   return React.createElement(componentClass, props, children)
}

type IBoundReactComponentProps = {
    componentClass: React.ComponentType<any>, 
    propBindings?: PropBindingConfig, 
    bindingContext?: any, 
}    

function BoundReactComponent({componentClass, propBindings, bindingContext, ...props}:  IBoundReactComponentProps) {
    if (!componentClass) return null;
    propBindings = propBindings || {};
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
        if (!componentClass) return null;
        return wrappedComponent({ ...props, componentClass: componentClass })
    }
}

export const CmsComponent = ResolveComponentClass(BoundReactComponent);
export const CmsStaticComponent = ResolveComponentClass(ReactComponent);

export function CmsComponentFromConfig({ config, bindingContext, ...props }: { config: ICmsComponentConfig, bindingContext: any }) {
    if (!config) return null;
    return CmsComponent({ ...props,  componentClassName: config.className, propBindings: config.properties, bindingContext: bindingContext  } as IUnresolvedComponentClassProps)
}






