import React = require("react");
import { ICmsComponentConfig, CmsComponentFromConfig } from "./cmscomponent";
import { componentRegistry } from "./cmscomponentregistry";

export type ContextData = {[index: string]: any }

export interface ICmsComponentContext {
    data: ContextData
    componentConfig: {[index: string]: ICmsComponentConfig }
    setData(name: string, newData: any): void
}

export const CmsComponentContext = React.createContext<ICmsComponentContext>({
    data: {},
    componentConfig: {},
    setData: (name: string, newData: any) => {}
})

export class CmsComponentContextContainer extends React.Component<{ baseContext: ICmsComponentContext }, ICmsComponentContext> {
    updateData:(name: string, newData: any) => void

    constructor(props: { baseContext: ICmsComponentContext }) {
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
            <CmsComponentContext.Provider value={this.state as ICmsComponentContext}>
            {this.props.children}
            </CmsComponentContext.Provider>
        )
    }
}

export function CmsComponentFromContext({ componentId, componentContext, ...props } : { componentId: string, componentContext: ICmsComponentContext }) {
    if (!componentId) return null;
    var config = componentContext.componentConfig[componentId];
    return CmsComponentFromConfig({ ...props, config: config, bindingContext: componentContext })
}

export function CmsComponentFromId( props: { componentId: string }) {
    if (!props.componentId) return null;
    return (
        <CmsComponentContext.Consumer>
            { context => CmsComponentFromContext({...props, componentContext: context})}
        </CmsComponentContext.Consumer>
    )
}

componentRegistry.register("CmsComponentFromId", CmsComponentFromId)

export function CmsComponentList({childComponentIds, ...props}: {childComponentIds: string[]}) {
    if (!childComponentIds || childComponentIds.length==0) return null;
    return (
        <CmsComponentContext.Consumer>
            { context => childComponentIds.map((id,idx)=> <CmsComponentFromContext componentId={id} componentContext={context} key={idx}/>)}
        </CmsComponentContext.Consumer>
    )
}

componentRegistry.register("CmsComponentList", CmsComponentList)