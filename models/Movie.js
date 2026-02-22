import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    director_name: {
      type: String,
      required: [true, "Director name is required"],
    },
    production_house: {
      type: String,
      required: [true, "Production house is required"],
    },
    release_date: {
      type: String,
      required: [true, "Release date is required"],
      validate: {
        validator: function (v) {
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid date format! Use YYYY-MM-DD.`,
      },
    },
    rating: {
      type: Number,
      min: [0.0, "Rating must be at least 0.0"],
      max: [10.0, "Rating must be at most 10.0"],
      required: [true, "Rating is required"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: movie_age
movieSchema.virtual("movie_age").get(function () {
  const releaseYear = parseInt(this.release_date.split("-")[0]);
  const currentYear = new Date().getFullYear();
  return currentYear - releaseYear;
});

// Instance method: summary
movieSchema.methods.getMovieSummary = function () {
  return `${this.name} directed by ${this.director_name} was released in ${this.release_date} and has a rating of ${this.rating}.`;
};

// Existing static (kept)
movieSchema.statics.findByDirector = function (directorName) {
  return this.find({ director_name: directorName });
};

// ✅ Add the statics your resolvers expect
movieSchema.statics.getAll = function () {
  return this.find();
};

movieSchema.statics.getById = function (id) {
  return this.findById(id);
};

// REQUIRED: “use a static method” for director search
movieSchema.statics.getByDirectorName = function (director_name) {
  return this.findByDirector(director_name);
};

movieSchema.statics.insert = function (movie) {
  return this.create(movie);
};

movieSchema.statics.update = function (id, movie) {
  return this.findByIdAndUpdate(id, movie, { new: true });
};

movieSchema.statics.deleteById = function (id) {
  return this.findByIdAndDelete(id).then((doc) => !!doc);
};

// Pre-save hook
movieSchema.pre("save", function () {
  console.log(`Saving movie: ${this.name}`);
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;