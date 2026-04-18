/**
 * CALENDARIO DE TURNOS
 * Vista día / semana · Roles: admin, doctora, secretaria
 */

// ── MOCK DATA ──────────────────────────────────────────────────────────────
let TURNOS_DATA = [
  { id:1, paciente:'María González',   telefono:'5491122334455', tipo:'estetica',  fecha:'2026-04-15', horaInicio:'09:00', horaFin:'09:30', tratamiento:'Relleno de labios',     estado:'confirmado' },
  { id:2, paciente:'Ana Rodríguez',    telefono:'5491133445566', tipo:'estetica',  fecha:'2026-04-15', horaInicio:'10:00', horaFin:'10:45', tratamiento:'Botox preventivo',       estado:'confirmado' },
  { id:3, paciente:'Marta Sánchez',    telefono:'5491144556677', tipo:'clinica',   fecha:'2026-04-15', horaInicio:'11:00', horaFin:'11:30', tratamiento:'Control Post-Op',        estado:'pendiente'  },
  { id:4, paciente:'Inés Torres',      telefono:'5491155667788', tipo:'estetica',  fecha:'2026-04-15', horaInicio:'12:00', horaFin:'13:00', tratamiento:'Dermoabrasión',          estado:'confirmado' },
  { id:5, paciente:'Luciana Martínez', telefono:'5491166778899', tipo:'clinica',   fecha:'2026-04-16', horaInicio:'09:30', horaFin:'10:00', tratamiento:'Control HTA',            estado:'confirmado' },
  { id:6, paciente:'Carlos Solari',    telefono:'5491177889900', tipo:'clinica',   fecha:'2026-04-16', horaInicio:'11:00', horaFin:'11:30', tratamiento:'Diabetes T2',            estado:'pendiente'  },
  { id:7, paciente:'Brenda López',     telefono:'5491188990011', tipo:'estetica',  fecha:'2026-04-17', horaInicio:'10:00', horaFin:'10:30', tratamiento:'Peeling químico',        estado:'confirmado' },
  { id:8, paciente:'Elena Rivas',      telefono:'5491199001122', tipo:'estetica',  fecha:'2026-04-17', horaInicio:'14:00', horaFin:'15:00', tratamiento:'Bioestimuladores',       estado:'confirmado' },
  { id:9, paciente:'Facundo Díaz',     telefono:'5491100112233', tipo:'estetica',  fecha:'2026-04-18', horaInicio:'09:00', horaFin:'09:30', tratamiento:'Rinomodelación',         estado:'pendiente'  },
  { id:10,paciente:'Hospital San Juan',telefono:'',              tipo:'bloqueado', fecha:'2026-04-15', horaInicio:'16:00', horaFin:'19:00', tratamiento:'Guardia hospital',       estado:'bloqueado'  },
  { id:11,paciente:'Hospital San Juan',telefono:'',              tipo:'bloqueado', fecha:'2026-04-17', horaInicio:'08:00', horaFin:'12:00', tratamiento:'Cirugías programadas',   estado:'bloqueado'  },
];
let _nextId = 12;

// ── ESTADO ─────────────────────────────────────────────────────────────────
let vistaActual  = 'semana';
let fechaBase    = new Date();
const ROL_ACTUAL = 'admin'; // 'admin' | 'doctora' | 'secretaria'
const PUEDE_EDITAR = ROL_ACTUAL === 'admin' || ROL_ACTUAL === 'doctora';

const SLOT_H    = 50;   // px por slot de 30 min
const HORA_INI  = 8;    // 08:00
const HORA_FIN  = 21;   // último slot inicia 20:30
const TOTAL_SLOTS = (HORA_FIN - HORA_INI) * 2; // 26

const DIAS_ES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const MESES_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

let turnoSeleccionado = null; // id del turno en modal

// ── UTILS ──────────────────────────────────────────────────────────────────
function pad(n){ return String(n).padStart(2,'0'); }

