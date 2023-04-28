import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import AutoCompleteOverlay from '.';

describe('AutoCompleteOverlay', () => {
  it('renders the children', () => {
    render(
      <AutoCompleteOverlay>
        <div>Any Child</div>
        <div>Another Child</div>
      </AutoCompleteOverlay>
    );

    expect(screen.getByText(/Any Child/)).toBeInTheDocument();
    expect(screen.getByText(/Another Child/)).toBeInTheDocument();
  });

  it('calls the onClose prop when the background is clicked', () => {
    const onClose = vi.fn();

    render(<AutoCompleteOverlay onClose={onClose} />);

    screen.getByTestId('autocomplete-overlay-background').click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
