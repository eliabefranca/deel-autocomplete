import { useCallback, useState } from 'react';
import { debounce } from '../../lib/debounce';
import AutoCompleteItem from '../AutocompleteItem';
import AutoCompleteOverlay from '../AutocompleteOverlay';
import { filterAndSortResults } from '../../lib/filterAndSortResults';
import './index.css';

export interface AutoCompleteResult {
  title: string;
  image?: string;
}

// time to wait for the user to stop typing
export const DEBOUNCE_TIME = 300;

// this function is passed as a prop,
// so the user can define how to fetch the data
export type FetchFunction = (
  searchTerm: string
) => Promise<AutoCompleteResult[]>;

export interface AutoCompleteProps {
  fetchFunction: FetchFunction;
  labelText: string;
  placeholderText: string;
}

const Autocomplete: React.FC<AutoCompleteProps> = ({
  fetchFunction,
  placeholderText,
  labelText,
}) => {
  const [error, setError] = useState(false);
  const [active, setActive] = useState(false);
  const [results, setResults] = useState<AutoCompleteResult[]>([]);
  const [term, setTerm] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setError(false);
    setTerm(term);

    if (!term) {
      setResults([]);
      return;
    }

    debouncedFetchFunction(term);
  };

  const debouncedFetchFunction = useCallback(
    // the debounce function will handle the
    // time between the user typing and the fetch function being called
    // so it will only call the fetch function once the user has stopped typing
    debounce(async (search) => {
      try {
        const data = await fetchFunction(search);
        const filteredAndSortedData = filterAndSortResults(search, data);
        setResults(filteredAndSortedData);
      } catch (err) {
        setError(true);
      }
    }, DEBOUNCE_TIME),
    [fetchFunction]
  );

  const handleAutoCompleteItemClick = (title: string) => {
    setTerm(title);
    setActive(false);
    setResults(filterAndSortResults(title, results));
  };

  const shouldShowResults = results.length > 0 && !error;
  const shouldShowEmptyResultsMessage = results.length === 0 && !error;

  return (
    <div className="Autocomplete">
      <label>{labelText}</label>
      <input
        role="textbox"
        aria-label="Autocomplete Input"
        onFocus={() => setActive(true)}
        placeholder={placeholderText}
        data-testid="autocomplete-input"
        onChange={handleInputChange}
        onBlur={() => setActive(false)}
        value={term}
      />

      {active && (
        <AutoCompleteOverlay onClose={() => setActive(false)}>
          {error && (
            <div data-testid="autocomplete-error">
              Error while fetching the data
            </div>
          )}

          {shouldShowEmptyResultsMessage && (
            <div data-testid="autocomplete-no-results">No results</div>
          )}

          {shouldShowResults && (
            <>
              {results.map(({ title, image }, index) => (
                <AutoCompleteItem
                  highlighted={term}
                  key={index}
                  title={title}
                  image={image}
                  handleClick={() => handleAutoCompleteItemClick(title)}
                />
              ))}
            </>
          )}
        </AutoCompleteOverlay>
      )}
    </div>
  );
};

export default Autocomplete;
