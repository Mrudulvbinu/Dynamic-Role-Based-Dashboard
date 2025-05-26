import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';
import '@testing-library/jest-dom/extend-expect';

describe('Login Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with all elements', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    expect(screen.getByText('CABOT HOSPITAL')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('updates username and password fields', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpass');
  });

  test('toggles password visibility', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
    
    // Password should be hidden by default
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click to hide password again
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('shows error on invalid credentials', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(loginButton);
    
    expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('calls onLogin with correct role on successful login', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    // Test with admin credentials
    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(loginButton);
    
    expect(mockOnLogin).toHaveBeenCalledWith('admin');
    expect(screen.queryByText('Invalid username or password')).not.toBeInTheDocument();
  });

  test('handles login on Enter key press', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    
    fireEvent.change(usernameInput, { target: { value: 'doctor' } });
    fireEvent.change(passwordInput, { target: { value: 'doctor123' } });
    fireEvent.keyUp(passwordInput, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnLogin).toHaveBeenCalledWith('doctor');
  });

  test('disables login button when fields are empty', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeDisabled();
    
    const usernameInput = screen.getByLabelText('Username');
    fireEvent.change(usernameInput, { target: { value: 'test' } });
    
    // Still disabled because password is empty
    expect(loginButton).toBeDisabled();
    
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    
    // Now enabled
    expect(loginButton).not.toBeDisabled();
  });
});