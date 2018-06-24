import * as React from "react";
import { ContextData } from "../Components";

interface IStaticDatasourceProps {
    setData(partialData: ContextData): void
    data: any
    name: string
} 

export class StaticDatasource extends React.Component<IStaticDatasourceProps>{

    async componentDidMount() {
        console.log("Static DS mounted")
        await new Promise(resolve=> {setTimeout(resolve, 1)})
        console.log("Static DS resolved")
        this.props.setData({ [this.props.name]: this.props.data })
    }

    render(): JSX.Element {
        console.log("Static DS rendered")
        return null
    }
}

