class CmsConfig  {
    
    private config: {[index: string]: any} = {}
    
    CmsServerRoot: string = "http://localhost";

    set(configUpdate: {[index: string]: any}) {
        this.config = {...this.config, ...configUpdate}
    }

    get() {
        return this.config
    }
}

export const cmsConfig = new CmsConfig();