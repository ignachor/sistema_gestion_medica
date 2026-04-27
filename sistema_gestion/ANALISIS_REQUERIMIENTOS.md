# Análisis de Requerimientos - Clínica Estética

**Fecha:** 2026-04-07  
**Entrevistada:** Dra. [Especialista en Clínica General y Estética]  
**Tipo de Proyecto:** Sistema de Gestión de Pacientes (Clínica + Estética)

---

## 1. CONTEXTO DEL NEGOCIO

### Perfil de la Doctora
- **Especialidad:** Clínica General + Medicina Estética
- **Jornada Laboral:** Lunes a viernes (a veces sábados)
- **Carga de Pacientes:** 6-7 pacientes por día
- **Duración de Consultas:** 30-45 minutos
- **Horario Aproximado:** 9:00 AM - 12:30 PM (flexible según compromisos)
- **Empleados:** Trabaja sola (sin secretaria ni asistente)
- **Ubicaciones:** Consultorio + Hospital + Otra clínica

### Situación Actual
- **Gestión:** Completamente manual usando Google Drive, Excel y Word
- **Registro de Pacientes:** Historias clínicas en Excel con múltiples pestañas
- **Comunicación:** WhatsApp + teléfono personal
- **Almacenamiento de Fotos:** Google Photos
- **Gestión de Turnos:** Google Calendar + WhatsApp manual
- **Acceso:** Principalmente desde desktop, necesita acceso móvil

---

## 2. FLUJO DE TRABAJO ACTUAL

### A. Gestión de Pacientes (Clínica)

**Estructura de Historia Clínica (Excel):**
1. **Datos del Paciente**
   - Nombre, edad, contacto
   - Obra social
   - Información general

2. **Registro de Consulta**
   - Fecha de consulta
   - Motivo de consulta
   - Antecedentes personales
   - Medicación habitual
   - Examen físico
   - Problemas médicos/Diagnósticos
   - Conductas/Indicaciones
   - Tratamiento indicado

3. **Estudios Complementarios** (Pestañas adicionales)
   - Laboratorios
   - Electrocardiogramas
   - Ecografías
   - Resonancias magnéticas
   - Biopsias
   - Tomografías
   - Fotos de estudios

4. **Impresiones y Seguimiento**
   - Imprime indicaciones después de cada consulta
   - Tablas especiales (ej: para diabéticos)
   - Pedidos médicos para laboratorios
   - Seguimiento de estudios autorizados

### B. Gestión de Pacientes (Estética)

**Estructura simplificada (Excel):**
1. Datos del paciente (similar a clínica)
2. Motivo de consulta (estético)
3. Antecedentes personales
4. Examen físico
5. Imágenes antes/durante/después
6. Plan de tratamiento

**Características:**
- Usa plantilla guía para interrogatorio (asegura no olvidar temas)
- Menos compleja que clínica, pero similar estructura
- Enfoque en documentación fotográfica

### C. Gestión de Turnos
- **Herramienta:** Google Calendar + WhatsApp
- **Proceso:** 
  - Pacientes contactan por WhatsApp
  - Doctora agenda manualmente en Google Calendar
  - Confirmación por WhatsApp
- **Preferencia:** NO quiere agendar online (prefiere control manual/flexible)

### D. Gestión de Stock/Insumos

**Situación Actual:**
- Sin registro formal
- Control visual de vencimientos
- Productos estéticos: vencimiento corto (días/semanas)
- Otros productos: vencimiento largo (2-4 años)
- Incorporación según demanda

**Deseo:** Estadísticas sobre qué tratamientos estéticos son más solicitados

---

## 3. PROBLEMAS IDENTIFICADOS

### Críticos
1. **Gestión de Fotos Manual**
   - Acumula fotos pendientes de cargar
   - Proceso tedioso de copiar/pegar en Excel
   - Fin de semana dedicado a organizar
   - No hay integración cronológica

2. **Pérdida de Datos**
   - Historia previa: perdió toda la información en un sistema contratado
   - Actualmente sin backup automático
   - Usa disco externo cada 2 meses (inconsistente)
   - Riesgo de pérdida por accidente (click accidental, edición, etc.)

