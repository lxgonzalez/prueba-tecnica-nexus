import { useState } from "react";
import type { Producto } from "../types/Product";

interface FormData {
    nombre: string;
    productos: string;
    productId: string;
    precio: string;
    phone: string;
}

export function useForm() {
    const [form, setForm] = useState<FormData>({
        nombre: "",
        productos: "",
        productId: "",
        precio: "",
        phone: "",
    });

    const isFormValid =
        form.nombre.trim() !== "" &&
        form.phone.trim() !== "" &&
        form.productos.trim() !== "" &&
        form.productId.trim() !== "" &&
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
            productId: producto.id,
            precio: producto.price.toString(),
        }));
    };

    const resetForm = () => {
        setForm({ nombre: "", productos: "", productId: "", precio: "", phone: "" });
    };

    return {
        form,
        isFormValid,
        handleChange,
        handleProductSelect,
        resetForm,
    };
}