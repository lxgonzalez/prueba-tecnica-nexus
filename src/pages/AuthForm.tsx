import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAuthForm } from '../hooks/useAuthForm';
import { AuthInputField } from '../components/AuthInputField';

export function AuthForm() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const { signIn, signUp, authLoading, handleGoogleSignIn } = useAuth();
    const { form, errors, handleChange, validateForm, resetForm } = useAuthForm();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!validateForm(isSignUp)) {
            return;
        }

        try {
            if (isSignUp) {
                const { error } = await signUp(form.email, form.password);
                if (error) {
                    setMessage({ type: 'error', text: error.message });
                } else {
                    setMessage({
                        type: 'success',
                        text: 'Cuenta creada. Revisa tu email para confirmar.'
                    });
                    resetForm();
                }
            } else {
                const { error } = await signIn(form.email, form.password);
                if (error) {
                    setMessage({ type: 'error', text: error.message });
                }
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Ocurrió un error inesperado'
            });
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        resetForm();
        setMessage(null);
    };

    return (
        <div className="max-w-md w-6xl p-6 bg-surface rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h1>

            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'error'
                    ? 'bg-error/10 border border-error text-error'
                    : 'bg-success/10 border border-success text-success'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <AuthInputField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    error={errors.email}
                    onChange={handleChange}
                />

                <AuthInputField
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={form.password}
                    error={errors.password}
                    onChange={handleChange}
                />

                {isSignUp && (
                    <AuthInputField
                        label="Confirmar Contraseña"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        error={errors.confirmPassword}
                        onChange={handleChange}
                    />
                )}

                <button
                    type="submit"
                    disabled={authLoading}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${authLoading
                        ? 'bg-muted text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                        }`}
                >
                    {authLoading
                        ? 'Procesando...'
                        : isSignUp
                            ? 'Crear Cuenta'
                            : 'Iniciar Sesión'
                    }
                </button>
            </form>
            <div className="mt-6 text-center text-gray-700">
                <span className="text-base">Inicia con</span>
                <button
                    onClick={() => handleGoogleSignIn()}
                    className="ml-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                    aria-label="Iniciar sesión con Google"
                >
                    Google
                </button>
            </div>


            <div className="mt-4 text-center">
                <button
                    onClick={toggleMode}
                    className="text-primary/30 hover:text-primary/80 text-sm font-medium"
                >
                    {isSignUp
                        ? '¿Ya tienes cuenta? Inicia sesión'
                        : '¿No tienes cuenta? Regístrate'
                    }
                </button>
            </div>
        </div>
    );
}