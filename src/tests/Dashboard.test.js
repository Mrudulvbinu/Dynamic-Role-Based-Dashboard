import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

test('renders only admin widgets for admin role', () => {
  render(<Dashboard role="admin" />);
  expect(screen.getByText('Billing')).toBeInTheDocument();
  expect(screen.queryByText('Lab Results')).not.toBeInTheDocument();
});