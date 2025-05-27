import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/Login';

describe('Login Component', () => {
  const mockOnLogin = jest.fn();
  
  beforeEach(() => {
    render(<Login onLogin={mockOnLogin} />);
  });

  test('renders login form with all elements', () => {
    expect(screen.getByText('CABOT HOSPITAL')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /LOGIN/i })).toBeInTheDocument();
  });

  test('updates username and password fields', async () => {
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    
    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'testpass');
    
    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('testpass');
  });

  test('toggles password visibility', async () => {
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { 
      name: /toggle password visibility/i 
    });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('shows error on invalid credentials', async () => {
    await userEvent.type(screen.getByLabelText('Username'), 'wronguser');
    await userEvent.type(screen.getByLabelText('Password'), 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: /LOGIN/i }));
    
    expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('calls onLogin with correct role on successful login', async () => {
    await userEvent.type(screen.getByLabelText('Username'), 'admin');
    await userEvent.type(screen.getByLabelText('Password'), 'admin123');
    await userEvent.click(screen.getByRole('button', { name: /LOGIN/i }));
    
    expect(mockOnLogin).toHaveBeenCalledWith('admin');
  });

  test('disables login button when fields are empty', () => {
    expect(screen.getByRole('button', { name: /LOGIN/i })).toBeDisabled();
  });

  test('enables login button when both fields have values', async () => {
    await userEvent.type(screen.getByLabelText('Username'), 'user');
    await userEvent.type(screen.getByLabelText('Password'), 'pass');
    expect(screen.getByRole('button', { name: /LOGIN/i })).toBeEnabled();
  });
});