import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  type Poll {
    id: Int!
    title: String!
    options: [Option]!
  }

  type Option {
    id: Int!
    text: String!
    votes: Int!
  }

  type Query {
    polls: [Poll]
    poll(id: Int!): Poll
  }

  type Mutation {
    vote(pollId: Int!, optionId: Int!): Poll
    createPoll(title: String!, options: [String]!): Poll
  }
`;

const polls = [
  {
    id: 0,
    title: "which attack on titan season is best?",
    options: [
      {
        id: 0,
        text: "season 1",
        votes: 0,
      },
      {
        id: 1,
        text: "season 2",
        votes: 0,
      },
      {
        id: 2,
        text: "season 3",
        votes: 0,
      },
      {
        id: 3,
        text: "season 4",
        votes: 0,
      },
    ],
  },
];

const resolvers = {
  Query: {
    polls: () => polls,
    poll(_parent: any, args: { id: number }, _context: any, _info: any) {
      return polls[args.id];
    },
  },
  Mutation: {
    vote(
      _parent: any,
      args: { pollId: number; optionId: number },
      _context: any,
      _info: any
    ) {
      let poll = polls[args.pollId];

      // poll does not exist
      if (poll == null) {
        return poll;
      }
      // option does not exist
      if (args.optionId >= poll.options.length) {
        return null;
      }

      // increment votes
      poll.options[args.optionId].votes += 1;
      // update poll store
      polls[args.pollId] = poll;

      return poll;
    },
    createPoll(
      _parent: any,
      args: { title: string; options: string[] },
      _context: any,
      _info: any
    ) {
      // create poll
      let poll = {
        id: polls.length,
        title: args.title,
        options: args.options.map((option, i) => ({
          id: i,
          text: option,
          votes: 0,
        })),
      };

      // store poll
      polls.push(poll);

      return poll;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);
