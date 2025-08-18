const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

export type TMDBMovieData = {
  title: string;
  overview: string;
  poster_path: string;
};

const apiOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
};

export const tmdbApi = {
  getPopularMovies: async (queryString: string) => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?${queryString}`,
      apiOptions,
    );
    return response.json();
  },
};
