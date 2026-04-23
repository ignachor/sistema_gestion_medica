// ─────────────────────────────────────────────
// MOCK: pacientes existentes para control de duplicados
// ─────────────────────────────────────────────
const PACIENTES_MOCK = [
  { dni: '32456789', nombre: 'María González' },
  { dni: '28901234', nombre: 'Laura Fernández' },
  { dni: '35678012', nombre: 'Sofía Romero' },
  { dni: '41234567', nombre: 'Valentina Pérez' },
  { dni: '27890123', nombre: 'Claudia Méndez' },
  { dni: '30112233', nombre: 'Ana Torres' },
];

// ─────────────────────────────────────────────
// CATEGORÍA DEL PACIENTE
// ─────────────────────────────────────────────
let categoriaActual = 'clinica';

function selectCategoria(tipo) {
  categoriaActual = tipo;
  const claseMap = { clinica: 'selected-dorado', estetica: 'selected-rosa', ambas: 'selected-dorado' };
  ['clinica', 'estetica', 'ambas'].forEach(t => {
    const el = document.getElementById('cat-' + t);
    el.classList.remove('selected-dorado', 'selected-rosa');
    if (t === tipo) el.classList.add(claseMap[tipo]);
  });
  onFormChange();
}

// ─────────────────────────────────────────────
// VALIDACIÓN DNI EN TIEMPO REAL
// ─────────────────────────────────────────────
function onDniInput(input) {
  const raw = input.value.replace(/\D/g, '');
  const hint = document.getElementById('hintDni');

  input.classList.remove('state-error', 'state-ok');
  hint.className = 'field-hint';
  hint.innerHTML = '';

  if (raw.length < 7) return;

  const dupe = PACIENTES_MOCK.find(p => p.dni === raw);
  if (dupe) {
    input.classList.add('state-error');
    hint.innerHTML = `⚠ DNI ya registrado: <span class="hint-link" onclick="window.location.href='detalle-paciente.html'">${dupe.nombre}</span> — Ver ficha.`;
    hint.className = 'field-hint show error';
  } else {
    input.classList.add('state-ok');
    hint.textContent = '✓ DNI disponible';
    hint.className = 'field-hint show ok';
  }
}

// ─────────────────────────────────────────────
// INDICADOR DE SINCRONIZACIÓN
// ─────────────────────────────────────────────
let _syncTimer = null;

function onFormChange() {
  const indicator = document.getElementById('syncIndicator');
  const text = document.getElementById('syncText');

  indicator.className = 'sync-indicator saving';
  text.textContent = 'Guardando...';

  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(() => {
    indicator.className = 'sync-indicator saved';
    text.textContent = 'Sincronizado · hace 2 seg';

    setTimeout(() => {
      indicator.className = 'sync-indicator';
      text.textContent = 'Sin cambios';
    }, 6000);
  }, 1500);
}

// ─────────────────────────────────────────────
// UPLOAD DE FOTOS
// ─────────────────────────────────────────────
const fotosSeleccionadas = [];

function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      fotosSeleccionadas.push({ src: e.target.result, name: file.name });
      renderPreviews();
      onFormChange();
    };
    reader.readAsDataURL(file);
  });
}

function renderPreviews() {
  const container = document.getElementById('photoPreviews');
  container.innerHTML = '';
  fotosSeleccionadas.forEach((foto, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'photo-thumb';
    thumb.style.position = 'relative';
    thumb.innerHTML = `
      <img src="${foto.src}" alt="${foto.name}" style="width:72px;height:72px;object-fit:cover;border-radius:7px;">
      <button class="photo-thumb-remove" onclick="removePhoto(${i})" title="Eliminar">✕</button>
    `;
    container.appendChild(thumb);
  });
}

function removePhoto(index) {
  fotosSeleccionadas.splice(index, 1);
  renderPreviews();
  onFormChange();
}

// Drag & drop
(function () {
  const zone = document.getElementById('uploadZone');
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.style.borderColor = 'var(--rosa)';
    zone.style.background = '#fff5fa';
  });
  zone.addEventListener('dragleave', () => {
    zone.style.borderColor = '';
    zone.style.background = '';
  });
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.style.borderColor = '';
    zone.style.background = '';
    handleFiles(e.dataTransfer.files);
  });
})();

