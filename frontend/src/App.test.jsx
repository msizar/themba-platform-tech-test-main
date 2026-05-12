import { describe, it, expect } from 'vitest';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import App from './App.jsx';

describe('App Component - Form Validation', () => {
  it('renders the form', () => {
    render(<App />);
    expect(screen.getByText('Submit Your Work')).toBeInTheDocument();
  });

  it('shows error when name is empty', async () => {
    render(<App />);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  it('shows error when message is too short', async () => {
    render(<App />);
    const nameInput = screen.getByPlaceholderText('John Doe');
    const messageInput = screen.getByPlaceholderText('Tell us about your work...');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(messageInput, { target: { value: 'Short' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Description must be at least 10 characters'),
      ).toBeInTheDocument();
    });
  });

  it('clears errors when user types in field', async () => {
    render(<App />);
    const nameInput = screen.getByPlaceholderText('John Doe');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    fireEvent.change(nameInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    });
  });
});
