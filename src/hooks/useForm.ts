import { useState } from "react";
import type { Producto } from "../types/Product";

interface FormData {
    nombre: string;
    productos: string;
    precio: string;
}

export function useForm() {
    const [form, setForm] = useState<FormData>({
        nombre: "",
        productos: "",
        precio: ""
    });

    const isFormValid =
        form.nombre.trim() !== "" &&
        form.productos.trim() !== "" &&
        form.precio.trim() !== "" &&
        parseFloat(form.precio) > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleProductSelect = (producto: Producto) => {
        setForm((prev) => ({
            ...prev,
            productos: producto.title,
            precio: producto.price.toString(),
        }));
    };

    const resetForm = () => {
        setForm({ nombre: "", productos: "", precio: "" });
    };

    return {
        form,
        isFormValid,
        handleChange,
        handleProductSelect,
        resetForm,
    };
}