import { useState } from 'react';

interface AuthFormData {
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
}

export function useAuthForm() {
    const [form, setForm] = useState<AuthFormData>({
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });
    const [errors, setErrors] = useState<Partial<AuthFormData>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // Limpiar errores al escribir
        if (errors[name as keyof AuthFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (isSignUp: boolean) => {
        const newErrors: Partial<AuthFormData> = {};

        if (!form.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!form.password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        } else if (form.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (isSignUp) {
            if (!form.phone.trim()) {
                newErrors.phone = 'El teléfono es requerido';
            } else if (!/^\+?[\d\s\-\(\)]{8,15}$/.test(form.phone.replace(/\s/g, ''))) {
                newErrors.phone = 'Formato de teléfono inválido (8-15 dígitos)';
            }

            if (!form.confirmPassword.trim()) {
                newErrors.confirmPassword = 'Confirma tu contraseña';
            } else if (form.password !== form.confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setForm({ email: '', password: '', confirmPassword: '', phone: '' });
        setErrors({});
    };

    return {
        form,
        errors,
        handleChange,
        validateForm,
        resetForm,
    };
}