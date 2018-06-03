import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import query from './schema/query.graphql';
import channel from './schema/channel.graphql';

import { resolvers } from './resolvers';

const typeDefs = [ channel, query ].join("\n");

console.log(typeDefs);

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
