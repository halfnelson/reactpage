import { CMSDatasourceConfig } from "./cmscomponent"

export interface ICMSDatasource {
    requiresFetch: boolean;
    InitialData(): any
    GetData(): Promise<any>
}

export type DatasourceFactory = (config: any) => ICMSDatasource;

class RegisteredDatasources {
    sources: Map<string, DatasourceFactory> = new Map()

    add(name: string, source: DatasourceFactory) {
        this.sources.set(name,source)
    }

    get(name: string) {
        return this.sources.get(name)
    }
}
export var sources = new RegisteredDatasources();

