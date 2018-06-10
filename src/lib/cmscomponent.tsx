import * as React from 'react';
import { widgets } from './registeredWidgets';
import { resolvePropBindings, PropBindingConfig } from './propbindinghelper';

export interface ICmsComponentConfig {
    className: string
    propBindings: PropBindingConfig[]
}

//resolves the componentClass against set of registered widgets and instances it with given props
export function ReactComponent({componentClass, props, children}: {componentClass: React.ComponentType<any>, props: {[index: string]: any}, children?: React.ReactNode}) {
   return React.createElement(componentClass, props, children)
}

export function BoundReactComponent({componentClass, propBindings, bindingContext, children, key}:  {componentClass: React.ComponentType<any>, propBindings?: PropBindingConfig[], bindingContext?: any, children?: React.ReactNode, key?: any}) {
    if (!componentClass) return null;
    propBindings = propBindings || [];
    var resolvedProps = resolvePropBindings(propBindings, bindingContext || {})
    return ReactComponent({componentClass: componentClass, props: {key: key, ...resolvedProps}, children: children});
}

function ResolveComponentClass(wrappedComponent) {
    return function({ componentClassName, ...props }) {
        if (!componentClassName) return null;
        var widget = widgets.get(componentClassName);
        if (!widget) return null;
        return wrappedComponent({ ...props, componentClass: widget })
    }
}

export const CmsComponent = ResolveComponentClass(BoundReactComponent);
export const StaticCmsComponent = ResolveComponentClass(ReactComponent);

export function CmsComponentFromConfig({ config, bindingContext, ...props }: { config: ICmsComponentConfig, bindingContext: any }) {
    if (!config) return null;
    return CmsComponent({ ...props,  componentClassName: config.className, propBindings: config.propBindings, bindingContext: bindingContext  })
}






