import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import pkg from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";

const { json } = pkg;

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
    random: Poll
  }

  type Mutation {
    vote(pollId: Int!, optionId: Int!): Poll
    createPoll(title: String!, options: [String]!): Poll
  }
`;

let polls = [
  {
    id: 0,
    title: "which attack on titan season is best?",
    options: [
      {
        id: 0,
        text: "season 1",
        votes: 1509,
      },
      {
        id: 1,
        text: "season 2",
        votes: 1145,
      },
      {
        id: 2,
        text: "season 3",
        votes: 865,
      },
      {
        id: 3,
        text: "season 4",
        votes: 533,
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
    random() {
      return polls[Math.floor(Math.random() * polls.length)];
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

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors<cors.CorsRequest>({
    origin: ["http://localhost:5173", "https://studio.apollographql.com"],
  }),
  json(),
  expressMiddleware(server)
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);
console.log(`🚀 Server ready at: http://localhost:4000/graphql`);
