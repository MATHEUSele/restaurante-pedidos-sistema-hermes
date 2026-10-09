import { renderHook, waitFor } from '@testing-library/react';
import { usePedidosApi } from '../app/hooks/usePedidosApi';
import { describe, it, expect, vi, beforeEach } from 'vitest';

global.fetch = vi.fn();

describe('usePedidosApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('should initialize with empty array and fetch data', async () => {
    const mockData = [{ id: '1', status: 'NOVO', total: 10 }];
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => usePedidosApi());

    expect(result.current.pedidos).toEqual([]);
    
    await waitFor(() => {
      expect(result.current.pedidos).toEqual(mockData);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should use localStorage cache if available', async () => {
    const mockData = [{ id: '2', status: 'PRONTO', total: 20 }];
    localStorage.setItem('pedidosCache_all_all', JSON.stringify(mockData));

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => usePedidosApi());

    // Should immediately have cached data
    expect(result.current.pedidos).toEqual(mockData);
  });
});
