import * as React from 'react';
import { widgets } from './registeredWidgets';
import { sources } from './registeredDatasources';
import * as JsonQuery from 'json-query'
import { ICMSDatasource } from '@/registeredDatasources';

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

export interface CMSDatasourceConfig {
    className: string
    config: any
}

export interface CMSComponentConfig {
    className: string
    propBindings: PropBindingConfig[]
}

type ContextData = {[index: string]: any }

interface ICMSComponentProps {
   // datasource: CMSDatasourceConfig
    componentContext?: ContextData
    id: string
    children: CMSComponentConfig[]
}



interface ICMSComponentContext {
    data: ContextData
    updateContext(newData: any): void
}



export const CMSComponentContext = React.createContext<ICMSComponentContext>({
    data: {},
    updateContext: (newData: ContextData) => {}
})



export class CMSComponent extends React.Component<ICMSComponentProps, any> {
    
    //datasource: ICMSDatasource | undefined;
    updateComponentContext:(newData: ContextData) => void
   

    constructor(props: ICMSComponentProps) {
        super(props);

        this.updateComponentContext = (newData: ContextData) => {
            this.setState((prevState, _) => ({ data: { ...prevState.data, ...newData } }))
        }
        
        this.state = {
            updateContext: this.updateComponentContext,
            data: props.componentContext ? { ...props.componentContext.data } : {}
        }
    }
      //  var factory = sources.get(props.datasource.className);
    //   // if (factory) {
       //     this.datasource = factory(props.datasource.config);
       //     this.state = { bindingContext: this.datasource.InitialData() };
       // } else {
       //     this.state = { bindingContext: null }
       // }
  //  }

  //  async componentDidMount() {
    //    if (this.datasource && this.datasource.requiresFetch) {
     //       var data = await this.datasource.GetData()
     //       this.setState({
     //           bindingContext: data
     //       });
     //   }
   // }

  

    getBinding(bindingConfig: PropBindingConfig): Binding {
        switch (bindingConfig.type) {
            case PropBindingType.Static: {
                return createStaticBinding(bindingConfig.bindingExpression)
            }
            case PropBindingType.Dynamic: {
                return createDynamicBinding(bindingConfig.bindingExpression, this.state.data)
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

    renderChild(config: CMSComponentConfig, idx: number) {
        var widget = widgets.get(config.className);
        return widget ? React.createElement(widget, { key: idx , ...this.resolvePropBindings(config.propBindings)}) : null
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


