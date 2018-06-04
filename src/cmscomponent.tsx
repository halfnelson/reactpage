import * as React from 'react';
import { widgets } from './registeredWidgets';
import * as JsonQuery from 'json-query'

export enum PropBindingType {
    Dynamic,
    Static
}

interface PropBindingConfig {
    type: PropBindingType
    propertyName: string
    bindingExpression: string
}

type Binding = () => any


function resolveBindingExpression(bindingExpression: string, context: any) {
    var result = JsonQuery(bindingExpression,{
        data: context
    })
    return result.value
}


function createStaticBinding(bindingExpression: any) {
    return () => bindingExpression;
}

function createDynamicBinding(bindingExpression, context) {
    return () => resolveBindingExpression(bindingExpression, context)
}



export interface CMSComponentConfig {
    className: string
    propBindings: PropBindingConfig[]
}

interface ICMSComponentProps {
    context: any
    id: string
    children: CMSComponentConfig[]
}



export class CMSComponent extends React.Component<ICMSComponentProps, any> {
    constructor(props: ICMSComponentProps) {
        super(props)
        this.state = { bindingContext: { ...props.context } };
    }

    getBinding(bindingConfig: PropBindingConfig): Binding {
        switch (bindingConfig.type) {
            case PropBindingType.Static: {
                return createStaticBinding(bindingConfig.bindingExpression)
            }
            case PropBindingType.Dynamic: {
                return createDynamicBinding(bindingConfig.bindingExpression, this.state.bindingContext)
            }
        }
    }

    resolvePropBindings(propBindings: PropBindingConfig[]): any {
        var props = {}
        propBindings.forEach(propBinding => {
            props[propBinding.propertyName] = this.getBinding(propBinding)()
        });
        return props;
    }

    renderChild(config: CMSComponentConfig) {
        var widget = widgets.get(config.className);
        return widget ? React.createElement(widget, this.resolvePropBindings(config.propBindings)) : null
    }

    render() {
        return (
            <div id={this.props.id}>
                {this.props.children.map(child => this.renderChild(child))}
            </div>
        )
    }
}


