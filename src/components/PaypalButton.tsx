import { PayPalButtons } from "@paypal/react-paypal-js";
import { usePayPal } from "../hooks/usePaypal";
import { useCompra } from "../hooks/useCompra";

interface PayPalFormData {
    phone: string;
    nombre: string;
    product_id: string;
    product_nombre: string;
    precio: string;
}

interface PayPalWrapperProps {
    isFormValid: boolean;
    precio: string;
    formData?: PayPalFormData;
    onPaymentSuccess?: () => void;
    onPaymentError?: (error: any) => void;
}

export function PayPalButton({
    isFormValid,
    precio,
    formData,
    onPaymentSuccess,
    onPaymentError,
}: PayPalWrapperProps) {
    const { createOrder, onApprove, onError } = usePayPal({
        onPaymentSuccess,
        onPaymentError,
        resetForm: onPaymentSuccess
    });
    const { createCompra, markAsPaid } = useCompra()

    return (
        <div className={`transition-opacity duration-300 ${!isFormValid ? "opacity-50 pointer-events-none" : ""}`}>
            <PayPalButtons
                disabled={!isFormValid}
                fundingSource="paypal"
                style={{ layout: "vertical", color: "black", shape: 'pill', label: 'pay' }}
                createOrder={createOrder(precio, formData, createCompra)}
                onApprove={(data, actions) => onApprove(data, actions, formData, markAsPaid)}
                onError={onError}
            />
        </div>
    );
}