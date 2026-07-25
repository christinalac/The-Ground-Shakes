import { render, screen, waitFor } from '@testing-library/react';
import Home from './pages/Home';

describe('Home page', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('fetches quake data from the live quake endpoint', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ quakes: [{ id: '1' }, { id: '2' }] }),
    });

    render(<Home />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('https://pocketworld.org/api/quakes'));
    await waitFor(() => expect(screen.getByText(/number of earthquakes:/i)).toHaveTextContent('Number of Earthquakes: 2'));
  });
});
