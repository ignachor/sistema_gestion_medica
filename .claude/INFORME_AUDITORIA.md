# Informe de Auditoría del Prototipo — Sistema de Gestión Médica
**Fecha:** 23 de abril de 2026 | **Alcance:** Solo lectura, sin modificaciones

---

## Estado General

El prototipo es **100% frontend estático** (HTML/CSS/JS puro sin backend, sin base de datos, sin API). Todos los datos son mock hardcodeados. Es una maqueta de alta fidelidad visual, pero sin ninguna funcionalidad real de persistencia.

---

## Fallas Críticas por Pain Point

---

### Pain Point 1 — Fragmentación Operativa
**Objetivo:** Centralizar en una sola plataforma historia clínica, turnos, stock y multimedia.

**Falla crítica: Los datos están fragmentados dentro del propio prototipo.**

Existen **7 arrays de datos independientes y desconectados entre sí**:

| Archivo | Dato mockeado |
|---|---|
| `dashboard.js` | 15 pacientes |
| `detalle-paciente.html` | 4 consultas de María González |
| `nueva-consulta.js` | 6 pacientes (lista diferente al dashboard) |
| `calendario.js` | 11 turnos |
| `stock.html` | 8 productos de inventario |
| `estadisticas.html` | KPIs + insumos (objeto totalmente independiente) |
| `tratamiento.html` | ~20 tratamientos en HTML estático |

**Ejemplo concreto de ruptura:** El dashboard muestra "12 turnos hoy" hardcodeado en el HTML, sin ninguna conexión real con `turnos.html`. Si se crea un turno en la agenda, el número no cambia. Lo mismo ocurre con los insumos de estadísticas: son un array completamente separado del inventario de `stock.html`.

**Justificación para sprint:** Se necesita una capa de datos unificada (backend + base de datos) que sirva de fuente única de verdad para todas las páginas.

---

### Pain Point 2 — Manejo de Imágenes
**Objetivo:** Visualización nativa integrada a la historia clínica, sin Excel.

**Lo que existe:** La UI de galería está bien diseñada. Hay comparador lado a lado funcional visualmente, miniaturas antes/después en cada entrada de historia clínica, y sistema de consentimiento para portfolio.

**Falla crítica: Las fotos son placeholders de Unsplash. No existe flujo real de carga.**

- En `nueva-consulta.html`, el `<input type="file">` permite seleccionar fotos y previewarlas con `FileReader`, pero el botón "Guardar" ejecuta `window.location.href='detalle-paciente.html'` — **las fotos se descartan sin guardarse**.
- Los botones "+ Foto" y "+ Subir fotos" en `detalle-paciente.html` no tienen ninguna lógica conectada.
- No existe backend de almacenamiento (ni S3, ni Cloudinary, ni filesystem).
- No hay ninguna vinculación entre una foto subida en `nueva-consulta.html` y la galería de `detalle-paciente.html`.

**Justificación para sprint:** Se necesita un servicio de almacenamiento de archivos y una API que vincule imágenes a consultas y pacientes específicos.

---

### Pain Point 3 — Trauma por Pérdida de Datos (Seguridad y Backups)
**Objetivo:** Encriptación + sistema de backups robusto y exportable.

**Falla crítica: El sistema no tiene ningún mecanismo de seguridad ni backup.**

**Autenticación:**
- El login en `index.html` tiene `onclick="window.location.href='dashboard.html'"`. Cualquier persona que acceda directamente a la URL de `dashboard.html` entra sin restricción, sin login, sin contraseña.
- No hay sesión, cookie, JWT ni token de ningún tipo.

**Backups:**
- La única exportación existente es el PDF de stock (8 items demo) y el PDF de consulta individual (sin fotos).
- No hay exportación de historias clínicas, ni de la lista de pacientes, ni de turnos.
- No hay export a JSON o CSV de ninguna entidad.

**Encriptación:**
- No existe. No hay datos sensibles reales que encriptar aún (todo es mock), pero tampoco hay arquitectura preparada para implementarla.

**Justificación para sprint:** Este es el factor de confianza más importante para la Dra. Nancy. Requiere: autenticación real, roles por usuario, cifrado en tránsito y en reposo, y un sistema de exportación completo (backup de toda la base de datos en formato auditable).

---

### Pain Point 4 — Fragmentación de Almacenamiento por Especialidad
**Objetivo:** Base de datos de pacientes unificada independiente de la especialidad.

**Falla crítica: El paciente no existe como entidad persistente.**

