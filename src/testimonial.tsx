import * as React from 'react';
import { widgets } from '@/lib/registeredWidgets';

export const Testimonial = ({rating, blurb}) => {
  var ratings:any[] = []
  for (var j=0; j < rating; j++) {
     ratings.push(<span key={j}>*</span>)
  }
  
  return (
    <div className="testimonial">
      { ratings }
      <span className="testimonial">{blurb}</span>
    </div>
  )
}

widgets.add("Testimonial", Testimonial)