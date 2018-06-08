import React = require("react");

export type ContextData = {[index: string]: any }

export interface ICMSComponentContext {
    data: ContextData
    updateContext(newData: any): void
}

export const CMSComponentContext = React.createContext<ICMSComponentContext>({
    data: {},
    updateContext: (newData: ContextData) => {}
})
