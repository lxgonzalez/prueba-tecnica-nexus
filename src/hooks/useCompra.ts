import { useState, useCallback } from 'react';
import { supabase } from '../service/supabaseClient';
import type { Compra, UpdateCompraData } from '../types/Compra';

export function useCompra() {
    const [compras, setCompras] = useState<Compra[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const withLoading = async <T>(fn: () => Promise<T>): Promise<T | null> => {
        setLoading(true);
        setError(null);
        try {
            const result = await fn();
            setLoading(false);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            setLoading(false);
            return null;
        }
    };

    const createCompra = useCallback(async (compraData: Compra) =>

        withLoading(async () => {
            console.log('Creating compra:', compraData)

            const { data, error } = await supabase.
                from('compra')
                .insert([compraData])
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data as Compra;
        }), []);

    const getAllCompras = useCallback(async () =>
        withLoading(async () => {
            const { data, error } = await supabase
                .from('compra')
                .select(`
        *,
        productos (
          id,
          title,
          price,
          description
        )
      `)
                .order('fecha', { ascending: false });

            if (error) throw new Error(error.message);
            setCompras(data || []);
            return data || [];
        }), []);


    const updateCompra = useCallback(async (compraId: string, updateData: UpdateCompraData) =>
        withLoading(async () => {
            const { error } = await supabase.from('compra').update(updateData).eq('id', compraId);
            if (error) throw new Error(error.message);
            setCompras(prev => prev.map(c => (c.id === compraId ? { ...c, ...updateData } : c)));
            return true;
        }), []);

    const markAsPaid = useCallback((compraId: string, paypalTransactionId: string) =>
        updateCompra(compraId, { estado: 'pagado', paypal_transaction_id: paypalTransactionId }), [updateCompra]);

    const getCompraById = useCallback(async (compraId: string) =>
        withLoading(async () => {
            const { data, error } = await supabase
                .from('compra')
                .select(`
          *,
          productos (id, title, price, description)
        `)
                .eq('id', compraId)
                .single();
            if (error) throw new Error(error.message);
            return data as Compra;
        }), []);

    return {
        compras,
        loading,
        error,
        createCompra,
        getAllCompras,
        updateCompra,
        getCompraById,
        markAsPaid,
        clearError: () => setError(null),
    };
}