3. **Falta de Acceso Móvil**
   - No puede acceder a pacientes desde hospital
   - Tiene que anotar manualmente y cargar después
   - Pierde información en el proceso
   - Necesita centralizad de datos

### Importantes
4. **Ausencia de Búsqueda Eficiente**
   - Aunque está "automatizado", buscar paciente por nombre/apellido es manual
   - Necesita sistema alfabético de búsqueda

5. **Gestión de Fotos en Contexto**
   - Quiere ver fotos dentro de la historia clínica, no separadas
   - Necesita comparación cronológica (antes/después)
   - No quiere salir de contexto del historial

6. **Documentación Fragmentada**
   - Clínica en Drive
   - Estética en Excel
   - Fotos en Google Photos
   - Turnos en Google Calendar
   - Sin integración

---

## 4. REQUERIMIENTOS FUNCIONALES

### RF1. Gestión de Pacientes

#### RF1.1 - Registro de Pacientes
- **Crear perfil de paciente** con campos estándar:
  - Datos personales (nombre, edad, DNI)
  - Contacto (teléfono, email)
  - Obra social
  - Alergias/Contraindicaciones
  - Antecedentes médicos personales

- **Categorizar pacientes:**
  - Clínica General
  - Medicina Estética
  - Ambas (permite cambiar enfoque)

#### RF1.2 - Historia Clínica Integrada
- **Crear nueva consulta** con plantilla guía que incluya:
  - Fecha/Hora
  - Motivo de consulta
  - Antecedentes (personales, medicación habitual)
  - Examen físico
  - Diagnósticos
  - Conductas/Indicaciones
  - Tratamiento indicado

- **Guardar estudios complementarios** con foto:
  - Laboratorios
  - Imágenes médicas (ECG, eco, resonancia, tomografía)
  - Biopsias
  - Organización por tipo y fecha

- **Generar documentos imprimibles:**
  - Resumen de consulta con tratamiento indicado
  - Tablas especiales (ej: control diabético)
  - Pedidos médicos para laboratorios

#### RF1.3 - Documentación Fotográfica (Clave)
- **Cargar fotos en contexto** (dentro de la consulta, no separadas)
- **Almacenar múltiples fotos** por consulta (fecha de toma)
- **Comparación cronológica:**
  - Ver evolución antes/después de tratamiento
  - Acceso rápido a fotos por fecha
  - Link comparativo entre fechas
- **Permisos de visualización:**
  - Privadas (solo doctora)
  - Compartibles con paciente
  - Potencialmente públicas para portfolio (con consentimiento)

#### RF1.4 - Búsqueda y Filtrado
- **Búsqueda por nombre/apellido** (alfabético)
- **Filtrar por tipo** (Clínica, Estética, Ambas)
- **Filtrar por fecha** de última consulta
- **Búsqueda rápida** desde móvil

### RF2. Gestión de Turnos

#### RF2.1 - Agendamiento Manual
- **Vista de calendario** integrada (Google Calendar en el futuro)
- **Crear turno manual:**
  - Seleccionar paciente
  - Fecha y hora
  - Tipo (Clínica, Estética)
- **Confirmación por WhatsApp** (envío automático de link)
- **Recordatorios** (automáticos o manuales)

**Nota:** NO implementar agendar online. Doctora prefiere control total.

#### RF2.2 - Reserva de Disponibilidad
- **Bloquear horarios** para actividades hospital/viajes
- **Mostrar disponibilidad** para pacientes que preguntan por WhatsApp
- **Flexibilidad:** Cambios rápidos sin saturarse

### RF3. Gestión de Stock e Insumos

#### RF3.1 - Registro de Productos
- **Crear inventario de productos** (inyectables, cremas, etc.)
- **Datos por producto:**
  - Nombre
  - Cantidad
  - Fecha de vencimiento
  - Proveedor
  - Costo

#### RF3.2 - Control de Stock
- **Alertas de vencimiento** próximo
- **Aviso de stock bajo**
- **Registro de consumo** (automatizado con consultas)

