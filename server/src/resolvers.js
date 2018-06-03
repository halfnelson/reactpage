const channels = [{
  id: 1,
  name: 'soccer',
  thingy: 'someThingy'
}, {
  id: 2,
  name: 'baseball',
  thingy: 'another thingy'
}];


export const resolvers = {
  Query: {
    channels: () => {
      return channels;
    },
    channel: (_, { id }) => channels.find(c=>c.id === id )
  },
};
