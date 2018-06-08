import { ICMSComponentContext } from "../cmscomponentcontext";
import React = require("react");
import { widgets } from '../registeredWidgets';

interface IStaticDatasourceProps {
    componentContext: ICMSComponentContext
    data: any
    name: string
} 

export class StaticDatasource extends React.Component<IStaticDatasourceProps>{
    
    constructor(props: IStaticDatasourceProps) {
        console.log("constructed")
        super(props)
    }

    async componentDidMount() {
        console.log("mounted")
        await new Promise(resolve=> {setTimeout(resolve, 1000)})
        console.log("propped")
        this.props.componentContext.updateContext({[this.props.name]: this.props.data })
    }

    render() {
        return null
    }
}

widgets.add("StaticDatasource", StaticDatasource)