import React = require("react");
import { CMSComponentConfig } from "@/lib/cmscomponent";

export type ContextData = {[index: string]: any }

export interface ICMSComponentContext {
    data: ContextData
    componentConfig: {[index: string]: CMSComponentConfig }
    setData(name: string, newData: any): void
}

export const CMSComponentContext = React.createContext<ICMSComponentContext>({
    data: {},
    componentConfig: {},
    setData: (name: string, newData: any) => {}
})
