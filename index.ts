import { prisma } from "./db.js";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";

// index.ts -> index.js
// db.ts -> db.js

(async function () {
  const typeDefs = gql`
    type Movie {
      id: String
      poster: String
      title: String
      director: String
      rating: String
    }

    type Query {
      getAllMovies: [Movie]
    }

    type Mutation {
      createMovie(poster: String, title: String, director: String, rating: String): Movie
    }
  `;
  interface createMovieInput {
    poster: string;
    title: string;
    director: string;
    rating: string;
  }

  const resolvers = {
    Mutation: {
      createMovie: async (_parent: any, args: createMovieInput) => {
        console.log('args', args)
        const movie = await prisma.movie.create({
          data: {
            poster: args.poster,
            title: args.title,
            director: args.director,
            rating: args.rating
          }
        });

        return movie;
      }
    },
    Query: {
      getAllMovies: async () => {
        return await prisma.movie.findMany(); // easy way to get a list of movies -> [movie1, ....]
      }
    }
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  });

  console.log(`Server is ready at ${url}`);
})();
