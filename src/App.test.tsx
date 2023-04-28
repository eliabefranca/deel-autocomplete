import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the page title', () => {
    render(<App />);
    const headline = screen.getByText(/🔎 Autocomplete anything/);
    expect(headline).toBeInTheDocument();
  });
});
