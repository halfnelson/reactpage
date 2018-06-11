import * as React from 'react';
import { CmsComponentContext, ICmsComponentContext } from "./cmscomponentcontext";
import { CmsComponentFromConfig } from "./cmscomponent";

export function CmsComponentFromSlot({slotId, componentContext, ...props} : {slotId: string, componentContext: ICmsComponentContext }) {
    if (!slotId) return null;
    var componentToRender = componentContext.componentConfig[`slot/${slotId}`];
    if (!componentToRender) 
        return <div data-slotid={slotId} {...props}/>
    return <CmsComponentFromConfig config={componentToRender} bindingContext={componentContext} {...props} />;
}

export function CmsComponentSlot({ slotId, ...props }:{ slotId: string }) {
    return (
        <CmsComponentContext.Consumer>
            { context => CmsComponentFromSlot({ slotId: slotId, componentContext: context, ...props })}
        </CmsComponentContext.Consumer>
    )
}
