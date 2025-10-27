import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home', () => {
  it('renders the hero heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /social facelift/i })).toBeInTheDocument();
  });
});
