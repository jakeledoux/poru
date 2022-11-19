import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import Database from "better-sqlite3";
import pkg from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";
import { Generated, Kysely, SqliteDialect } from "kysely";

const { json } = pkg;

// BEGIN SQL

interface PollTable {
  id: Generated<number>;
  created: string;
  title: string;
}

interface OptionTable {
  id: Generated<number>;
  poll_id: number;
  text: string;
  votes: number;
}

interface PoruDatabase {
  polls: PollTable;
  options: OptionTable;
}

const db = new Kysely<PoruDatabase>({
  dialect: new SqliteDialect({ database: new Database("poru.db") }),
});

function buildPoll(
  poll: { id: number; created: string; title: string },
  options: import("kysely").Selection<
    import("kysely/dist/cjs/parser/table-parser").From<PoruDatabase, "options">,
    "options",
    "options.id" | "options.text" | "options.votes"
  >[]
) {
  return {
    id: poll.id,
    created: poll.created,
    title: poll.title,
    options: options,
  };
}
// END SQL

const typeDefs = `#graphql
  type Poll {
    id: Int!
    created: String!
    title: String!
    options: [Option]!
  }

  type Option {
    id: Int!
    text: String!
    votes: Int!
  }

  type Query {
    poll(id: Int!): Poll
    random: Poll
  }

  type Mutation {
    vote(pollId: Int!, optionId: Int!): Option!
    createPoll(title: String!, options: [String]!): Poll
  }
`;

async function getPoll(id: number) {
  const poll = await db
    .selectFrom("polls")
    .selectAll()
    .where("polls.id", "=", id)
    .executeTakeFirst();

  if (poll) {
    const options = await db
      .selectFrom("options")
      .select(["options.id", "options.text", "options.votes"])
      .where("options.poll_id", "=", id)
      .execute();

    return buildPoll(poll, options);
  }
}

const resolvers = {
  Query: {
    async poll(_parent: any, args: { id: number }, _context: any, _info: any) {
      return getPoll(args.id);
    },
    async random() {
      const polls = await db.selectFrom("polls").select("id").execute();

      if (polls) {
        const poll = polls[Math.floor(Math.random() * polls.length)];
        return getPoll(poll.id);
      }
    },
  },
  Mutation: {
    async vote(
      _parent: any,
      args: { pollId: number; optionId: number },
      _context: any,
      _info: any
    ) {
      const option = await db
        .selectFrom("options")
        .select("options.votes")
        // only filtering by pollId as a safety measure to prevent accidental misvotes
        .where("options.poll_id", "=", args.pollId)
        .where("options.id", "=", args.optionId)
        .executeTakeFirstOrThrow();

      let votes = option.votes + 1;

      const row = await db
        .updateTable("options")
        .set({ votes: votes })
        .where("id", "=", args.optionId)
        .returning(["options.id", "options.text", "options.votes"])
        .executeTakeFirstOrThrow();

      return row;
    },
    async createPoll(
      _parent: any,
      args: { title: string; options: string[] },
      _context: any,
      _info: any
    ) {
      const poll = await db
        .insertInto("polls")
        .values({
          created: new Date().getTime().toString(),
          title: args.title,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      const options = await db
        .insertInto("options")
        .values(
          args.options.map((option) => ({
            poll_id: poll.id,
            text: option,
            votes: 0,
          }))
        )
        .returning(["options.id", "options.text", "options.votes"])
        .execute();

      return buildPoll(poll, options);
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