function formatFecha(d){
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

function parseFecha(str){
  const [y,m,d] = str.split('-').map(Number);
  return new Date(y, m-1, d);
}

function minutosDesdeMedia(str){
  const [h,m] = str.split(':').map(Number);
  return h * 60 + m;
}

function minutosAHora(min){
  return `${pad(Math.floor(min/60))}:${pad(min%60)}`;
}

function getLunesDe(d){
  const lunes = new Date(d);
  const dia = d.getDay();
  const diff = dia === 0 ? -6 : 1 - dia;
  lunes.setDate(d.getDate() + diff);
  return lunes;
}

function isHoy(fechaStr){
  return fechaStr === formatFecha(new Date());
}

// ── RENDER PRINCIPAL ───────────────────────────────────────────────────────
function render(){
  actualizarTituloHeader();
  const body = document.getElementById('calBody');
  if (!body) return;
  if (vistaActual === 'semana') renderSemana(body);
  else renderDia(body);
}

function actualizarTituloHeader(){
  const titulo = document.getElementById('calTitle');
  if (!titulo) return;
  if (vistaActual === 'semana'){
    const lunes  = getLunesDe(fechaBase);
    const dom    = new Date(lunes); dom.setDate(lunes.getDate() + 6);
    const mismoMes = lunes.getMonth() === dom.getMonth();
    titulo.textContent = mismoMes
      ? `${lunes.getDate()} – ${dom.getDate()} de ${MESES_ES[dom.getMonth()]} ${dom.getFullYear()}`
      : `${lunes.getDate()} ${MESES_ES[lunes.getMonth()]} – ${dom.getDate()} ${MESES_ES[dom.getMonth()]} ${dom.getFullYear()}`;
  } else {
    const d = fechaBase;
    titulo.textContent = `${DIAS_ES[d.getDay()]}, ${d.getDate()} de ${MESES_ES[d.getMonth()]} ${d.getFullYear()}`;
  }
}

// ── RENDER SEMANA ──────────────────────────────────────────────────────────
function renderSemana(container){
  const lunes = getLunesDe(fechaBase);
  const dias  = [];
  for (let i = 0; i < 7; i++){
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    dias.push(d);
  }
  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'cal-card';
  card.appendChild(construirCabecera(dias));
  card.appendChild(construirCuerpo(dias));
  container.appendChild(card);
}

// ── RENDER DÍA ─────────────────────────────────────────────────────────────
function renderDia(container){
  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'cal-card';
  card.appendChild(construirCabecera([fechaBase]));
  card.appendChild(construirCuerpo([fechaBase]));
  container.appendChild(card);
}

// ── CABECERA ───────────────────────────────────────────────────────────────
function construirCabecera(dias){
  const head = document.createElement('div');
  head.className = 'cal-head';

  const corner = document.createElement('div');
  corner.className = 'cal-time-head';
  head.appendChild(corner);

  dias.forEach(d => {
    const cell = document.createElement('div');
    cell.className = `cal-day-head${isHoy(formatFecha(d)) ? ' today' : ''}`;
    cell.innerHTML = `<div class="cal-day-name">${DIAS_ES[d.getDay()]}</div>
                      <div class="cal-day-num">${d.getDate()}</div>`;
    head.appendChild(cell);
  });
  return head;
}

// ── CUERPO ─────────────────────────────────────────────────────────────────
function construirCuerpo(dias){
  const wrap = document.createElement('div');
  wrap.className = 'cal-grid-body';

  // Columna de horas
  const gutter = document.createElement('div');
  gutter.className = 'cal-gutter';
  for (let s = 0; s < TOTAL_SLOTS; s++){
    const mins = HORA_INI * 60 + s * 30;
    const lbl  = document.createElement('div');
    lbl.className = 'cal-time-lbl';
    lbl.textContent = mins % 60 === 0 ? minutosAHora(mins) : '';
    gutter.appendChild(lbl);
  }
  wrap.appendChild(gutter);

  // Columnas de días
  dias.forEach(d => {
    wrap.appendChild(construirColumna(formatFecha(d)));
  });

  return wrap;
}

// ── COLUMNA DE UN DÍA ─────────────────────────────────────────────────────
function construirColumna(fechaStr){
  const col = document.createElement('div');
  col.className = 'cal-day-col';

  // Fondo: slots clicables
  for (let s = 0; s < TOTAL_SLOTS; s++){
    const slot = document.createElement('div');
    const mins = HORA_INI * 60 + s * 30;
    slot.className = `cal-bg-slot ${mins % 60 === 0 ? 'slot-hour' : 'slot-half'}`;
    if (PUEDE_EDITAR){
      slot.title = 'Agregar turno';
      slot.addEventListener('click', () => {
        abrirModalNuevo(fechaStr, minutosAHora(mins));
      });
    }
    col.appendChild(slot);
  }

  // Eventos del día
  const turnosDia = TURNOS_DATA.filter(t => t.fecha === fechaStr);
  turnosDia.forEach(t => {
    const ev = crearEventoEl(t);
    col.appendChild(ev);
  });

  return col;
}

// ── ELEMENTO EVENTO ────────────────────────────────────────────────────────
function crearEventoEl(t){
  const ini  = minutosDesdeMedia(t.horaInicio);
  const fin  = minutosDesdeMedia(t.horaFin);
  const top  = ((ini - HORA_INI * 60) / 30) * SLOT_H;
  const h    = Math.max(((fin - ini) / 30) * SLOT_H, 22);

  const ev = document.createElement('div');
  ev.className = `cal-event ${t.tipo}`;
  ev.style.cssText = `top:${top}px;height:${h}px;`;

  const label = t.tipo === 'bloqueado'
    ? `<span class="cal-event-nombre">${t.tratamiento}</span>`
    : `<span class="cal-event-nombre">${t.paciente}</span>
       <span class="cal-event-hora">${t.horaInicio}–${t.horaFin}</span>`;
  ev.innerHTML = label;

  ev.addEventListener('click', e => {
    e.stopPropagation();
    abrirModalEditar(t.id);
  });
  return ev;
}

// ── MODAL NUEVO ────────────────────────────────────────────────────────────
function abrirModalNuevo(fechaStr, horaStr){
  if (!PUEDE_EDITAR) return;
  turnoSeleccionado = null;
  const horaFin = minutosAHora(minutosDesdeMedia(horaStr) + 30);

  document.getElementById('modalTitle').textContent = 'Nuevo turno';
  renderModalBody({ tipo:'estetica', fecha:fechaStr, horaInicio:horaStr, horaFin });
  renderModalFooter(false, null);
  document.getElementById('modalOverlay').classList.add('open');
}

// ── MODAL EDITAR ───────────────────────────────────────────────────────────
function abrirModalEditar(id){
  const t = TURNOS_DATA.find(x => x.id === id);
  if (!t) return;
  turnoSeleccionado = id;

  document.getElementById('modalTitle').textContent = PUEDE_EDITAR ? 'Editar turno' : 'Detalle del turno';
  renderModalBody(t);
  renderModalFooter(true, t);
  document.getElementById('modalOverlay').classList.add('open');
}

// ── BODY DEL MODAL ─────────────────────────────────────────────────────────
function renderModalBody(datos){
  const body = document.getElementById('modalBody');
  const readonly = !PUEDE_EDITAR ? 'readonly disabled' : '';

  body.innerHTML = `
    <div class="cal-form-row">
      <label>TIPO DE TURNO</label>
      <div class="cal-tipo-grid">
        <button type="button" class="cal-tipo-opt${datos.tipo==='estetica'?' sel-estetica':''}" data-tipo="estetica" onclick="selTipo(this)">Estética</button>
        <button type="button" class="cal-tipo-opt${datos.tipo==='clinica'?' sel-clinica':''}"  data-tipo="clinica"  onclick="selTipo(this)">Clínica</button>
        <button type="button" class="cal-tipo-opt${datos.tipo==='bloqueado'?' sel-bloqueado':''}" data-tipo="bloqueado" onclick="selTipo(this)">Bloquear</button>
      </div>
      <input type="hidden" id="mTipo" value="${datos.tipo}">
    </div>
    <div id="camposPaciente" style="${datos.tipo==='bloqueado'?'display:none':''}">
      <div class="cal-form-row">
        <label>PACIENTE</label>
        <input type="text" id="mPaciente" value="${datos.paciente||''}" placeholder="Nombre del paciente" ${readonly}>
      </div>
      <div class="cal-form-row">
        <label>TELÉFONO (WhatsApp)</label>
        <input type="tel" id="mTelefono" value="${datos.telefono||''}" placeholder="Ej: 5491122334455" ${readonly}>
      </div>
      <div class="cal-form-row">
        <label>TRATAMIENTO</label>
        <input type="text" id="mTratamiento" value="${datos.tratamiento||''}" placeholder="Motivo / tratamiento" ${readonly}>
      </div>
    </div>
    <div id="camposBloqueo" style="${datos.tipo!=='bloqueado'?'display:none':''}">
      <div class="cal-form-row">
        <label>MOTIVO DEL BLOQUEO</label>
        <input type="text" id="mMotivo" value="${datos.tratamiento||''}" placeholder="Ej: Guardia hospital, Congreso médico" ${readonly}>
      </div>
    </div>
    <div class="cal-form-row">
      <label>FECHA</label>
      <input type="date" id="mFecha" value="${datos.fecha||''}" ${readonly}>
    </div>
    <div class="cal-form-two">
      <div class="cal-form-row">
        <label>HORA INICIO</label>
        <input type="time" id="mHoraIni" value="${datos.horaInicio||''}" step="1800" ${readonly}>
      </div>
      <div class="cal-form-row">
        <label>HORA FIN</label>
        <input type="time" id="mHoraFin" value="${datos.horaFin||''}" step="1800" ${readonly}>
      </div>
    </div>
  `;
}

// ── FOOTER DEL MODAL ───────────────────────────────────────────────────────
function renderModalFooter(editando, turno){
  const footer = document.getElementById('modalFooter');
  const izq = `<div class="cal-modal-footer-left">`;
  const der = `<div class="cal-modal-footer-right">`;

  let izqContent = '';
  let derContent = '';

  if (editando && turno && turno.tipo !== 'bloqueado' && turno.telefono){
    izqContent += `
      <button class="btn-whatsapp" onclick="enviarWhatsApp(${turno.id})">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.998 2C6.477 2 2 6.477 2 12c0 1.887.52 3.65 1.424 5.163L2 22l4.946-1.398C8.375 21.52 10.15 22 11.998 22 17.523 22 22 17.523 22 12S17.523 2 11.998 2zm0 18.261c-1.71 0-3.352-.484-4.754-1.389l-.341-.202-3.518.994.951-3.436-.222-.352A8.184 8.184 0 013.739 12c0-4.554 3.706-8.26 8.259-8.26 4.554 0 8.26 3.706 8.26 8.26 0 4.553-3.706 8.261-8.26 8.261z"/></svg>
        WhatsApp
      </button>`;
  }

  if (PUEDE_EDITAR && editando){
    izqContent += `<button class="btn-eliminar" onclick="eliminarTurno(${turno.id})">Eliminar</button>`;
  }

  if (PUEDE_EDITAR){
    derContent += `
      <button class="btn-cancel" onclick="cerrarModal()">Cancelar</button>
      <button class="btn-save" onclick="guardarTurno()">Guardar</button>`;
  } else {
    derContent += `<button class="btn-cancel" onclick="cerrarModal()">Cerrar</button>`;
  }

  footer.innerHTML = `${izq}${izqContent}</div>${der}${derContent}</div>`;
}

// ── SELECCIÓN DE TIPO ──────────────────────────────────────────────────────
function selTipo(btn){
  if (!PUEDE_EDITAR) return;
  document.querySelectorAll('.cal-tipo-opt').forEach(b => b.className = 'cal-tipo-opt');
  const tipo = btn.dataset.tipo;
  btn.classList.add(`sel-${tipo}`);
  document.getElementById('mTipo').value = tipo;

  document.getElementById('camposPaciente').style.display = tipo === 'bloqueado' ? 'none' : '';
  document.getElementById('camposBloqueo').style.display  = tipo !== 'bloqueado' ? 'none' : '';
}

// ── GUARDAR ────────────────────────────────────────────────────────────────
function guardarTurno(){
  const tipo      = document.getElementById('mTipo').value;
  const fecha     = document.getElementById('mFecha').value;
  const horaInicio= document.getElementById('mHoraIni').value;
  const horaFin   = document.getElementById('mHoraFin').value;

  if (!fecha || !horaInicio || !horaFin){ alert('Completá fecha y horario.'); return; }
  if (minutosDesdeMedia(horaFin) <= minutosDesdeMedia(horaInicio)){ alert('La hora de fin debe ser posterior al inicio.'); return; }

  let paciente='', telefono='', tratamiento='';
  if (tipo === 'bloqueado'){
    tratamiento = (document.getElementById('mMotivo')||{}).value || 'Horario bloqueado';
    paciente = 'Bloqueado';
  } else {
    paciente    = (document.getElementById('mPaciente')||{}).value || '';
    telefono    = (document.getElementById('mTelefono')||{}).value || '';
    tratamiento = (document.getElementById('mTratamiento')||{}).value || '';
    if (!paciente){ alert('Ingresá el nombre del paciente.'); return; }
  }

  if (turnoSeleccionado){
    const idx = TURNOS_DATA.findIndex(t => t.id === turnoSeleccionado);
    if (idx !== -1){
      TURNOS_DATA[idx] = { ...TURNOS_DATA[idx], tipo, paciente, telefono, tratamiento, fecha, horaInicio, horaFin };
    }
  } else {
    TURNOS_DATA.push({ id: _nextId++, paciente, telefono, tipo, fecha, horaInicio, horaFin, tratamiento, estado: tipo==='bloqueado'?'bloqueado':'pendiente' });
  }

  cerrarModal();
  render();
}

// ── ELIMINAR ───────────────────────────────────────────────────────────────
function eliminarTurno(id){
  if (!PUEDE_EDITAR) return;
  if (!confirm('¿Eliminar este turno?')) return;
  TURNOS_DATA = TURNOS_DATA.filter(t => t.id !== id);
  cerrarModal();
  render();
}

// ── WHATSAPP ───────────────────────────────────────────────────────────────
function enviarWhatsApp(id){
  const t = TURNOS_DATA.find(x => x.id === id);
  if (!t || !t.telefono) return;

  const fecha   = parseFecha(t.fecha);
  const diaStr  = `${DIAS_ES[fecha.getDay()]} ${fecha.getDate()} de ${MESES_ES[fecha.getMonth()]}`;
  const nombre  = t.paciente.split(' ')[0];
  const mensaje = `Hola ${nombre}! Le confirmamos su turno con la Dra. Nancy el ${diaStr} a las ${t.horaInicio} hs. Por favor confirme su asistencia. ¡La esperamos! 🌸`;
  const url     = `https://wa.me/${t.telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank', 'noopener');
}

// ── CERRAR MODAL ───────────────────────────────────────────────────────────
function cerrarModal(){
  document.getElementById('modalOverlay').classList.remove('open');
  turnoSeleccionado = null;
}

// ── NAVEGACIÓN ─────────────────────────────────────────────────────────────
function navegarAnterior(){
  if (vistaActual === 'semana'){
    fechaBase.setDate(fechaBase.getDate() - 7);
  } else {
    fechaBase.setDate(fechaBase.getDate() - 1);
  }
  fechaBase = new Date(fechaBase);
  render();
}

function navegarSiguiente(){
  if (vistaActual === 'semana'){
    fechaBase.setDate(fechaBase.getDate() + 7);
  } else {
    fechaBase.setDate(fechaBase.getDate() + 1);
  }
  fechaBase = new Date(fechaBase);
  render();
}

function irHoy(){
  fechaBase = new Date();
  render();
}

function cambiarVista(v){
  vistaActual = v;
  document.querySelectorAll('.cal-view-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.vista === v);
  });
  render();
}

// ── INIT ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnAnterior').addEventListener('click', navegarAnterior);
  document.getElementById('btnSiguiente').addEventListener('click', navegarSiguiente);
  document.getElementById('btnHoy').addEventListener('click', irHoy);
  document.getElementById('btnNuevoTurno').addEventListener('click', () => abrirModalNuevo(formatFecha(fechaBase), '09:00'));
  document.querySelectorAll('.cal-view-btn').forEach(b => {
    b.addEventListener('click', () => cambiarVista(b.dataset.vista));
  });
  // Cerrar modal al clic en overlay
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) cerrarModal();
  });
  render();
});