#### RF3.3 - Estadísticas (Futuro)
- **Qué tratamientos estéticos son más solicitados**
- **Por género** (si aplica)
- **Por mes/temporada**
- **Integración con marketing** para decisiones de stock

### RF4. Integración y Acceso

#### RF4.1 - Acceso Multiplataforma
- **Web:** Acceso desde desktop (principal)
- **Móvil:** Acceso desde celular para consultar en hospital/consultorios
- **Sincronización:** Datos actualizados en tiempo real

#### RF4.2 - Seguridad de Datos
- **Backup automático** en la nube
- **Versionado** de cambios
- **Recuperación** ante pérdidas accidentales
- **Protección** contra sobrescritura accidental

#### RF4.3 - Integración con Redes Sociales (Futuro)
- **Galería antes/después** para portfolio
- **Integración con Instagram/Facebook**
- **Control de permisos** de pacientes
- **Marketing:** Mostrar casos de éxito

---

## 5. REQUERIMIENTOS NO FUNCIONALES

### RNF1. Interfaz de Usuario
- **Intuitiva:** Doctora está acostumbrada a Excel, necesita algo simple
- **Eficiente:** No quiere perder tiempo adicional
- **Personalización:** Colores (dorado, rosa pastel, negro)
- **Responsive:** Funcione bien en móvil y desktop

### RNF2. Rendimiento
- **Carga rápida** de historias clínicas
- **Búsqueda instantánea** de pacientes
- **Manejo de imágenes** sin lentitud

### RNF3. Seguridad
- **Encriptación** de datos sensibles (historias clínicas)
- **Autenticación** (solo acceso doctora)
- **Backup automático** (crítico por experiencia previa)
- **HIPAA/GDPR** compliance (manejo de datos médicos)

### RNF4. Confiabilidad
- **99% uptime** (no puede perder acceso a pacientes)
- **Recuperación ante fallos**
- **Sin pérdida de datos**

---

## 6. CASOS DE USO PRINCIPALES

### CU1: Atender Paciente Nuevo (Clínica)
1. Paciente llama/WhatsApp solicitando turno
2. Doctora agenda en calendario
3. En consulta:
   - Abre app, busca paciente (si repite) o crea nuevo
   - Completa formulario guía de clínica
   - Anota diagnóstico y tratamiento
   - Toma fotos si corresponde
   - Genera impresión con indicaciones
   - Paciente se va con documento

### CU2: Seguimiento Paciente Estética
1. Paciente estético viene a consulta
2. Doctora abre historia
3. Revisa fotos previas (comparación)
4. Toma nuevas fotos
5. Actualiza plan de tratamiento
6. Paciente ve progreso

### CU3: Consulta Múltiple (Hospital + Consultorio)
1. Paciente en hospital
2. Doctora recuerda que está en Drive pero sin acceso a internet
3. Anota en papel
4. Vuelve al consultorio
5. Carga datos en sistema
6. **Problema:** Se pierde información, duplica trabajo

**Con nuevo sistema:**
1. Accede desde móvil con datos
2. Actualiza en tiempo real
3. Información centralizada

### CU4: Búsqueda de Paciente
1. Paciente llama preguntando por disponibilidad
2. Doctora busca en sistema
3. Encuentra horarios libres
4. Propone opciones

---

## 7. PROPUESTAS DE SOLUCIÓN

### Propuesta Principal: Plataforma Web + Móvil

#### Pantallas/Módulos Principales

1. **Dashboard**
   - Pacientes atendidos hoy
   - Próximos turnos
   - Alertas (stock, vencimientos)
   - Acceso rápido a funciones

2. **Listado de Pacientes**
   - Búsqueda/filtrado
   - Categorización (Clínica, Estética)
   - Última consulta
   - Estado (activo, inactivo)

3. **Perfil de Paciente**
   - Datos personales
   - Historias clínicas (listado cronológico)
   - Fotos (galería antes/después)
   - Turnos próximos

