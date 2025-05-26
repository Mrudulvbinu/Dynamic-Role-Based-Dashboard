import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import '@testing-library/jest-dom/extend-expect';

// Mock the useRolePermissions hook
jest.mock('../hooks/useRolePermissions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock child components
jest.mock('./widgets/StatusCard', () => () => <div>StatusCard</div>);
jest.mock('./widgets/ChartWidget', () => () => <div>ChartWidget</div>);
jest.mock('./widgets/ActivityTable', () => () => <div>ActivityTable</div>);
jest.mock('./widgets/LabResultsPie', () => () => <div>LabResultsPie</div>);
jest.mock('./widgets/LabTrendsBar', () => () => <div>LabTrendsBar</div>);

describe('Dashboard Component', () => {
  const mockRole = 'admin';
  const mockOnLogout = jest.fn();
  
  const mockWidgets = [
    { id: 1, name: 'Status Widget', type: 'status', config: {} },
    { id: 2, name: 'Chart Widget', type: 'chart' },
    { id: 3, name: 'Activity Widget', type: 'activity' },
    { id: 4, name: 'Lab Pie Widget', type: 'labPie' },
    { id: 5, name: 'Lab Bar Widget', type: 'labBar' },
  ];

  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    
    // Mock useRolePermissions to return our test widgets
    require('../hooks/useRolePermissions').default.mockReturnValue(mockWidgets);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with correct title', () => {
    render(<Dashboard role={mockRole} onLogout={mockOnLogout} />);
    expect(screen.getByText(`${mockRole.charAt(0).toUpperCase() + mockRole.slice(1)} Dashboard`)).toBeInTheDocument();
  });

  test('displays widgets menu when clicked', async () => {
    render(<Dashboard role={mockRole} onLogout={mockOnLogout} />);
    
    const widgetsButton = screen.getByText('Widgets');
    fireEvent.click(widgetsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Select Widgets')).toBeInTheDocument();
    });
    
    mockWidgets.forEach(widget => {
      expect(screen.getByText(widget.name)).toBeInTheDocument();
    });
  });

  test('toggles widget selection', async () => {
    render(<Dashboard role={mockRole} onLogout={mockOnLogout} />);
    
    const widgetsButton = screen.getByText('Widgets');
    fireEvent.click(widgetsButton);
    
    await waitFor(() => {
      const firstWidgetCheckbox = screen.getAllByRole('checkbox')[0];
      expect(firstWidgetCheckbox).toBeChecked();
      fireEvent.click(firstWidgetCheckbox);
      expect(firstWidgetCheckbox).not.toBeChecked();
    });
  });

  test('calls onLogout when logout button is clicked', () => {
    render(<Dashboard role={mockRole} onLogout={mockOnLogout} />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    expect(mockOnLogout).toHaveBeenCalled();
  });

  test('switches between dashboard and settings tabs', () => {
    render(<Dashboard role={mockRole} onLogout={mockOnLogout} />);
    
    const settingsTab = screen.getByText('Settings');
    fireEvent.click(settingsTab);
    
    expect(screen.getByText('Application settings will appear here')).toBeInTheDocument();
    
    const dashboardTab = screen.getByText('Dashboard');
    fireEvent.click(dashboardTab);
    
    expect(screen.queryByText('Application settings will appear here')).not.toBeInTheDocument();
  });

  test('handles mobile drawer toggle', () => {
    // Mock mobile view
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: true, // mobile view
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    render(<Dashboard role={mockRole} onLogout={mockOnLogout} />);
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    // Check if drawer is open by looking for content that should be visible
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});