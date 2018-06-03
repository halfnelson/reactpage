
function idGenerator() {
  var id = 0;

  function newId() {
    var currentId = id;
    id = id + 1;
    return currentId;
  }

  return newId;
}

const centerIdGenerater = idGenerator();
const companyIdGenerator = idGenerator();
const CmsComponentIdGenerator = idGenerator();

function cmscomponent(id, componentClass, props) {
  return { id, componentClass,  props }
}

function image( path, name, title) {
  return {path, name, title}
}

function centre(id, name, phone, address, openingHours, url, email, image) {
  return {id, name, phone, address, openingHours, url, email, image}
}


function company(id, name, phone, address, centres) {
  return {
    id,
    name,
    phone,
    address,
    centres
  }
}

const images = [
  image("artarmon.jpg","listing-image","artarmon"),
  image("bruce.jpg","listing-image","bruce"),
  image("ryde.jpg","listing-image","ryde")
]


const companies = [
  company(1, "papilio","1800 CHILDCARE", "Level 14, 100 Creek St, BRISBANE QLD 4000", [
    centre(1, "Artarmon", "(02) 9966 4313","4-10 Carlotta St, Artarmon, NSW, 2064", "6:30am to 6:30pm, Monday to Friday\nClosed weekends and public holidays", "https://artarmon.papilio.com.au/", "artarmon@papilio.com.au", images.find(i=>i.path == "artarmon.jpg")),
    centre(2, "Bruce", "(02) 6251 9399","100 Eastern Valley Way, Bruce ACT 2617", "Monday to Friday, 7:30 AM to 6:00 PM\nClosed on public holidays", "https://bruce.papilio.com.au/", "bruce@papilioel.com.au", images.find(i=>i.path == "bruce.jpg")),
    centre(3, "Ryde", "(02) 9807 3300","6 Porter St, Ryde, NSW, 2112", "7:00am to 6:00pm, Monday to Friday\nClosed weekends and public holidays", "https://ryde.papilio.com.au/", "ryde@papilio.com.au",  image("ryde.jpg","listing-image","ryde"))
  ])
]

const cmscomponents = [
  cmscomponent(1, "CmsPage", { })
]



export const resolvers = {
  Query: {
    companies: () =>  companies,
    company: (_, { id }) => companies.find(c=>c.id == id),
    centre: (_, { id }) => Array.concat(...companies.map(x=>x.centres)).find(c=>c.id == id),
    image: (_, { path }) => images.find(x=>x.path == path),
    _component: (_, { id }) => cmscomponents.find(x=>x.id == id)
  },
};