4. **Nueva Consulta**
   - Plantilla dinámica (clínica vs estética)
   - Campos con autocompletado (antecedentes previos)
   - Carga de fotos integrada
   - Generación de documento imprimible

5. **Gestión de Turnos**
   - Calendario integrado
   - Crear/editar turno
   - Exportar a Google Calendar
   - Recordatorios

6. **Inventario de Productos**
   - Listado de insumos
   - Alertas de vencimiento
   - Registro de consumo

7. **Reportes y Analytics**
   - Tratamientos más solicitados
   - Stock por consumo
   - Estadísticas por período

#### Stack Técnico Sugerido
- **Frontend:** React/Vue.js (UI responsive)
- **Backend:** Node.js/Python
- **Base de Datos:** PostgreSQL (encriptación)
- **Storage:** AWS S3 (fotos con backup automático)
- **Hosting:** Cloud (GCP/AWS/Azure para garantizar uptime)
- **Backup:** Automático diario a nube + disco local

---

## 8. FASES DE IMPLEMENTACIÓN

### Fase 1: MVP (Mínimo Viable)
- Gestión de pacientes (datos básicos)
- Historia clínica (clínica + estética)
- Carga de fotos integrada
- Búsqueda de pacientes
- **Objetivo:** Reemplazar Excel manteniendo flujo actual

### Fase 2: Mejoras
- Gestión de turnos integrada
- Generación de documentos
- Acceso móvil optimizado
- Reportes básicos

### Fase 3: Expansión
- Gestión de stock
- Analytics y estadísticas
- Integración con redes sociales
- Dashboard antes/después para marketing

### Fase 4: Futuro (Opcional)
- Integración con farmacias (recetas)
- Telemedicina
- Comunicación automática con pacientes
- Integración con obra social

---

## 9. CRITERIOS DE ÉXITO

✅ **Sistema debe:**
1. Funcionar desde móvil y desktop
2. Reemplazar completamente el flujo de Excel + Drive + Google Photos
3. Reducir tiempo en admin (especialmente carga de fotos)
4. Garantizar cero pérdida de datos (backup automático)
5. Ser intuitivo sin entrenamientos complejos
6. Mantener confidencialidad médica
7. Permitir generar documentos imprimibles
8. Mostrar fotos en contexto (dentro de historia, no separadas)

❌ **Sistema NO debe:**
- Obligar agendar turnos online (doctora lo rechaza explícitamente)
- Complejizar el workflow actual
- Perder datos bajo ninguna circunstancia
- Requiere acceso a internet constantemente en consultorios

---

## 10. PALETA DE COLORES SOLICITADA

**Preferencia de Doctora:**
- 🟡 **Dorado** (primario)
- 🩷 **Rosa Pastel** (secundario)
- ⬛ **Negro** (acentos)

**Propósito:** Reflejar profesionalismo y elegancia en medicina estética

---

## 11. NOTAS ADICIONALES

### Sobre Backup y Seguridad
- ⚠️ **CRÍTICO:** Doctora perdió datos en sistema anterior
- Implementar backup automático obligatorio
- Permitir descarga manual de historias (respaldo local)
- Sistema de control de versiones para historias
- Notificación si hay intentos de borrado

### Sobre Escalabilidad Futura
- Si eventualmente contrata secretaria, sistema debe permitir:
  - Permisos diferenciados
  - Auditoría de cambios
  - Asignación de tareas

### Sobre Marketing
- Doctora interesada en integración futura
- Antes/después con consentimiento de pacientes
- Potencial integración con redes sociales

### Sobre Horarios
- Sistema debe permitir bloqueo de horarios (viajes, eventos)
- No puede ser rígido
- Prioridad: flexibilidad sobre automatización

---

## PRÓXIMOS PASOS

1. **Validar requerimientos** con doctora
2. **Diseñar prototipo** en Pencil (4 pantallas MVP)
3. **Presentar y ajustar** hasta aprobación
4. **Iniciar desarrollo**
5. **Testing con doctora** en ambiente real
6. **Deploy** en producción

[[Web pagina medica]]