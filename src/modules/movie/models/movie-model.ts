import { ObjectId } from 'mongodb';

type Awards = {
  wins: number;
  nominations: number;
  text: string;
};

type Imdb = {
  rating: number;
  votes: number;
  id: number;
};

type Viewer = {
  rating: number;
  numReviews: number;
  meter: number;
};

type Critic = {
  rating: number;
  numReviews: number;
  meter: number;
};

type Tomatoes = {
  viewer: Viewer;
  fresh: number;
  critic: Critic;
  rotten: number;
  lastUpdated: Date;
};

type Movie = Document & {
  _id?: ObjectId;
  plot: string;
  genres: string[];
  runtime: number;
  cast: string[];
  poster: string;
  title: string;
  fullplot: string;
  languages: string[];
  released: Date;
  directors: string[];
  rated: string;
  awards: Awards;
  lastupdated: string;
  year: number;
  imdb: Imdb;
  countries: string[];
  type: string;
  tomatoes: Tomatoes;
  num_mflix_comments: number;
};

export { Movie };
