import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import query from './schema/query.graphql';
import centre from './schema/centre.graphql';
import cmscomponent from './schema/cmscomponent.graphql';
import company from './schema/company.graphql';
import image from './schema/image.graphql';



import { resolvers } from './resolvers';

const typeDefs = [ query, centre, cmscomponent, company, image ].join("\n");

console.log(typeDefs);

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
