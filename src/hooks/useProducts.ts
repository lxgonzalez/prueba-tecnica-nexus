import { useEffect, useState } from "react";
import { supabase } from "../service/supabaseClient";
import type { Producto } from "../types/Product";

export function useProducts() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductos = async () => {
            setLoading(true);
            const { data, error } = await supabase.from("productos").select("*");
            if (error) {
                setError(error.message);
            } else {
                setProductos(data);
            }
            setLoading(false);
        };

        fetchProductos();
    }, []);

    return { productos, loading, error };
}
