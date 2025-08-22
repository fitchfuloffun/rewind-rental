import {
  MovieDb,
  MovieResult,
  PopularMoviesRequest,
  TrendingRequest,
} from "moviedb-promise";
import { MoviesBySection } from "@/components/store/StoreScene.tsx";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const moviedb = new MovieDb(API_KEY);

export async function fetchAllMovies(): Promise<MoviesBySection> {
  return {
    popular: await Promise.all([
      getPopularMovies(),
      getPopularMovies({ page: 2 }),
    ]).then((responses) => responses.flat()),
    cage: await getPersonMovieCredits(2963).then((response) => response.cast),
    twilight: await getCollectionInfo(33514).then((response) => response.parts),
    trending: await Promise.all([
      getTrendingMovies({ media_type: "movie", time_window: "day" }),
    ]).then((responses) => responses.flat()),
  };
}

export async function getPopularMovies(params?: PopularMoviesRequest) {
  return moviedb.moviePopular(params).then((response) => response.results);
}

export async function getPersonMovieCredits(personId: number) {
  return moviedb.personMovieCredits(personId);
}

export async function getTrendingMovies(params: TrendingRequest) {
  return moviedb
    .trending({ ...params, media_type: "movie" })
    .then((response) =>
      response.results?.filter((movie): movie is MovieResult => !!movie),
    );
}

export async function getCollectionInfo(collectionId: number) {
  return moviedb.collectionInfo(collectionId);
}
