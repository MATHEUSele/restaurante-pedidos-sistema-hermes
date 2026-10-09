import { render, screen } from '@testing-library/react';
import { RequireAuth } from '../app/components/RequireAuth';
import { describe, it, expect, vi } from 'vitest';
import { useSession } from 'next-auth/react';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

// Mock ToastContext
vi.mock('../app/context/ToastContext', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

describe('RequireAuth', () => {
  it('shows loading state initially', () => {
    (useSession as any).mockReturnValue({ data: null, status: 'loading' });
    render(<RequireAuth><div data-testid="child" /></RequireAuth>);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('renders children if authenticated and no roles are required', () => {
    (useSession as any).mockReturnValue({ 
      data: { user: { name: 'Test' } }, 
      status: 'authenticated' 
    });
    render(<RequireAuth><div data-testid="child">Content</div></RequireAuth>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders children if authenticated and role matches', () => {
    (useSession as any).mockReturnValue({ 
      data: { user: { perfil: 'ADM' } }, 
      status: 'authenticated' 
    });
    render(<RequireAuth allowedRoles={['ADM']}><div data-testid="child">Content</div></RequireAuth>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
