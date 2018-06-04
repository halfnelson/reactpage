import * as React from 'react';
import { widgets } from './registeredWidgets';

export const CallToAction = ({title, imageUrl}) => (
    <div className="call-to-action">
      <img className="call-to-action-image" src={imageUrl} />
      <h1 className="call-to-action-title">{title}</h1>
    </div>
  )

widgets.add("CallToAction", CallToAction)