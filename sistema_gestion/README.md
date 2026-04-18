# Arquitectura Modular - Panel Médico

## Refactorización Completada ✓

El archivo monolítico `admin.html` (1350 líneas) ha sido dividido en **módulos independientes** que se comunican mediante navegación con `href`.

---

## Estructura de Archivos

```
sistema/
├── estilos.css              ← CSS compartido para todas las vistas (27 KB)
├── login.html               ← Vista de autenticación (2.7 KB)
├── dashboard.html           ← Vista de gestión de pacientes (8.1 KB)
├── detalle-paciente.html    ← Vista de ficha del paciente (12 KB)
└── nueva-consulta.html      ← Formulario de nueva consulta (6 KB)
```

## Módulos

### 1. **login.html** (Módulo de Autenticación)
- **Propósito**: Pantalla de login para acceder al panel
- **Características**:
  - Validación visual de email/contraseña
  - Toggle de visibilidad de contraseña
  - Animaciones de entrada (fadeUp)
- **Navegación**: → `dashboard.html`
- **Estilos**: `.left`, `.right`, `.form-*`, `.eye-btn`, `@keyframes fadeUp`

### 2. **dashboard.html** (Panel Principal)
- **Propósito**: Gestión y visualización de pacientes
- **Características**:
  - Sidebar de navegación
  - Estadísticas en tiempo real (4 stat cards)
  - Tabla de pacientes con filtros
  - Búsqueda y clasificación
- **Navegación**: 
  - → `detalle-paciente.html` (clic en fila o botón "Ver ficha")
  - → `nueva-consulta.html` (botón "Nuevo paciente")
- **Estilos**: `.sidebar*`, `.topbar*`, `.stats-*`, `.table-*`, `.filter-*`

### 3. **detalle-paciente.html** (Ficha del Paciente)
- **Propósito**: Vista detallada del histórico y tratamientos
- **Características**:
  - Información personal en sidebar
  - Tabs: Tratamientos / Antes & Después
  - Galería de fotos (antes/después)
  - Historial de tratamientos
  - Historia clínica con consultas registradas
- **Navegación**:
  - → `dashboard.html` (breadcrumb/volver)
  - → `nueva-consulta.html` (botón "Nuevo turno" / "Nueva Consulta")
- **Estilos**: `.patient-*`, `.gallery-*`, `.historial-*`, `.consulta-*`

### 4. **nueva-consulta.html** (Formulario de Consulta)
- **Propósito**: Registrar nueva consulta/turno
- **Características**:
  - Selector de tipo de consulta (Clínica / Estética)
  - Formulario de información: Motivo, Diagnóstico, Examen Físico, Tratamiento
  - Carga de fotos del procedimiento
  - Selector visual con estados `selected-dorado` y `selected-rosa`
- **Navegación**:
  - → `detalle-paciente.html` (volver/cancelar/guardar)
- **Estilos**: `.tipo-*`, `.form-field`, `.upload-*`, `.btn-cancel`, `.btn-save`

### 5. **estilos.css** (Sistema de Estilos)
- **Variables CSS compartidas**: Colores, tipografía, espaciados
- **Design Tokens**:
  - **Colores**: `--rosa`, `--dorado`, `--negro`, `--gris`, `--blanco`
  - **Tipografía**: `--mont` (Montserrat), `--serif` (Cormorant Garamond)
- **Componentes reutilizables**: Botones, badges, inputs, tarjetas, etc.
- **Animaciones**: `fadeUp` para efectos de entrada

---

## Navegación (Flujo)

```
login.html
    ↓ (click "Iniciar sesión")
dashboard.html
    ├→ detalle-paciente.html (click row o "Ver ficha")
    │   ├→ nueva-consulta.html ("Nuevo turno")
    │   │   └→ detalle-paciente.html (volver/guardar)
    │   └→ dashboard.html (breadcrumb)
    └→ nueva-consulta.html ("Nuevo paciente")
        └→ detalle-paciente.html (volver/guardar)
```

---

## Ventajas de la Refactorización

| Característica | Antes | Después |
|---|---|---|
| **Tamaño de archivo** | 1350 líneas en 1 archivo | 4 módulos de 2.7–12 KB |
| **Navegación** | JavaScript SPA (`navigateTo()`) | URLs naturales (`href`) |
| **Caché del navegador** | Todo recargado cada vez | Cada módulo cacheado independientemente |
| **Mantenimiento** | Difícil de escalar | Fácil de actualizar módulos aisladamente |
| **Rendimiento inicial** | 1 descarga grande | Descarga progresiva |
| **SEO** | No indexable | Cada URL es indexable |

---

## Cómo Usar

1. **Abrir el app**:
   ```
   file:///path/to/sistema/login.html
   ```

2. **Credenciales demo**:
   - Email: `dra.nancy@clinica.com`
   - Contraseña: `••••••••` (cualquier valor, no hay validación server)

3. **Navegar**:
   - Botones usan `onclick="window.location.href='archivo.html'"`
   - Enlaces usan `<a onclick="window.location.href='archivo.html'">`

---

## Próximas Mejoras Sugeridas

1. **Backend Integration**:
   - Conectar con API para autenticación real
   - Cargar pacientes desde base de datos
   - Persistir formularios

2. **Router SPA (Opcional)**:
   - Implementar router JavaScript para mantener estado sin recargar
   - Usar `history.pushState()` para URLs limpias

3. **Almacenamiento Local**:
   - `localStorage` para persistir datos del formulario
   - Caché de pacientes para offline mode

4. **Validación de Formularios**:
   - Validar inputs antes de enviar
   - Mensajes de error/éxito

5. **Pruebas**:
   - Tests E2E con Cypress/Playwright
   - Tests unitarios de componentes

---

## Archivos Eliminados

- ✗ `admin.html` (consolidado y dividido)

## Archivos Conservados (Compatibilidad)

Los siguientes archivos originales se mantienen para compatibilidad o referencia:
- `menu.html` (sitio público, no modificado)
- `loginAdmin.html` (referencia)
- `dashboardPaciente.html` (referencia)
- `detallePaciente.html` (referencia)
- `nuevaConsulta.html` (referencia)

---

## Variables CSS Disponibles

```css
:root {
  --rosa: #FFB6D9;
  --rosa-light: #FFD6EC;
  --rosa-pale: #FFF0F7;
  --rosa-mid: #F590C4;
  
  --dorado: #D4AF37;
  --dorado-light: #E8D080;
  --dorado-pale: #FBF6E3;
  
  --negro: #1A1A1A;
  --negro-mid: #2E2E2E;
  
  --gris: #6B6B6B;
  --gris-light: #A8A8A8;
  --gris-bg: #F7F6F3;
  
  --blanco: #FFFFFF;
  --crema: #FDFAF6;
  --borde: #F0EBE3;
  --borde-gris: #E8E4DF;
  
  --mont: 'Montserrat', sans-serif;
  --serif: 'Cormorant Garamond', Georgia, serif;
}
```

---

**Generado**: Refactorización completada  
**Arquitectura**: Modular con navegación basada en href  
**Estado**: Listo para desarrollo y personalización
