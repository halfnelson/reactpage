import { ICMSComponentContext } from "../cmscomponentcontext";
import React = require("react");
import { widgets } from '../registeredWidgets';

interface IIndexedDatasourceProps {
    componentContext: ICMSComponentContext
    data: any
    index: any
    name: string
} 

export class IndexedDatasource extends React.Component<IIndexedDatasourceProps>{
    
    constructor(props: IIndexedDatasourceProps) {
        super(props)
    }
    componentDidUpdate(prevProps: IIndexedDatasourceProps) {
        if (this.props.data != prevProps.data || this.props.index != prevProps.index) {
            this.updateContext();
        }
    }

    updateContext() {
        var data = this.props.data;
        var index = this.props.index;
        try {
            var val = data ? data[index] : {}
            this.props.componentContext.updateContext({[this.props.name]: val })
        } catch {           
        }
    }

    async componentDidMount() {
        await new Promise(resolve=> {setTimeout(resolve, 1)})
        this.updateContext();
    }

    render() {
        return null
    }
}

widgets.add("IndexedDatasource", IndexedDatasource)