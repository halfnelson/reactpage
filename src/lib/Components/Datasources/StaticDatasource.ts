import { ICmsComponentContext } from "../cmscomponentcontext";
import React = require("react");
import { componentRegistry } from '../cmscomponentregistry';

interface IStaticDatasourceProps {
    setData(name: string, newData: any): void
    data: any
    name: string
} 

export class StaticDatasource extends React.Component<IStaticDatasourceProps>{

    async componentDidMount() {
        await new Promise(resolve=> {setTimeout(resolve, 1)})
        this.props.setData(this.props.name, this.props.data)
    }

    render() {
        return null
    }
}

componentRegistry.register("StaticDatasource", StaticDatasource)