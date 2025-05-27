import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useMediaQuery } from '@mui/material';
import Dashboard from '../components/Dashboard';

// Mock child components
jest.mock('../components/widgets/StatusCard', () => () => <div>StatusCard</div>);
jest.mock('../components/widgets/ChartWidget', () => () => <div>ChartWidget</div>);
jest.mock('../components/widgets/ActivityTable', () => () => <div>ActivityTable</div>);
jest.mock('../components/widgets/LabResultsPie', () => () => <div>LabResultsPie</div>);
jest.mock('../components/widgets/LabTrendsBar', () => () => <div>LabTrendsBar</div>);

// Mock useRolePermissions hook
jest.mock('../hooks/useRolePermissions', () => () => [
  { id: '1', name: 'Status', type: 'status', config: {} },
  { id: '2', name: 'Chart', type: 'chart' },
  { id: '3', name: 'Activity', type: 'activity' },
  { id: '4', name: 'Lab Pie', type: 'labPie' },
  { id: '5', name: 'Lab Bar', type: 'labBar' }
]);

// Mock MUI's useMediaQuery
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(),
}));

describe('Dashboard Component', () => {
  const mockOnLogout = jest.fn();
  
  beforeEach(() => {
    useMediaQuery.mockImplementation(() => false); // Desktop by default
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
  });

  test('renders dashboard with correct title', () => {
    render(<Dashboard role="admin" onLogout={mockOnLogout} />);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  test('renders all navigation elements', () => {
    render(<Dashboard role="admin" onLogout={mockOnLogout} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Widgets')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('switches between dashboard and settings tabs', async () => {
    render(<Dashboard role="admin" onLogout={mockOnLogout} />);
    
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByText('Application settings will appear here')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Dashboard'));
    expect(screen.queryByText('Application settings will appear here')).not.toBeInTheDocument();
  });

  test('calls onLogout when logout button is clicked', () => {
    render(<Dashboard role="admin" onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByText('Logout'));
    expect(mockOnLogout).toHaveBeenCalled();
  });

  test('shows mobile drawer when menu button is clicked', () => {
    useMediaQuery.mockImplementation(() => true); // Mobile view
    render(<Dashboard role="admin" onLogout={mockOnLogout} />);
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});