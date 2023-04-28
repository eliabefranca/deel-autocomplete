import './App.css';
import Autocomplete from './components/Autocomplete';
import {
  searchCountriesByName,
  searchMovie,
  searchNews,
} from './lib/searchFunctions';

function App() {
  return (
    <main>
      <h1>🔎 Autocomplete anything</h1>
      <Autocomplete
        fetchFunction={searchCountriesByName}
        labelText="Autocomplete a country name"
        placeholderText="Start typing a country name"
      />

      <Autocomplete
        fetchFunction={searchNews}
        labelText="Search for news"
        placeholderText="Start typing a news topic"
      />

      <Autocomplete
        fetchFunction={searchMovie}
        labelText="Search for a movie"
        placeholderText="Start typing a movie title"
      />
    </main>
  );
}

export default App;
