import * as React from 'react';
import { componentRegistry } from 'cms';

export const Testimonial = ({rating, blurb}:{rating: number, blurb: string}) => {
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