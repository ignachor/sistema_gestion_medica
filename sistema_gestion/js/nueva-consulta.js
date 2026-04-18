// --- FECHA: abre el calendario al hacer click en cualquier parte del campo ---
document.addEventListener('DOMContentLoaded', () => {
  const abrirCalendario = input => {
    if (typeof input.showPicker === 'function') input.showPicker();
  };

  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.addEventListener('click', () => abrirCalendario(input));
    input.closest('.form-field')?.addEventListener('click', e => {
      if (e.target !== input) {
        input.focus();
        abrirCalendario(input);
      }
    });
  });
});

// --- TIPO DE CONSULTA: cambia los campos del formulario ---
function selectTipo(tipo) {
  const clinica = document.getElementById('opt-clinica');
  const estetica = document.getElementById('opt-estetica');

  clinica.classList.remove('selected-dorado', 'selected-rosa');
  estetica.classList.remove('selected-dorado', 'selected-rosa');

  document.querySelectorAll('.fields-clinica').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.fields-estetica').forEach(el => el.classList.remove('active'));

  if (tipo === 'clinica') {
    clinica.classList.add('selected-dorado');
    document.querySelectorAll('.fields-clinica').forEach(el => el.classList.add('active'));
  } else {
    estetica.classList.add('selected-rosa');
    document.querySelectorAll('.fields-estetica').forEach(el => el.classList.add('active'));
  }
}

// --- FOTOS: lee archivos y muestra previsualizaciones ---
function handleFiles(files) {
  const previews = document.getElementById('photoPreviews');
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = /** @type {string} */ (e.target.result);
      const thumb = document.createElement('div');
      thumb.className = 'photo-thumb';

      const inner = document.createElement('div');
      inner.className = 'photo-thumb-inner';
      inner.style.backgroundImage = `url('${dataUrl}')`;
      inner.style.backgroundSize = 'cover';
      inner.style.backgroundPosition = 'center';

      const removeBtn = document.createElement('button');
      removeBtn.className = 'photo-remove-btn';
      removeBtn.textContent = '✕';
      removeBtn.onclick = () => thumb.remove();

      inner.appendChild(removeBtn);
      thumb.appendChild(inner);
      previews.appendChild(thumb);
    };
    reader.readAsDataURL(file);
  });
}

// --- GUARDAR Y GENERAR PDF ---
function guardarYGenerarPDF() {
  const esTipo = document.getElementById('opt-estetica').classList.contains('selected-rosa') ? 'estetica' : 'clinica';
  const tipoLabel = esTipo === 'clinica' ? 'Clínica General' : 'Medicina Estética';
  const paciente = document.querySelector('.patient-chip-name')?.textContent.trim() ?? 'Paciente';

  // Recolectar campos activos
  let filas = '';
  document.querySelectorAll(`.fields-${esTipo}.active`).forEach(field => {
    const label = field.querySelector('label');
    const input = field.querySelector('input, textarea');
    if (!label || !input) return;
    const valor = input.value.trim();
    filas += `
      <div class="campo">
        <div class="campo-label">${label.textContent.trim()}</div>
        <div class="campo-valor">${valor ? valor.replaceAll('\n', '<br>') : ''}</div>
      </div>`;
  });

  const fecha = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Consulta — ${paciente}</title>
<style>
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap");
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Montserrat", sans-serif; font-size: 11px; color: #1a1a1a; background: #fff; padding: 40px 48px; }
  .doc-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 18px; border-bottom: 2px solid #D4AF37; margin-bottom: 24px; }
  .doc-clinica { font-size: 9px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #D4AF37; margin-bottom: 4px; }
  .doc-titulo { font-size: 20px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.01em; }
  .doc-tipo { font-size: 9px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #6b6b6b; margin-top: 4px; }
  .doc-paciente { text-align: right; }
  .doc-paciente-nombre { font-size: 13px; font-weight: 600; color: #1a1a1a; }
  .doc-paciente-sub { font-size: 9px; color: #a8a8a8; margin-top: 3px; font-weight: 300; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; }
  .campo { padding: 12px 14px; border-bottom: 1px solid #f0ebe3; border-right: 1px solid #f0ebe3; }
  .campo:nth-child(even) { border-right: none; }
  .campo-label { font-size: 8px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #D4AF37; margin-bottom: 5px; }
  .campo-valor { font-size: 11px; font-weight: 300; color: #2e2e2e; line-height: 1.65; min-height: 16px; }
  .doc-footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #f0ebe3; display: flex; justify-content: space-between; align-items: flex-end; }
  .firma-linea { width: 180px; border-top: 1px solid #1a1a1a; margin: 0 auto 6px; }
  .firma-texto { font-size: 8.5px; color: #6b6b6b; letter-spacing: 0.08em; text-align: center; }
  .doc-footer-fecha { font-size: 9px; color: #a8a8a8; }
  @media print { body { padding: 24px 32px; } }
</style>
</head>
<body>
<div class="doc-header">
  <div>
    <div class="doc-clinica">Consultorio Médico</div>
    <div class="doc-titulo">Historia Clínica</div>
    <div class="doc-tipo">${tipoLabel}</div>
  </div>
  <div class="doc-paciente">
    <div class="doc-paciente-nombre">${paciente}</div>
    <div class="doc-paciente-sub">Documento generado el ${fecha}</div>
  </div>
</div>
<div class="grid">${filas}</div>
<div class="doc-footer">
  <div class="doc-footer-fecha">Sistema de Gestión — Dra. Ostrizniuk</div>
  <div>
    <div class="firma-linea"></div>
    <div class="firma-texto">Firma y sello del profesional</div>
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const ventana = window.open(url, '_blank', 'width=820,height=900');
  ventana.addEventListener('load', () => {
    ventana.focus();
    ventana.print();
    URL.revokeObjectURL(url);
  });
}
