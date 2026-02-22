import MovieModel from "../models/movie.js";

const movieResolvers = {
  Query: {
    getAllMovies: async () => {
      return await MovieModel.getAll();
    },

    getMovieById: async (_, { id }) => {
      return await MovieModel.getById(id);
    },

    getMoviesByDirector: async (_, { director_name }) => {
      return await MovieModel.getByDirectorName(director_name);
    },
  },

  Mutation: {
    insertMovie: async (_, { movie }) => {
      return await MovieModel.insert(movie);
    },

    updateMovie: async (_, { id, movie }) => {
      return await MovieModel.update(id, movie);
    },

    deleteMovieById: async (_, { id }) => {
      return await MovieModel.deleteById(id);
    },
  },
};

export default movieResolvers;