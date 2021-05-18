const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
  },
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (_, args) => links.find((l) => l.id === args.id),
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (_, args) => {
      const prevLink = links.find((l) => l.id === args.id);
      links.filter((l) => l.id !== prevLink.id);
      const link = {
        id: prevLink.id,
        description: args.description || prevLink.description,
        url: args.url || prevLink.url,
      };
      links.push(link);

      return link;
    },

    deleteLink: (_, args) => {
      const link = links.find((l) => l.id === args.id);
      links.filter((l) => l.id !== link.id);

      return link;
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
