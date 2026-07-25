import { render, screen, waitFor } from '@testing-library/react';
import Home from './Home';

jest.mock('../MapComponent', () => ({
  __esModule: true,
  default: ({ quakes, isLoading, errorMessage }) => (
    <div>
      {isLoading ? 'Loading...' : errorMessage ? errorMessage : `Markers: ${quakes.length}`}
    </div>
  ),
}));

describe('Home', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows a loading state and then the earthquake count when data loads', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        quakes: [{ id: '1', place: 'Test quake', lng: 10, lat: 20 }],
      }),
    });

    render(<Home />);

    expect(screen.getByText(/loading earthquakes/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/number of earthquakes: 1/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/markers: 1/i)).toBeInTheDocument();
  });

  it('shows an error message when the API request fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down'));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/unable to load earthquake data/i);
    });
  });
});
