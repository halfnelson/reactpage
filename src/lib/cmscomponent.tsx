import * as React from 'react';
import { widgets } from './registeredWidgets';
import { CMSComponentContext, ICMSComponentContext, ContextData } from './cmscomponentcontext';
import { resolvePropBindings, PropBindingConfig, resolveBindingExpression } from './propbindinghelper';

export interface CMSComponentConfig {
    className: string
    propBindings: PropBindingConfig[]
}

interface ICMSComponentConfigStore { 
    [index: string]: CMSComponentConfig 
}



interface ICMSComponentProps {
    componentContext?: ICMSComponentContext
    id: string
}

export class CMSComponentContextContainer extends React.Component<{ baseContext: ICMSComponentContext }, ICMSComponentContext> {
    updateData:(name: string, newData: any) => void

    constructor(props: { baseContext: ICMSComponentContext }) {
        super(props);

        this.updateData = (name: string, newData: any) => {
            this.setState(prevState => {
                var newstate = { 
                    data: { 
                        ...prevState.data, 
                        [name]: newData
                    }
                }
                return newstate;
            });
        }
        
        this.state = {
            componentConfig: props.baseContext ? props.baseContext.componentConfig : {},
            setData: this.updateData,
            data: props.baseContext ? { ...props.baseContext.data } : {}
        }
    }

    render() {
        return (
            <CMSComponentContext.Provider value={this.state as ICMSComponentContext}>
            {this.props.children}
            </CMSComponentContext.Provider>
        )
    }
}

interface componentByIdProps {
    componentId: string,
    componentContext?: ICMSComponentContext,
}

//resolves the componentClass against set of registered widgets and instances it with given props
export function ReactComponent({componentClass, props, children}: {componentClass: React.ComponentType<any>, props: {[index: string]: any}, children?: React.ReactNode}) {
   return React.createElement(componentClass, props, children)
}

export function BoundReactComponent({componentClass, propBindings, bindingContext, children}:  {componentClass: React.ComponentType<any>, propBindings?: PropBindingConfig[], bindingContext?: any, children?: React.ReactNode}) {
    if (!componentClass) return null;
    propBindings = propBindings || [];
    var resolvedProps = resolvePropBindings(propBindings, bindingContext || {})
    return ReactComponent({componentClass: componentClass, props: resolvedProps, children: children});
}

function ResolveComponentClass(wrappedComponent) {
    return function({ componentClassName, ...props }) {
        if (!componentClassName) return null;
        var widget = widgets.get(componentClassName);
        if (!widget) return null;
        return wrappedComponent({ componentClass: widget, ...props })
    }
}

export const CmsComponent = ResolveComponentClass(BoundReactComponent);
export const StaticCmsComponent = ResolveComponentClass(ReactComponent);

export function CmsComponentFromContext({ componentId, componentContext }: { componentId: string, componentContext: ICMSComponentContext }) {
    if (!componentId) return null;
    var config = componentContext.componentConfig[componentId];
    if (!config) return null;
    return CmsComponent({ componentClassName: config.className, propBindings: config.propBindings , bindingContext: componentContext })
}

export function CmsComponentFromId({ componentId }: { componentId: string }) {
    if (!componentId) return null;
    return (
        <CMSComponentContext.Consumer>
            { context => CmsComponentFromContext({ componentId: componentId, componentContext: context})}
        </CMSComponentContext.Consumer>
    )
}

export function CmsComponentFromSlot({slotId, componentContext, children} : {slotId: string, componentContext: ICMSComponentContext, children?: React.ReactNode }) {
    if (!slotId) return null;
    var componentToRenderId = componentContext.data.$slots && componentContext.data.$slots[slotId];
    if (!componentToRenderId || typeof componentToRenderId != "string") 
        return this.props.children ? React.Children.only(this.props.children) : null  //TODO: add nice placeholder here

    return <CmsComponentFromContext componentId={componentToRenderId} componentContext={componentContext} />;
}

export function CmsComponentSlot({ slotId, children }:{ slotId: string, children?: React.ReactNode }) {
    return (
        <CMSComponentContext.Consumer>
            { context => CmsComponentFromSlot({ slotId: slotId, componentContext: context, children: children })}
        </CMSComponentContext.Consumer>
    )
}


