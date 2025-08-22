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
    moviesByGenre: await getMoviesByGenre(),
    popular: await Promise.all([
      getPopularMovies(),
      getPopularMovies({ page: 2 }),
    ]).then((responses) => responses.filter((response) => !!response).flat()),
    cage: await getPersonMovieCredits(2963).then((response) => response.cast),
    twilight: await getCollectionInfo(33514).then((response) => response.parts),
    trending: await Promise.all([
      getTrendingMovies({
        media_type: "movie",
        time_window: "day",
      }),
    ]).then((responses) => responses.flat()),
    adult: await getAdultMovies(),
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

export async function getMoviesByGenre() {
  const genres = await moviedb.genreMovieList();

  if (!genres.genres) {
    throw new Error("No genres found");
  }

  const genrePromises = genres.genres.map((genre) =>
    Promise.all([
      moviedb.discoverMovie({ with_genres: String(genre.id), page: 1 }),
      moviedb.discoverMovie({ with_genres: String(genre.id), page: 2 }),
    ]).then((response) => ({
      results: response.flatMap((response) => response.results),
      genre,
    })),
  );

  const genreMovies = await Promise.all(genrePromises);

  return genreMovies.reduce(
    (acc, genreMoviesResponse) => {
      if (genreMoviesResponse.results) {
        if (!genreMoviesResponse.genre.name) {
          return acc;
        }
        acc[genreMoviesResponse.genre.name] = genreMoviesResponse.results;
      }
      return acc;
    },
    {} as Record<string, MovieResult[]>,
  );
}
