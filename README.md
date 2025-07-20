# 💳 Sistema de Compras Nexus - Prueba Técnica

Sistema completo de e-commerce con integración de pagos PayPal, notificaciones WhatsApp y panel administrativo desarrollado para Nexus Soluciones.
#### URL de prueba: https://prueba-tecnica-nexus.netlify.app/

## 📋 Instrucciones de la Prueba Técnica

### 1. 🛒 Simulación de compra
- ✅ **Página web con formulario**: nombre del cliente, producto, monto
- ✅ **Botón "Pagar"** integrado con PayPal

### 2. 💰 Simulación de integración de pago
- ✅ **Integración real con PayPal** (cuenta sandbox gratuita)
- ✅ **Estado del pago** guardado en base de datos (pagado/pendiente)
- ✅ **Base de datos Supabase** para persistencia

### 3. 🔧 Panel administrativo
- ✅ **Vista de compras** con todas las transacciones
- ✅ **Filtro por estado** (Todos, Pendientes, Pagados)
- ✅ **Descarga de reportes en PDF** con información detallada

### 4. 🎁 Bonus: Automatización por WhatsApp
- ✅ **Integración con Twilio** para envío automático de mensajes
- ✅ **Confirmación por WhatsApp** al completar el pago
- ✅ **Mensajes personalizados** con datos de la compra


## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS v4 con tema personalizado
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth con email y Google
- **Pagos**: PayPal SDK
- **Notificaciones**: Twilio API (WhatsApp)
- **PDFs**: jsPDF + autoTable

## ⚙️ Configuración del Proyecto Local

### Prerrequisitos
- Node.js 18+
- Cuenta Supabase
- Cuenta PayPal Developer (Sandbox)
- Cuenta Twilio (opcional para WhatsApp)

### Variables de Entorno
Crear archivo `.env` en la raíz:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_PAYPAL_CLIENT_ID=tu_paypal_client_id
VITE_TWILIO_ACCOUNT_SID=tu_twilio_account_sid
VITE_TWILIO_AUTH_TOKEN=tu_twilio_auth_token
VITE_TWILIO_PHONE_NUMBER=whatsapp:+123456789
```

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/lxgonzalez/prueba-tecnica-nexus.git
cd prueba-tecnica-nexus

# Instalar dependencias
npm install

# Configurar variables de entorno

# Ejecutar en desarrollo
npm run dev
```

### Configuración de Base de Datos (Supabase)

1. **Crear tabla `compra`**:
```sql

CREATE TABLE public.compra (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  fecha timestamp without time zone DEFAULT now(),
  total numeric NOT NULL,
  estado text DEFAULT 'pendiente'::text,
  telefono text NOT NULL,
  product_id uuid,
  paypal_transaction_id text,
  user_name text,
  CONSTRAINT compra_pkey PRIMARY KEY (id),
  CONSTRAINT compra_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.productos(id)
);
CREATE TABLE public.productos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  stock integer DEFAULT 0,
  image_url text,
  CONSTRAINT productos_pkey PRIMARY KEY (id)
);
```

### Configuración PayPal

1. Crear cuenta en [PayPal Developer](https://developer.paypal.com/)
2. Crear aplicación Sandbox
3. Obtener Client ID para sandbox
4. Agregar Client ID a `.env`

### Configuración Twilio (Opcional)

1. Crear cuenta en [Twilio](https://www.twilio.com/)
2. Configurar WhatsApp Sandbox
3. Obtener credenciales y agregar a `.env`

## 🏗️ Arquitectura del Proyecto
<img width="759" height="752" alt="image" src="https://github.com/user-attachments/assets/897bab4c-56ca-449b-af39-3ec3e79ede2e" />

## 📊 Testing y Uso

### 🌐 Demo en Vivo
**URL de prueba**: [https://prueba-tecnica-nexus.netlify.app/](https://prueba-tecnica-nexus.netlify.app/)

### 👨‍💼 Acceso al Panel Administrativo
- **Email**: admin@gmail.com
- **Contraseña**: admin123

### 🛍️ Usuario de Prueba para Compras
- **Email**: gerencia@solucionesnexus.com
- **Contraseña**: gerencia123
- **Alternativa**: Crear cuenta nueva con Google OAuth

### Datos de Prueba PayPal (Sandbox)
- **Email**: sb-u211244822245@personal.example.com
- **Contraseña**: ,!7xNcn<

### Flujo de Prueba Completo
1. **Acceder a la demo**: [prueba-tecnica-nexus.netlify.app](https://prueba-tecnica-nexus.netlify.app/)
2. **Para comprar**: 
   - Usar credenciales `gerencia@solucionesnexus.com` / `gerencia123`
   - O crear cuenta nueva con Google
3. **Completar formulario** de compra con datos reales
4. **Procesar pago** con credenciales PayPal Sandbox
5. **Verificar mensaje WhatsApp** (si está configurado)
6. **Acceder al panel admin** con `admin@gmail.com` / `admin123`
7. **Revisar compras** y usar filtros por estado
8. **Generar reporte PDF** con las compras filtradas


## 📞 Contacto

**Desarrollador**: Luis González  
**Email**: luisgx15@gmail.com
**GitHub**: [@lxgonzalez](https://github.com/lxgonzalez)

---

