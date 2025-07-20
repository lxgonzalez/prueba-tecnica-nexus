import { useAuth } from './hooks/useAuth'
import { AuthForm } from './pages/AuthForm'
import { FormPage } from './pages/FormPage'
import { LogoutButton } from './components/LogoutButton'
import ComprasPage from './pages/ComprasPage'

export default function App() {
  const { session, user, loading } = useAuth()

  const isAdmin = user?.email === 'admin@gmail.com';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-500 to-blue-300 flex items-center justify-center">
        <AuthForm />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-900 via-blue-500 to-blue-300">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-surface">
            Bienvenido, {user?.email}
          </h2>
          {isAdmin && (
            <span className="inline-block mt-1 px-3 py-1 bg-yellow-500 text-yellow-900 text-xs font-medium rounded-full">
              Administrador
            </span>
          )}
        </div>
        <LogoutButton />
      </div>

      <div className='flex flex-col justify-center items-center'>
        {isAdmin ? (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Panel de Administración
              </h1>
              <p className="text-blue-100">
                Gestiona todas las compras realizadas en la plataforma
              </p>
            </div>
            <ComprasPage />
          </>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Tienda Nexus Soluciones
              </h1>
              <p className="text-blue-100">
                Realiza tu compra de forma rápida y segura
              </p>
            </div>
            <FormPage />
          </>
        )}
      </div>
    </div>
  )
}