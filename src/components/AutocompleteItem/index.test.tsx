import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import AutoCompleteItem from '.';

describe('AutoCompleteItem', () => {
  it('renders the item with the correct information', () => {
    render(
      <AutoCompleteItem
        highlighted="Any Title"
        image="https://example.com/image.png"
        title="Any Title"
      />
    );

    expect(screen.getByText(/Any Title/)).toBeInTheDocument();
    const image = screen.getByAltText(/Any Title/);
    expect(image).toHaveAttribute('src', 'https://example.com/image.png');
  });

  it('highlights the correct text', () => {
    render(
      <AutoCompleteItem
        highlighted="Any"
        image="https://example.com/image.png"
        title="Any Title"
      />
    );

    const highlightedText = screen.getByText(/Any/);
    expect(highlightedText).toHaveStyle('font-weight: bold');
  });

  it('calls handleClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <AutoCompleteItem
        highlighted="Any"
        image="https://example.com/image.png"
        title="Any Title"
        handleClick={handleClick}
      />
    );

    fireEvent.click(screen.getByTestId('autocomplete-item'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
