import { FetchFunction } from '../components/Autocomplete';

export const searchCountriesByName: FetchFunction = async (
  searchTerm: string
) => {
  interface Country {
    [key: string]: any;
    name: {
      common: string;
    };
    flags: {
      png?: string;
      svg?: string;
    };
  }

  const data = await fetch(
    `https://restcountries.com/v3.1/name/${searchTerm}`
  ).then((response) => response.json());

  return data.map((country: Country) => ({
    title: country.name.common,
    image: country.flags.png || country.flags.svg,
  }));
};

export const searchNews: FetchFunction = async (searchTerm: string) => {
  interface News {
    [key: string]: any;
    articles: {
      title: string;
      image: string;
      [key: string]: any;
    }[];
  }

  // this is just a free api key, don't worry :)
  const data = await fetch(
    `https://gnews.io/api/v4/search?q=${searchTerm}&lang=en&country=us&max=10&apikey=2066a39c45abd32ee041759141ec569f`
  ).then<News>((response) => response.json());

  return data.articles.map(({ title, image }) => ({ title, image }));
};

export const searchMovie: FetchFunction = async (searchTerm: string) => {
  interface Movie {
    [key: string]: any;
    Title: string;
    Poster: string;
  }

  interface MoviesResponse {
    [key: string]: any;
    Search: Movie[];
  }

  const data = await fetch(
    `https://www.omdbapi.com/?s=${searchTerm}&apikey=e2b122bd`
  ).then<MoviesResponse>((response) => response.json());

  return data.Search.map(({ Title, Poster }) => ({
    title: Title,
    image: Poster,
  }));
};
