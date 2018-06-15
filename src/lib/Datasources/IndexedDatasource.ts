import * as React from "react";

interface IIndexedDatasourceProps {
    setData(name: string, newData: any): void
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
            this.props.setData(this.props.name, val)
        } catch {           
        }
    }

    async componentDidMount() {
        await new Promise(resolve=> {setTimeout(resolve, 1)})
        this.updateContext();
    }

    render(): JSX.Element {
        return null
    }
}

