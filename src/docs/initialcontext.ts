import { ICmsComponentConfig } from '@/lib/cmscomponent';
import { PropBindingType } from  "@/lib/propbindinghelper"
import { ICmsComponentContext } from '@/lib/cmscomponentcontext';


    const pageContext = {
    company: {
      name: "Papilio",
      images: {
        logoimages: [ "http://placehold.it/200x200", "https://i.imgur.com/E02AGYU.jpg" ]
      },
      reviews: [
       {
          rating: 2,
          text: "rubbish"
       },{
        rating: 5,
        text: "awesome"
       }
     ]
    }
  }
  
  function bind(propertyName: string, expr: string) {
    return { propertyName: propertyName, type: PropBindingType.Dynamic, bindingExpression: expr }
  }
  
  function sbind(propertyName: string, value: any) {
    return { propertyName: propertyName, type: PropBindingType.Static,  bindingExpression: value }
  }
  
  var nonVisibleComponentsConfig: ICmsComponentConfig = {
      className: "CmsComponentList",
      propBindings: [
          sbind("childComponentIds",["staticDatasource1","indexDatasource1"])
      ]
  }
  var layoutConfig: ICmsComponentConfig = {
      className: "CmsComponentList",
      propBindings: [
          sbind("childComponentIds",["callToActionConfig1","testimonialConfig1"])
      ]
  }
  
  
  var datasourceConfig: ICmsComponentConfig = {
      className: "StaticDatasource",
      propBindings: [
        bind("setData","setData"),
        sbind("name", "company"),
        sbind("data", pageContext.company)
      ]
  }
  
  var indexedDSConfig: ICmsComponentConfig = {
    className: "IndexedDatasource",
    propBindings: [
      bind("setData","setData"),
      sbind("name", "selectedReviewData"),
      bind("data", "data.company.reviews"),
      bind("index", "data.selectedReview")
    ]
  }
  
  
  var callToActionConfig: ICmsComponentConfig = {
    className: "CallToAction",
    propBindings: [
      bind("title", "data.company.name"),
      bind("imageUrl", "data.company.images.logoimages[1]"),
      bind("selectedReview", "data.selectedReview"),
      bind("setData", "setData")
    ]
  }
  
  var testimonialConfig: ICmsComponentConfig = {
    className: "Testimonial",
    propBindings: [
      bind("rating","data.selectedReviewData.rating"),
      bind("blurb","data.selectedReviewData.text")
    ]
  }
  
  export const initialContext: ICmsComponentContext = {
     data: {
        selectedReview: 0,
     },
     componentConfig: {
       "slot/dataComponents": nonVisibleComponentsConfig, // or use cmscomponentbyid as a ref component
       "slot/main": layoutConfig,
       "staticDatasource1": datasourceConfig,
       "indexDatasource1": indexedDSConfig,
       "callToActionConfig1": callToActionConfig,
       "testimonialConfig1": testimonialConfig,
     },
     setData: (name,data) => {}
  }