import * as React from 'react';
import { componentRegistry } from '@/lib/cmscomponentregistry';

export const CallToAction = ({title, imageUrl, setData, selectedReview}) => (
    <div className="call-to-action">
      <img className="call-to-action-image" src={imageUrl} onClick={()=>setData("selectedReview", ((selectedReview || 0) + 1) % 2)} />
      <h1 className="call-to-action-title">{title}</h1>
    </div>
  )

componentRegistry.register("CallToAction", CallToAction)