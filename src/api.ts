const API_KEY = "14435d58d32cf787108f787ebdb95e6c";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IBelongs {
  id: number;
  backdrop_path: string;
  name?: string;
}

export interface IGenres {
  id: number;
  name?: string;
}

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  original_title: string;
  popularity: string;
  release_date: string;
  imdb_id: string;
  title?: string;
  name?: string;
  belongs_to_collection: IBelongs[];
  genres?: IGenres[];
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getLatestShows() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&with_origin_country=US`
  ).then((response) => response.json());
}

export function getAiringToday() {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&first_air_date.gte=2020&with_origin_country=US`
  ).then((response) => response.json());
}

export function getPopular() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&with_origin_country=US`
  ).then((response) => response.json());
}

export function getTopRated() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&with_origin_country=US`
  ).then((response) => response.json());
}

export function getSearchMovie(keyword: string) {
  console.log("runed getserachtv api");
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}

export function getSearchTv(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}

export function getMoreDetail(category: string, review_id: string) {
  console.log(category);
  return fetch(`${BASE_PATH}/${category}/${review_id}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