- Navegar desde `dashboard.html` a cualquier fila de paciente lleva siempre a `detalle-paciente.html` mostrando a **María González** sin importar en cuál fila se clickeó. No hay routing por ID.
- El campo de tipo "Estética / Clínica General" existe en el formulario de nueva consulta, pero como no persiste nada, no hay separación real ni unificación real.
- Los 15 pacientes del dashboard y los 6 del selector de nueva consulta son **listas distintas**, sin entidad compartida.

**Justificación para sprint:** Se requiere un modelo de datos de Paciente con ID único, navegación dinámica por parámetro de URL (ej. `detalle-paciente.html?id=42`), y un repositorio unificado que agrupe ambas especialidades.

---

## Estado del Módulo de Stock

**El módulo es el más completo del prototipo, pero aún es insuficiente como herramienta productiva.**

### Qué funciona correctamente

- CRUD completo en memoria (agregar, editar, eliminar productos).
- 4 métricas calculadas dinámicamente: total insumos, próximos a vencer (<15 días), stock bajo (≤3 unidades), valor en riesgo.
- Filtros por categoría (Estética/Clínica) y estado de vencimiento.
- Ordenamiento automático: críticos primero.
- Alertas visuales con badge pulsante para items críticos.
- Exportación a PDF (jsPDF + autotable) — funciona pero exporta solo los 8 items demo.

### Fallas que justifican trabajo en próximos sprints

**1. Sin persistencia:** Al recargar la página, todos los cambios se pierden y vuelven los 8 productos demo. El propio comentario en el código lo reconoce: `// Datos demo — reemplazar por fetch al backend`.

**2. Sin integración con consultas:** No hay descuento automático de stock al registrar un tratamiento. Si se aplica toxina botulínica en una consulta, el stock no se reduce. Esta es la integración de mayor valor clínico.

**3. Desconectado de estadísticas:** `estadisticas.html` tiene un objeto `INSUMOS` completamente independiente del array `inventario` de `stock.html`. El "drilldown" de estadísticas que muestra insumos por tratamiento usa datos inventados separados, no el inventario real.

**4. Sin alertas proactivas:** No hay notificación por email ni push cuando un producto está próximo a vencer o por debajo del stock mínimo. El sistema solo muestra el estado si el usuario abre la página.

**5. Sin control de lotes ni proveedores:** No hay número de lote, sin historial de compras, sin gestión de proveedores con datos de contacto.

---

## Objetivos del Sistema vs. Estado Actual

| Objetivo | Estado | Nivel de brecha |
|---|---|---|
| Centralización (Single Source of Truth) | No existe | CRÍTICO |
| Visualización integrada de imágenes | UI lista, sin backend | ALTO |
| Transición Estética / Clínica | Formulario existe, sin persistencia | MEDIO |
| Seguridad + backups (Trust Factor) | No existe nada | CRÍTICO |
| Landing page pública | No existe | ALTO |
| Gestión de stock | Prototipo funcional en memoria | MEDIO |
| Historia clínica persistente | No existe | CRÍTICO |
| Agenda persistente | No existe | ALTO |

---

## Propuesta de Priorización para Próximos Sprints

### Sprint A — Fundación *(desbloqueador de todo lo demás)*
- Backend con API REST (Node.js/Express o similar).
- Base de datos con modelos: Paciente, Consulta, Turno, Producto.
- Autenticación real con JWT y roles.
- Routing dinámico por ID de paciente.

### Sprint B — Persistencia de datos clínicos
- Guardado real de nueva consulta vinculada al paciente.
- Detalle de paciente dinámico (carga datos reales por ID).
- Persistencia de turnos.

### Sprint C — Stock integrado
- Persistencia del inventario.
- Descuento automático de stock al registrar tratamiento.
- Alertas por vencimiento y stock mínimo.
- Unificación con el drilldown de estadísticas.

### Sprint D — Imágenes y seguridad
- Upload real de imágenes vinculadas a consultas.
- Almacenamiento en cloud (S3 o similar).
- Sistema de backup exportable.
- Encriptación de datos sensibles.

### Sprint E — Captación *(Landing page)*
- Página pública del consultorio.
- Formulario de contacto/turno para pacientes externos.
- Integración con el sistema de agenda.

---

> El prototipo actual es un excelente punto de partida visual y de UX, pero requiere una capa de infraestructura completa antes de ser utilizable en producción. La mayor deuda técnica está en la ausencia total de backend y persistencia de datos.
