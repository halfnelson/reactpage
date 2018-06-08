import { ICMSComponentContext } from "../cmscomponentcontext";
import React = require("react");
import { widgets } from '../registeredWidgets';

interface IStaticDatasourceProps {
    componentContext: ICMSComponentContext
    data: any
    name: string
} 

export class StaticDatasource extends React.Component<IStaticDatasourceProps>{

    async componentDidMount() {
        await new Promise(resolve=> {setTimeout(resolve, 1)})
        this.props.componentContext.updateContext({[this.props.name]: this.props.data })
    }

    render() {
        return null
    }
}

widgets.add("StaticDatasource", StaticDatasource)