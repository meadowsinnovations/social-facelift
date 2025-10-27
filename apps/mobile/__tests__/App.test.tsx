import { render } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders the title', () => {
    const { getByText } = render(<App />);
    expect(getByText('Social Facelift Mobile')).toBeTruthy();
  });
});
