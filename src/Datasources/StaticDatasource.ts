import { ICMSDatasource, sources } from "@/registeredDatasources"
import { CMSDatasourceConfig } from "@/cmscomponent";

interface StaticDatasourceConfig {
    data: any;
}

class StaticDatasource implements ICMSDatasource {
    private data = null;
    public requiresFetch: boolean = false;

    constructor(config: StaticDatasourceConfig) {
        this.data = config.data;
    }

    InitialData():any {
        return this.data;
    }

    GetData(): Promise<any> {
        return new Promise(resolve => setTimeout(resolve, 0)).then(()=>this.data);
    }
}


function staticDatasourceFactory(config: StaticDatasourceConfig): ICMSDatasource {
    return new StaticDatasource(config);
}

sources.add("StaticDatasource", staticDatasourceFactory)