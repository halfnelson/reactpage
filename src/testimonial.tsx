import * as React from 'react';
import { componentRegistry } from '@/lib/cmscomponentregistry';

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

componentRegistry.register("Testimonial", Testimonial)