// ─────────────────────────────────────────────
// VALIDACIÓN DEL FORMULARIO
// ─────────────────────────────────────────────
function validarFormulario() {
  let valido = true;

  const requeridos = [
    { id: 'inputNombre',   hintId: 'hintNombre' },
    { id: 'inputApellido', hintId: 'hintApellido' },
    { id: 'inputDni',      hintId: 'hintDni' },
  ];

  requeridos.forEach(({ id, hintId }) => {
    const input = document.getElementById(id);
    const hint  = document.getElementById(hintId);
    if (!input.value.trim()) {
      input.classList.add('state-error');
      hint.textContent = 'Este campo es obligatorio.';
      hint.className = 'field-hint show error';
      valido = false;
    }
  });

  // DNI no puede ser duplicado
  const dniRaw = document.getElementById('inputDni').value.replace(/\D/g, '');
  if (dniRaw && PACIENTES_MOCK.find(p => p.dni === dniRaw)) {
    valido = false;
  }

  return valido;
}

// ─────────────────────────────────────────────
// GUARDAR PACIENTE
// ─────────────────────────────────────────────
function guardarPaciente() {
  if (!validarFormulario()) {
    const firstError = document.querySelector('.state-error');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const indicator = document.getElementById('syncIndicator');
  const text = document.getElementById('syncText');
  indicator.className = 'sync-indicator saving';
  text.textContent = 'Guardando...';

  // Simula llamada al servidor
  setTimeout(() => {
    indicator.className = 'sync-indicator saved';
    text.textContent = '¡Paciente guardado!';
    setTimeout(() => window.location.href = 'detalle-paciente.html', 1100);
  }, 900);
}

// ─────────────────────────────────────────────
// GENERAR FICHA DE BIENVENIDA (PDF)
// ─────────────────────────────────────────────
function generarFichaBienvenida() {
  const get = id => document.getElementById(id)?.value?.trim() || '';

  const nombre    = get('inputNombre')    || '—';
  const apellido  = get('inputApellido')  || '—';
  const dni       = get('inputDni')       || '—';
  const fechaNac  = get('inputFechaNac');
  const telefono  = get('inputTelefono')  || '—';
  const email     = get('inputEmail')     || '—';
  const obraSoc   = get('inputObraSocial')|| '—';
  const afiliado  = get('inputAfiliado')  || '—';
  const alergias  = get('inputAlergias')  || 'Sin alergias registradas';
  const medicacion= get('inputMedicacion')|| 'Ninguna';
  const antecP    = get('inputAntecedentesP') || '—';
  const obs       = get('inputObs')       || '';

  const fechaFormateada = fechaNac
    ? new Date(fechaNac + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  const hoy = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });

  const catLabels = { clinica: 'Clínica General', estetica: 'Medicina Estética', ambas: 'Clínica General + Estética' };
  const catLabel  = catLabels[categoriaActual] || '—';

  const ficha = document.getElementById('printFicha');
  ficha.innerHTML = `
    <div style="max-width:720px;margin:0 auto;font-family:'Montserrat',sans-serif;color:#1A1A1A;font-size:11pt;line-height:1.5;">

      <!-- Encabezado -->
      <div style="display:flex;align-items:flex-start;justify-content:space-between;border-bottom:2.5px solid #D4AF37;padding-bottom:1.25rem;margin-bottom:1.5rem;">
        <div>
          <div style="font-size:1.45rem;font-weight:600;letter-spacing:-0.02em;">Clínica Ostrizniuk</div>
          <div style="font-size:0.65rem;color:#6B6B6B;letter-spacing:0.22em;text-transform:uppercase;margin-top:0.25rem;">Medicina Estética · Clínica General</div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:700;color:#D4AF37;font-size:0.82rem;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:0.25rem;">Ficha de Bienvenida</div>
          <div style="font-size:0.72rem;color:#6B6B6B;">Fecha: ${hoy}</div>
          <div style="font-size:0.72rem;color:#6B6B6B;">Categoría: ${catLabel}</div>
        </div>
      </div>

      <!-- Datos del paciente -->
      <div style="margin-bottom:1.5rem;">
        <div style="font-size:0.6rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#6B6B6B;border-bottom:1px solid #F0EBE3;padding-bottom:0.35rem;margin-bottom:0.85rem;">Datos del Paciente</div>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:0.3rem 0 0.3rem 0;font-weight:600;width:200px;color:#2E2E2E;vertical-align:top;">Nombre completo</td><td>${apellido}, ${nombre}</td></tr>
          <tr><td style="padding:0.3rem 0;font-weight:600;vertical-align:top;">DNI</td><td>${dni}</td></tr>
          <tr><td style="padding:0.3rem 0;font-weight:600;vertical-align:top;">Fecha de nacimiento</td><td>${fechaFormateada}</td></tr>
          <tr><td style="padding:0.3rem 0;font-weight:600;vertical-align:top;">Teléfono / WhatsApp</td><td>${telefono}</td></tr>
          <tr><td style="padding:0.3rem 0;font-weight:600;vertical-align:top;">Correo electrónico</td><td>${email}</td></tr>
          <tr><td style="padding:0.3rem 0;font-weight:600;vertical-align:top;">Obra social / Prepaga</td><td>${obraSoc}</td></tr>
          ${afiliado !== '—' ? `<tr><td style="padding:0.3rem 0;font-weight:600;vertical-align:top;">N.º de afiliado</td><td>${afiliado}</td></tr>` : ''}
        </table>
      </div>

      <!-- Antecedentes -->
      <div style="margin-bottom:1.5rem;">
        <div style="font-size:0.6rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#6B6B6B;border-bottom:1px solid #F0EBE3;padding-bottom:0.35rem;margin-bottom:0.85rem;">Antecedentes Médicos</div>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:0.3rem 0;font-weight:600;width:200px;vertical-align:top;">Alergias</td><td>${alergias}</td></tr>
          <tr><td style="padding:0.3rem 0;font-weight:600;vertical-align:top;">Medicación habitual</td><td>${medicacion}</td></tr>
          ${antecP && antecP !== '—' ? `<tr><td style="padding:0.3rem 0;font-weight:600;vertical-align:top;">Antecedentes personales</td><td>${antecP}</td></tr>` : ''}
          ${obs ? `<tr><td style="padding:0.3rem 0;font-weight:600;vertical-align:top;">Observaciones</td><td>${obs}</td></tr>` : ''}
        </table>
      </div>

      <!-- Indicaciones iniciales -->
      <div style="background:#FBF6E3;border-left:3px solid #D4AF37;padding:0.9rem 1.2rem;border-radius:0 6px 6px 0;margin-bottom:1.75rem;">
        <div style="font-weight:700;font-size:0.82rem;margin-bottom:0.5rem;color:#1A1A1A;">Indicaciones Iniciales</div>
        <ul style="margin:0;padding-left:1.2rem;line-height:2;color:#2E2E2E;font-size:0.82rem;">
          <li>Traer estudios previos (laboratorios, ecografías, etc.) a la próxima consulta.</li>
          <li>Informar ante cualquier cambio en la medicación habitual.</li>
          <li>Comunicar reacciones o alergias no registradas en esta ficha.</li>
          <li>Ante cualquier duda, contactar al consultorio antes de la consulta.</li>
          <li>Mantener actualizados los datos de contacto y obra social.</li>
        </ul>
      </div>

      <!-- Consentimiento -->
      <div style="font-size:0.72rem;color:#6B6B6B;margin-bottom:2rem;line-height:1.7;border:1px solid #F0EBE3;padding:0.75rem 1rem;border-radius:6px;">
        <strong style="color:#1A1A1A;">Autorización de datos:</strong> El/la paciente autoriza el almacenamiento y procesamiento de sus datos clínicos con fines médicos exclusivos, conforme a la Ley N.º 25.326 de Protección de Datos Personales.
      </div>

      <!-- Firmas -->
      <div style="display:flex;justify-content:space-between;padding-top:1.5rem;border-top:1px solid #F0EBE3;">
        <div style="text-align:center;width:46%;">
          <div style="border-top:1px solid #1A1A1A;margin-bottom:0.4rem;"></div>
          <div style="font-size:0.72rem;color:#6B6B6B;">Firma del Paciente</div>
          <div style="font-size:0.65rem;color:#A8A8A8;margin-top:0.15rem;">Aclaración y DNI</div>
        </div>
        <div style="text-align:center;width:46%;">
          <div style="border-top:1px solid #1A1A1A;margin-bottom:0.4rem;"></div>
          <div style="font-size:0.72rem;color:#6B6B6B;">Firma del Profesional</div>
          <div style="font-size:0.65rem;color:#A8A8A8;margin-top:0.15rem;">Dra. Nancy Ostrizniuk</div>
        </div>
      </div>

    </div>
  `;

  window.print();
}
