import { ICmsContextStore, ContextData } from "./CmsContextStore";

import * as React from "react";
import { CmsComponentFromConfig } from "./CmsComponent";


export interface ICmsComponentContext {
    data: ContextData
    setData(name: string, newData: any): void
}

export const CmsComponentContext = React.createContext<ICmsComponentContext>({
    data: {},
    setData: (name: string, newData: any) => {}
})

//exposes a context to children and updates state on change
export class CmsComponentContextContainer extends React.Component<{ contextStore: ICmsContextStore}, ICmsComponentContext> {
    subscriptionDispose: () => void;

    constructor(props: { contextStore:  ICmsContextStore }) {
        super(props);
        var context = props.contextStore;
        this.state = {
            setData: context.setData,
            data: context.getCurrentContext()
        }
    }

    componentDidMount() {
        this.subscriptionDispose = this.props.contextStore.subscribe((newstate) => {
            console.log("got new context state", newstate);
            this.setState(prevState => ({
                setData: prevState.setData,
                data: newstate
            }))
        });
    }

    componentWillUnmount() {
        if (this.subscriptionDispose) {
            this.subscriptionDispose();
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
    var config = componentContext.data[componentId];
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

export function CmsComponentList({childComponentIds, ...props}: {childComponentIds: string[]}) {
    if (!childComponentIds || childComponentIds.length==0) return null;
    return (
        <CmsComponentContext.Consumer>
            { context => childComponentIds.map((id,idx)=> <CmsComponentFromContext componentId={id} componentContext={context} key={idx}/>)}
        </CmsComponentContext.Consumer>
    )
}

export function CmsContext(props: any ) {
    //shove props into a new store/existing?
    return (<CmsComponentContextContainer contextStore={ props.contextStore }>
         {this.props.children}
    </CmsComponentContextContainer>)
}

