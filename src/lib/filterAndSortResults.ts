import { AutoCompleteResult } from '../components/Autocomplete';

export function filterAndSortResults(
  term: string,
  results: AutoCompleteResult[]
): AutoCompleteResult[] {
  const t = term.toLowerCase();
  const regexp = new RegExp(t, 'gi');

  return (
    results
      .filter((item) => item.title.toLowerCase().includes(t))
      // sort by number of matches
      .sort(
        (a, b) =>
          (a.title.match(regexp)?.length ?? 0) -
          (b.title.match(regexp)?.length ?? 0)
      )

      // sort by starting index of first match
      .sort((a, b) => {
        const t = term.toLowerCase();
        return (
          a.title.toLowerCase().indexOf(t) - b.title.toLowerCase().indexOf(t)
        );
      })
  );
}
