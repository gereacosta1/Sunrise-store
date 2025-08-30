# Sunrise Store - E-commerce de Movilidad Eléctrica

Una tienda online moderna para scooters y motocicletas eléctricas con integración completa de Affirm para financiamiento.

## 🚀 Características

- **Diseño moderno**: Paleta de colores naranja (65%) y blanco (35%)
- **Carrito funcional**: Persistencia en localStorage, gestión completa de productos
- **Integración Affirm**: Financiamiento completo con sandbox/producción
- **React Router**: Navegación SPA con rutas dinámicas
- **Responsive**: Optimizado para todos los dispositivos
- **Accesibilidad**: Cumple estándares WCAG con navegación por teclado

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build**: Vite
- **Deployment**: Netlify (con funciones serverless)
- **Payments**: Affirm API v2

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.tsx      # Navegación principal
│   ├── CartDrawer.tsx  # Carrito lateral
│   ├── HeroSection.tsx # Sección hero
│   ├── ProductGrid.tsx # Grid de productos
│   └── ...
├── pages/              # Páginas principales
│   ├── HomePage.tsx    # Página principal
│   ├── ProductDetail.tsx # Detalle de producto
│   ├── ContactPage.tsx # Página de contacto
│   └── ...
├── context/            # Context providers
│   └── CartContext.tsx # Gestión del carrito
├── data/               # Datos estáticos
│   ├── products.json   # Catálogo de productos
│   └── products.ts     # Helpers de productos
└── types/              # Definiciones TypeScript
    ├── Product.ts      # Tipos de productos
    └── Cart.ts         # Tipos del carrito

netlify/functions/      # Funciones serverless
├── affirm-create-checkout.js # Crear checkout Affirm
└── affirm-capture.js        # Capturar pago Affirm
```

## 🌐 Rutas Disponibles

- `/` - Página principal con hero, catálogo, financiamiento y contacto
- `/producto/:slug` - Detalle de producto individual
- `/contacto` - Página de contacto completa
- `/financiamiento` - Información detallada de financiamiento
- `/orden-exitosa` - Confirmación de compra exitosa
- `/checkout-cancelado` - Página de checkout cancelado

## ⚙️ Variables de Entorno (Netlify)

Para que la integración con Affirm funcione correctamente, configura estas variables en tu panel de Netlify:

### Requeridas para Sandbox (Desarrollo/Testing):
```
AFFIRM_ENV=sandbox
AFFIRM_PUBLIC_KEY_SANDBOX=tu_public_key_sandbox
AFFIRM_PRIVATE_KEY_SANDBOX=tu_private_key_sandbox
```

### Requeridas para Producción:
```
AFFIRM_ENV=prod
AFFIRM_PUBLIC_KEY=tu_public_key_produccion
AFFIRM_PRIVATE_KEY=tu_private_key_produccion
```

## 🧪 Cómo Probar Affirm en Sandbox

1. **Configurar credenciales sandbox**:
   - Regístrate en [Affirm Sandbox](https://sandbox.affirm.com)
   - Obtén tus llaves públicas y privadas de sandbox
   - Configúralas en Netlify con `AFFIRM_ENV=sandbox`

2. **Flujo de prueba**:
   - Agrega productos al carrito
   - Haz clic en "Finalizar compra"
   - Se abrirá el modal de Affirm sandbox
   - Usa datos de prueba de Affirm para completar el flujo
   - Serás redirigido a `/orden-exitosa` con el `charge_id`

3. **Datos de prueba Affirm**:
   - Email: `test@example.com`
   - Teléfono: `555-555-5555`
   - SSN: `000-00-0000` (solo sandbox)

## 🚀 Deployment

### Netlify (Recomendado)

1. **Conecta tu repositorio** a Netlify
2. **Configura las variables de entorno** en Site Settings > Environment Variables
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Deploy**: Netlify detectará automáticamente las funciones en `/netlify/functions/`

### Variables de entorno en Netlify:
```
AFFIRM_ENV=sandbox  # o 'prod' para producción
AFFIRM_PUBLIC_KEY_SANDBOX=your_sandbox_public_key
AFFIRM_PRIVATE_KEY_SANDBOX=your_sandbox_private_key
```

## 🔧 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📋 Funcionalidades Implementadas

### ✅ Navegación
- [x] Header fijo con scroll suave a secciones
- [x] Botón "Contacto" funcional con aria-label
- [x] Navegación responsive con menú móvil
- [x] Focus visible en todos los elementos interactivos

### ✅ Productos
- [x] Grid de productos con datos desde JSON
- [x] Botón "Ver más" navega a `/producto/:slug`
- [x] Página de detalle con galería, specs y carrito
- [x] Hover effects con sombras naranjas

### ✅ Carrito de Compras
- [x] Context API con persistencia en localStorage
- [x] Drawer accesible (ESC cierra, focus trap)
- [x] Contador en navbar, gestión completa de cantidades
- [x] Integración con Affirm para checkout

### ✅ Hero Section
- [x] "Explora ahora" hace scroll a #catalog
- [x] "Conocer financiamiento" reemplaza "Ver video"
- [x] Botones con focus states y aria-labels

### ✅ Financiamiento
- [x] Botón "Ver opciones de pago" navega a página dedicada
- [x] Copy actualizado con términos de Affirm
- [x] Página completa con planes y beneficios

### ✅ Affirm Integration
- [x] Funciones serverless para crear checkout y capturar
- [x] Manejo de sandbox/producción
- [x] Redirecciones a success/cancel pages
- [x] Error handling robusto

### ✅ Accesibilidad
- [x] Aria-labels en botones críticos
- [x] Focus visible en todos los elementos
- [x] Navegación por teclado completa
- [x] Contraste de colores AA compliant

## 🎨 Paleta de Colores

- **Naranja Principal**: #FF6A00 (65% del diseño)
- **Naranjas Secundarios**: #FFA733, #FF944D, #FFB366
- **Blanco**: #FFFFFF (35% para contraste y espacios)
- **Grises**: Para texto y elementos neutros

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔒 Seguridad

- Validación de entrada en funciones serverless
- Manejo seguro de credenciales Affirm
- CORS configurado correctamente
- Sanitización de datos de usuario

---

**Nota**: Este proyecto está listo para producción. Solo necesitas configurar las credenciales de Affirm en las variables de entorno de Netlify para comenzar a procesar pagos reales.