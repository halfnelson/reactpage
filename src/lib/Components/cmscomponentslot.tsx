import * as React from 'react';
import { CmsComponentContext, ICmsComponentContext } from "./CmsComponentContext";
import { CmsComponentFromConfig } from "./CmsComponent";

export function CmsComponentFromSlot({slotId, componentContext, ...props} : {slotId: string, componentContext: ICmsComponentContext }) {
    if (!slotId) return null;
    var componentToRender = componentContext.data[`slot/${slotId}`];
    if (!componentToRender) 
        return <div data-slotid={slotId} {...props}/>
    console.log(`rendering component for ${slotId}`, componentToRender, componentContext )
    return <CmsComponentFromConfig config={componentToRender} bindingContext={componentContext} {...props} />;
}

export function CmsComponentSlot({ slotId, ...props }:{ slotId: string }) {
    return (
        <CmsComponentContext.Consumer>
            { context => CmsComponentFromSlot({ slotId: slotId, componentContext: context, ...props })}
        </CmsComponentContext.Consumer>
    )
}
