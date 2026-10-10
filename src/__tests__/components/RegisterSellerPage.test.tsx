import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterSellerPage } from '../../features/users/RegisterSellerPage';
import { userService } from '../../infrastructure/services/UserService';

describe('RegisterSellerPage Component', () => {
  it('renders registration form and DP-04 policy reminder', () => {
    render(<RegisterSellerPage />);

    expect(screen.getByText('Alta de Nuevo Vendedor')).toBeInTheDocument();
    expect(screen.getByText(/Regla de negocio \(DP-04\):/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ej. carlos_vendedor')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar vendedor/i })).toBeInTheDocument();
  });

  it('submits form with username, password and explicit role seller', async () => {
    const registerSpy = vi.spyOn(userService, 'registerSeller').mockResolvedValueOnce();

    render(<RegisterSellerPage />);

    const usernameInput = screen.getByPlaceholderText('ej. carlos_vendedor');
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: /registrar vendedor/i });

    fireEvent.change(usernameInput, { target: { value: '  Carlos_Perez  ' } });
    fireEvent.change(passwordInput, { target: { value: 'Secret123!' } });
    fireEvent.change(confirmInput, { target: { value: 'Secret123!' } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(registerSpy).toHaveBeenCalledWith({
        username: 'carlos_perez',
        password: 'Secret123!',
        role: 'seller',
      });
    });

    expect(await screen.findByText(/registrado exitosamente/i)).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    render(<RegisterSellerPage />);

    const usernameInput = screen.getByPlaceholderText('ej. carlos_vendedor');
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: /registrar vendedor/i });

    fireEvent.change(usernameInput, { target: { value: 'carlos' } });
    fireEvent.change(passwordInput, { target: { value: 'Secret123!' } });
    fireEvent.change(confirmInput, { target: { value: 'DifferentPass' } });

    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
  });
});
