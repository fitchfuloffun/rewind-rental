import { Client, Configuration } from "streaming-availability";

const API_KEY = import.meta.env.VITE_MOTN_API_KEY;

const client = new Client(new Configuration({ apiKey: API_KEY }));

export async function getWatchProvidersByMovieId(movieId: number) {
  return client.showsApi
    .getShow({ id: `movie/${movieId}` })
    .then((show) => show.streamingOptions["au"]);
}
