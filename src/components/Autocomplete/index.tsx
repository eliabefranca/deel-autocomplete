import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setError(false);
    setTerm(term);
    setResults([]);

    if (!term) {
      setUserIsTyping(false);
      return;
    }

    setUserIsTyping(true);
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

        // compare the current input value with the search term
        // to make sure the results are from the last search
        if (refInput.current?.value === search) {
          setResults(filteredAndSortedData);
        }
      } catch (err) {
        setError(true);
      }

      setUserIsTyping(false);
    }, DEBOUNCE_TIME),
    [fetchFunction]
  );

  const handleAutoCompleteItemClick = (title: string) => {
    setTerm(title);
    setResults(filterAndSortResults(title, results));
    setActive(false);
  };

  const shouldShowLoadingMessage = userIsTyping && !error;
  const shouldShowEmptyResultsMessage =
    !userIsTyping && results.length === 0 && !error;
  const shouldShowResults = results.length > 0 && !error;
  const refInput = useRef<HTMLInputElement>(null);

  // cleaning the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <div className="Autocomplete">
      <label>{labelText}</label>
      <input
        role="textbox"
        aria-label={labelText}
        onFocus={() => setActive(true)}
        placeholder={placeholderText}
        data-testid="autocomplete-input"
        onChange={handleInputChange}
        onBlur={() => {
          setTimeoutId(window.setTimeout(() => setActive(false), 200));
        }}
        value={term}
        ref={refInput}
      />

      {active && (
        <AutoCompleteOverlay
          onClose={() => setActive(false)}
          refInput={refInput}
        >
          {error && (
            <div data-testid="autocomplete-error">
              Error while fetching the data
            </div>
          )}

          {shouldShowEmptyResultsMessage && (
            <div data-testid="autocomplete-no-results">No results</div>
          )}

          {shouldShowLoadingMessage && (
            <div data-testid="autocomplete-loading">
              Fetching the results...
            </div>
          )}

          {shouldShowResults && (
            <>
              {results.map(({ title, image }) => (
                <AutoCompleteItem
                  highlighted={term}
                  key={`${title}-${image}`}
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
