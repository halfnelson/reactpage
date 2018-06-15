export * from "./Components"
export * from "./Datasources"
export * from "./Helpers/PropBindingHelper"

import * as Components from "./Components"

// Register all the components
var registry = Components.componentRegistry;

//base components
registry.register("CmsComponentFromConfig", Components.CmsComponentFromConfig)
registry.register("CmsComponent", Components.CmsComponent)
registry.register("CmsStaticComponent", Components.CmsStaticComponent)

//components requiring knowledge of context
registry.register("CmsComponentSlot", Components.CmsComponentSlot)
registry.register("CmsComponentFromSlot", Components.CmsComponentFromSlot)
registry.register("CmsComponentFromContext", Components.CmsComponentFromContext)
registry.register("CmsComponentFromId", Components.CmsComponentFromId)
registry.register("CmsComponentList", Components.CmsComponentList)

import * as Datasources from "./Datasources"

//data sources
registry.register("IndexedDatasource", Datasources.IndexedDatasource)
registry.register("StaticDatasource", Datasources.StaticDatasource)