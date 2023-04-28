import { vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Autocomplete, { FetchFunction } from '.';

const mockedFetchFunction: FetchFunction = async (searchTerm: string) => {
  if (searchTerm === 'term_that_throws_an_error') {
    throw new Error('Any Error');
  }

  if (searchTerm === 'term_that_returns_no_results') {
    return [];
  }

  return [
    {
      title: 'A Title',
      image: 'https://example.com/image.png',
    },

    {
      title: 'Another Title',
      image: 'https://example.com/image2.png',
    },
  ];
};

vi.mock('../../lib/debounce', () => ({
  // eslint-disable-next-line
  debounce: (fn: any) => fn,
}));

vi.mock('../../lib/filterAndSortResults', () => ({
  filterAndSortResults: (_: any, data: any) => data,
}));

describe('Autocomplete', () => {
  describe('Rendering', () => {
    it('renders the label with the correct placeholder and label', async () => {
      render(
        <Autocomplete
          fetchFunction={mockedFetchFunction}
          placeholderText="Any Placeholder Text"
          labelText="Any Label Text"
        />
      );

      const label = screen.getByText(/Any Label Text/);
      const input = screen.getByRole('textbox', { name: 'Autocomplete Input' });

      expect(label).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Any Placeholder Text');
    });
  });

  describe('User interactions', () => {
    it('should show an error message when the fetchFunction throws an error', async () => {
      render(
        <Autocomplete
          fetchFunction={mockedFetchFunction}
          placeholderText="Any Placeholder Text"
          labelText="Any Label Text"
        />
      );

      const input = screen.getByRole('textbox', { name: 'Autocomplete Input' });
      userEvent.type(input, 'term_that_throws_an_error');

      await waitFor(() => {
        expect(
          screen.getByText(/Error while fetching the data/)
        ).toBeInTheDocument();
      });
    });

    it('should set error to false when the user types again after an error occurred', async () => {
      render(
        <Autocomplete
          fetchFunction={mockedFetchFunction}
          placeholderText="Any Placeholder Text"
          labelText="Any Label Text"
        />
      );

      const input = screen.getByRole('textbox', { name: 'Autocomplete Input' });
      userEvent.type(input, 'term_that_throws_an_error');

      await waitFor(() => {
        expect(
          screen.getByText(/Error while fetching the data/)
        ).toBeInTheDocument();
      });

      fireEvent.change(input, {
        target: { value: 'any_search_term' },
      });

      await waitFor(() => {
        expect(screen.queryByText(/Error while fetching the data/)).toBeNull();
      });
    });

    it('shows results when the user types', async () => {
      render(
        <Autocomplete
          fetchFunction={mockedFetchFunction}
          placeholderText="Any Placeholder Text"
          labelText="Any Label Text"
        />
      );

      const input = screen.getByRole('textbox', { name: 'Autocomplete Input' });
      userEvent.type(input, 'any_search_term');

      await waitFor(() => {
        const image = screen.getByAltText(/A Title/);
        expect(image).toHaveAttribute('src', 'https://example.com/image.png');
        expect(screen.getByText(/A Title/)).toBeInTheDocument();

        const image2 = screen.getByAltText(/Another Title/);
        expect(image2).toHaveAttribute('src', 'https://example.com/image2.png');
        expect(screen.getByText(/Another Title/)).toBeInTheDocument();
      });
    });

    it('shows no results message when there are no results', async () => {
      render(
        <Autocomplete
          fetchFunction={mockedFetchFunction}
          placeholderText="Any Placeholder Text"
          labelText="Any Label Text"
        />
      );

      const input = screen.getByRole('textbox', { name: 'Autocomplete Input' });
      userEvent.type(input, 'term_that_returns_no_results');

      await waitFor(() => {
        expect(screen.getByText(/No results/)).toBeInTheDocument();
      });
    });

    it('changes the value of the input and hides all the other results when the user clicks on a result', async () => {
      render(
        <Autocomplete
          fetchFunction={mockedFetchFunction}
          placeholderText="Any Placeholder Text"
          labelText="Any Label Text"
        />
      );

      const input = screen.getByRole('textbox', { name: 'Autocomplete Input' });
      userEvent.type(input, 'any_search_term');

      await waitFor(() => {
        const image = screen.getByAltText(/A Title/);
        fireEvent.click(image);

        expect(input).toHaveValue('A Title');

        expect(screen.queryByText(/A Title/)).toBeNull();
      });
    });

    it('clears the results when the user erases the input', async () => {
      render(
        <Autocomplete
          fetchFunction={mockedFetchFunction}
          placeholderText="Any Placeholder Text"
          labelText="Any Label Text"
        />
      );

      const input = screen.getByRole('textbox', { name: 'Autocomplete Input' });
      userEvent.type(input, 'any_search_term');

      await waitFor(() => {
        expect(screen.getByText(/A Title/)).toBeInTheDocument();
      });

      userEvent.clear(input);

      await waitFor(() => {
        expect(screen.queryByText(/A Title/)).toBeNull();
      });
    });
  });
});
