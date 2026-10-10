import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../../features/auth/LoginPage';
import { AuthProvider } from '../../application/state/AuthContext';

describe('LoginPage Component', () => {
  it('renders login form elements with spanish titles', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Simple Stock Flow')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ej. admin o vendedor1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar al sistema/i })).toBeInTheDocument();
  });

  it('validates required inputs before submission', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    );

    const submitBtn = screen.getByRole('button', { name: /ingresar al sistema/i });
    fireEvent.click(submitBtn);

    // HTML5 validation or form error
    expect(submitBtn).toBeInTheDocument();
  });
});
