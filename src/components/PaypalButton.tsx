import { PayPalButtons } from "@paypal/react-paypal-js";
import { usePayPal } from "../hooks/usePayPal";

interface PayPalWrapperProps {
    isFormValid: boolean;
    precio: string;
}

export function PayPalButton({ isFormValid, precio }: PayPalWrapperProps) {
    const { createOrder, onApprove, onError } = usePayPal();

    return (
        <div className={`transition-opacity duration-300 ${!isFormValid ? "opacity-50 pointer-events-none" : ""}`}>
            <PayPalButtons
                disabled={!isFormValid}
                fundingSource="paypal"
                style={{ layout: "vertical", color: "black", shape: 'pill', label: 'pay' }}
                createOrder={createOrder(precio)}
                onApprove={onApprove}
                onError={onError}
            />
        </div>
    );
}