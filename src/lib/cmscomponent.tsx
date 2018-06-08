import * as React from 'react';
import { widgets } from './registeredWidgets';
import { CMSComponentContext, ICMSComponentContext, ContextData } from './cmscomponentcontext';
import { resolvePropBindings, PropBindingConfig } from './propbindinghelper';

export interface CMSComponentConfig {
    className: string
    propBindings: PropBindingConfig[]
}

interface ICMSComponentProps {
    componentContext?: ICMSComponentContext
    id: string
    children: CMSComponentConfig[]
}

export class CMSComponent extends React.Component<ICMSComponentProps, ICMSComponentContext> {

    updateComponentContext:(newData: ContextData) => void

    constructor(props: ICMSComponentProps) {
        super(props);

        this.updateComponentContext = (newData: ContextData) => {
            console.log("Component context", newData);
            this.setState(prevState => {
                //update our local data
                var newstate = { data: { 
                    ...prevState.data, 
                    ...newData
                    }
                }
                console.log("new state",newstate);
                return newstate;
            });
        }
        
        this.state = {
            updateContext: this.updateComponentContext,
            data: props.componentContext ? { ...props.componentContext.data } : {}
        }
    }

    renderChild(config: CMSComponentConfig, idx: number) {
        var widget = widgets.get(config.className);
        return widget ? React.createElement(widget, { key: idx , ...resolvePropBindings(config.propBindings, this.state.data), componentContext: this.state }) : null
    }

    render() {
        return (
            <div id={this.props.id}>
                <CMSComponentContext.Provider value={this.state as ICMSComponentContext}>
                {this.props.children.map((child, i) => this.renderChild(child, i))}
                </CMSComponentContext.Provider>
            </div>
        )
    }
}


