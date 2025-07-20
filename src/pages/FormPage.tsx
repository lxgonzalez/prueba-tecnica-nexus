import { InputField } from "../components/InputField";
import { useProducts } from "../hooks/useProducts";
import { ComboBox } from "../components/ComboBox";
import type { Producto } from "../types/Product";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { initialOptions } from "../service/paypalClient";
import { useForm } from "../hooks/useForm";
import { PayPalButton } from "../components/PaypalButton";
import { ProductLabel } from "../components/ProductLabel";

export function FormPage() {
    const { productos, loading, error } = useProducts();
    const { form, isFormValid, handleChange, handleProductSelect } = useForm();

    return (
        <PayPalScriptProvider options={initialOptions}>
            <form className="max-w-md w-6xl p-6 bg-surface rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Formulario Compra Fácil
                </h1>

                <InputField
                    label="Nombre Completo"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                />

                <ComboBox<Producto>
                    name="producto"
                    data={productos}
                    searchKey="title"
                    renderItem={(p) => <>{p.title}</>}
                    onSelect={handleProductSelect}
                    label={<ProductLabel loading={loading} error={!!error} />}
                />

                <InputField
                    label="Precio"
                    name="precio"
                    value={form.precio}
                    onChange={handleChange}
                />

                <PayPalButton
                    isFormValid={isFormValid}
                    precio={form.precio}
                />
            </form>
        </PayPalScriptProvider>
    );
}
