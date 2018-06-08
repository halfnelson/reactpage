import * as React from 'react';
import { widgets } from '@/lib/registeredWidgets';

export const CallToAction = ({title, imageUrl, componentContext}) => (
    <div className="call-to-action">
      <img className="call-to-action-image" src={imageUrl} onClick={()=>componentContext.updateContext({selectedReview: (((componentContext.data.selectedReview || 0) + 1) % 2) }) } />
      <h1 className="call-to-action-title">{title}</h1>
    </div>
  )

widgets.add("CallToAction", CallToAction)