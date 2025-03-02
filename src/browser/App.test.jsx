// App.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

import * as useFetchModule from '../shared/Hooks/useFetch';

// Mock the custom hook
jest.mock('../shared/Hooks/useFetch');

describe('Frontend Assignment', () => {
  const mockProjects = [
    { "s.no": 0, percentageFunded: 186, amountPledged: 15283 },
    { "s.no": 1, percentageFunded: 124, amountPledged: 12400 },
    { "s.no": 2, percentageFunded: 210, amountPledged: 21000 },
    { "s.no": 3, percentageFunded: 150, amountPledged: 15000 },
    { "s.no": 4, percentageFunded: 175, amountPledged: 17500 },
    { "s.no": 5, percentageFunded: 130, amountPledged: 13000 },
    { "s.no": 6, percentageFunded: 190, amountPledged: 19000 },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    useFetchModule.default.mockReturnValue([[], true, null]);
    
    render(<App />);
    
    expect(screen.getByText('Loading projects...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveClass('loading');
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to fetch data';
    useFetchModule.default.mockReturnValue([[], false, errorMessage]);
    
    render(<App />);
    
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('error');
  });

  it('renders table with correct data', () => {
    useFetchModule.default.mockReturnValue([mockProjects, false, null]);
    
    render(<App />);
    
    // Check header is rendered
    expect(screen.getByText('Funding Information')).toBeInTheDocument();
    
    // Check table headers
    expect(screen.getByText('S.No.')).toBeInTheDocument();
    expect(screen.getByText('Percentage funded')).toBeInTheDocument();
    expect(screen.getByText('Amount pledged')).toBeInTheDocument();
    
    // First 5 items should be visible (due to pagination)
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('186')).toBeInTheDocument();
    expect(screen.getByText('15283')).toBeInTheDocument();
    
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('175')).toBeInTheDocument();
    expect(screen.getByText('17500')).toBeInTheDocument();
    
    // 6th item should not be visible
    expect(screen.queryByText('5')).not.toBeInTheDocument();
    expect(screen.queryByText('190')).not.toBeInTheDocument();
  });
  
  it('pagination works correctly', async () => {
    useFetchModule.default.mockReturnValue([mockProjects, false, null]);
    
    render(<App />);
    
    // Test initial page state
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeDisabled();
    
    // Go to next page
    fireEvent.click(screen.getByText('Next'));
    
    // Check page 2 content
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('190')).toBeInTheDocument();
    expect(screen.getByText('19000')).toBeInTheDocument();
    
    // Previous button should be enabled now
    expect(screen.getByText('Previous')).not.toBeDisabled();
    
    // Next button should be disabled on last page
    expect(screen.getByText('Next')).toBeDisabled();
    
    // Go back to previous page
    fireEvent.click(screen.getByText('Previous'));
    
    // Should be on page 2 again
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  test('renders no data message when response is empty', () => {
    useFetchModule.default.mockReturnValue([[], false, null]);
    
    render(<App />);
    
    expect(screen.getByText('No projects found')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument(); // Pagination should not be shown
  });
});