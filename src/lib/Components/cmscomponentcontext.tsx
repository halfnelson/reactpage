import { ICmsContextStore, ContextData } from "./CmsContextStore";

import * as React from "react";
import { CmsComponentFromConfig } from "./CmsComponent";
import { resolveBinding } from "../Helpers/PropBindingHelper";



export interface ICmsComponentContext {
    store: ICmsContextStore
    data: ContextData
    setData(partialData: ContextData): void
}

export const CmsComponentContext = React.createContext<ICmsComponentContext>({
    store: null,
    data: {},
    setData: (partialData: ContextData) => {}
})

//exposes a context to children and updates state on change
export class CmsComponentContextContainer extends React.Component<{ contextStore: ICmsContextStore}, ICmsComponentContext> {
    subscriptionDispose: () => void;

    constructor(props: { contextStore:  ICmsContextStore }) {
        super(props);
        var context = props.contextStore;
        this.state = {
            store: context,
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

export function CmsComponentList({ children }: {children: React.ReactNode}) {
  // if (!childComponents || childComponents.length==0) return null;
    return (
        <>
        { children } 
        </>
    )
}

interface IUserContextConfig {
    parameters: {[index: string]: string}
    childComponentIds: string[]
    data: ContextData
}

interface ICmsContextFromFromLoaderState {
    contextStore: ICmsContextStore
}

interface ICmsContextFromLoaderProps {
    getContextConfig: () => Promise<IUserContextConfig>
    name: string
    parentContext: ICmsComponentContext
    parameters: {[index: string]: any}
}

export class CmsContextFromLoader extends React.Component<ICmsContextFromLoaderProps, ICmsContextFromFromLoaderState> {
    contextStore:ICmsContextStore

    defaultContext:ContextData = {}

    constructor(props: ICmsContextFromLoaderProps) {
        super(props)
        this.contextStore = props.parentContext.store.createChildContextStore(this.props.name, this.defaultContext)
        this.state = { contextStore: this.contextStore }
    }

    hasLoaded() {
        this.contextStore.getCurrentContext() !== this.defaultContext
    }

    async fetchData():Promise<IUserContextConfig> {
        return this.props.getContextConfig();
    }

    async componentDidMount() {
        if (!this.hasLoaded()) {
           var userContextConfig = await this.props.getContextConfig();

           var expectedParams:ContextData = {}
           Object.keys(userContextConfig.parameters).forEach(paramName => { expectedParams[paramName] = null; })

           var parameters = this.updateParameters(expectedParams, this.props.parameters)
           this.contextStore.setData({ ...userContextConfig.data, parameters: parameters})
        }
    }

    updateParameters(prevParameters: {[index: string]: any}, newParameters: {[index: string]: any}) {
        var updatedParameters = prevParameters;
        Object.keys(prevParameters).forEach(paramName => {
            var paramValue = resolveBinding(newParameters[paramName], this.props.parentContext);
            if (prevParameters[paramName] !== paramValue) {
                //copy on write
                updatedParameters = (updatedParameters === prevParameters) ? { ...prevParameters } : updatedParameters
                updatedParameters[paramName] = newParameters[paramName]
            }
        })
        return updatedParameters;
    }

    componentDidUpdate() {
        if (this.hasLoaded) {
            var prevParams = this.contextStore.getCurrentContext().parameters;
            var parameters = this.updateParameters(prevParams, this.props.parameters);
            if (parameters !== prevParams) {
                this.contextStore.setData({ parameters: parameters })
            }
            return;
        }
    }

    render() {
       return  (
            <CmsComponentContextContainer contextStore={this.state.contextStore}> 
                <CmsComponentContext.Consumer>
                    { context => <CmsComponentFromConfig config={context.data.root} bindingContext={context} /> }
                </CmsComponentContext.Consumer>
            </CmsComponentContextContainer>
        )
    }
}

interface ICmsContextFromFileProps {
    contextPath: string
    name: string
    parameters: {[index: string]: any}
}

export class CmsContextFromFile extends React.Component<ICmsContextFromFileProps> {
    getContextFromFile: () => Promise<IUserContextConfig> = async () => {
        var fetchResult = await fetch(this.props.contextPath)
        var userContext = await fetchResult.json() as IUserContextConfig;
        return userContext
    };

    render() {
       return  (
            <CmsComponentContext.Consumer>
                { context => <CmsContextFromLoader name={this.props.name} parentContext={context} parameters={this.props.parameters} getContextConfig={this.getContextFromFile} /> }
            </CmsComponentContext.Consumer>
        )
    }
}

