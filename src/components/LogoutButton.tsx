import { useAuth } from '../hooks/useAuth';

export function LogoutButton() {
    const { signOut, authLoading } = useAuth();

    const handleLogout = async () => {
        console.log('Cerrando sesión...');
        await signOut();
    };

    return (
        <button
            onClick={handleLogout}
            disabled={authLoading}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${authLoading
                ? 'bg-muted text-gray-500 cursor-not-allowed'
                : 'bg-error text-white hover:bg-error/90 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2'
                }`}
        >
            {authLoading ? 'Cerrando...' : 'Cerrar Sesión'}
        </button>
    );
}