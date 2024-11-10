import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WeatherStation from '@/components/weather-station';
import { act } from 'react-dom/test-utils';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Line: () => <div>Line</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
}));

// Mock fetch function
global.fetch = jest.fn();

const mockWeatherData = {
  hourly: {
    time: Array.from({ length: 24 }, (_, i) => 
      new Date(new Date().setHours(i, 0, 0, 0)).toISOString()
    ),
    temperature_2m: Array.from({ length: 24 }, () => 75)
  }
};

describe('WeatherStation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockWeatherData)
    });
  });

  it('renders loading state initially', () => {
    render(<WeatherStation />);
    expect(screen.getByText('Loading weather data...')).toBeInTheDocument();
  });

  it('renders the weather station title', async () => {
    render(<WeatherStation />);
    await waitFor(() => {
      expect(screen.getByText('San Jose Weather Forecast')).toBeInTheDocument();
    });
  });

  it('fetches and displays weather data', async () => {
    render(<WeatherStation />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.open-meteo.com')
      );
    });

    // Wait for the data to be displayed
    await waitFor(() => {
      expect(screen.getByText('San Jose Weather Forecast')).toBeInTheDocument();
    });
  });

  it('handles refresh button click', async () => {
    render(<WeatherStation />);
    
    // Wait for initial render to complete
    await waitFor(() => {
      expect(screen.getByText('San Jose Weather Forecast')).toBeInTheDocument();
    });

    // Find and click the refresh button
    const refreshButton = screen.getByText('Refresh Data');
    await act(async () => {
      fireEvent.click(refreshButton);
    });

    // Verify that fetch was called twice (initial + refresh)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
}); 