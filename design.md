Entire site data is a giant store (graphql?)

A Template is CmsComponent

A PageType is a Template + ComponentConfig

A CmsComponentContainer takes a ComponentConfig and uses that to render its children.
DataSource: {
    Load: () (TData => TData)
    Data: TData
}


CmsComponent: {
    ReactComponent: {
        ComponentClass: string
        PropBinding[]: PropBindingConfig (propertyName, Data) =>   Mapping of propertyName=>datasource path. Maybe with https://github.com/mmckegg/json-query
    }
    DataSource 
}


Editor:

maybe lean on https://github.com/mozilla-services/react-jsonschema-form ?












the CmsComponent's job is to take the params and bind them to the properties of its children