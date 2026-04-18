/**
 * DICCIONARIO DE DATOS TEMPORALES (Simulación de Base de Datos)
 * Usamos un Array de Objetos para facilitar el uso de .filter() y .find()
 */
const DATOS_PACIENTES = [
    { id: "28.441.200", nombre: "María González", tipo: "Estética", ultimoTurno: "Hoy", tratamiento: "Relleno de labios", estado: "Turno hoy", avatar: "MG" },
    { id: "25.118.440", nombre: "Luciana Martínez", tipo: "Clínica", ultimoTurno: "31 mar 2026", tratamiento: "Control HTA", estado: "Seguimiento", avatar: "LM" },
    { id: "19.332.550", nombre: "Roberto Gómez", tipo: "Ambas", ultimoTurno: "Hoy", tratamiento: "Tratamiento Integral", estado: "Turno hoy", avatar: "RG" },
    { id: "18.772.110", nombre: "Carolina Pérez", tipo: "Estética", ultimoTurno: "28 mar 2026", tratamiento: "Lifting de cejas", estado: "Activa", avatar: "CP" },
    { id: "32.905.788", nombre: "Ana Rodríguez", tipo: "Estética", ultimoTurno: "Hoy", tratamiento: "Botox preventivo", estado: "Turno hoy", avatar: "AR" },
    { id: "22.114.332", nombre: "Carlos Solari", tipo: "Clínica", ultimoTurno: "10 abr 2026", tratamiento: "Diabetes T2", estado: "Activa", avatar: "CS" },
    { id: "35.221.009", nombre: "Brenda López", tipo: "Estética", ultimoTurno: "05 abr 2026", tratamiento: "Peeling químico", estado: "Seguimiento", avatar: "BL" },
    { id: "29.887.441", nombre: "Julián Castro", tipo: "Ambas", ultimoTurno: "08 abr 2026", tratamiento: "Limpieza profunda", estado: "Activa", avatar: "JC" },
    { id: "14.552.118", nombre: "Marta Sánchez", tipo: "Clínica", ultimoTurno: "Hoy", tratamiento: "Control Post-Op", estado: "Turno hoy", avatar: "MS" },
    { id: "40.111.998", nombre: "Facundo Díaz", tipo: "Estética", ultimoTurno: "12 abr 2026", tratamiento: "Rinomodelación", estado: "Seguimiento", avatar: "FD" },
    { id: "33.221.554", nombre: "Elena Rivas", tipo: "Estética", ultimoTurno: "02 abr 2026", tratamiento: "Bioestimuladores", estado: "Activa", avatar: "ER" },
    { id: "27.443.110", nombre: "Pedro Vaca", tipo: "Clínica", ultimoTurno: "14 abr 2026", tratamiento: "Alergias", estado: "Activa", avatar: "PV" },
    { id: "11.223.334", nombre: "Inés Torres", tipo: "Ambas", ultimoTurno: "Hoy", tratamiento: "Dermoabrasión", estado: "Turno hoy", avatar: "IT" },
    { id: "38.990.221", nombre: "Laura Meza", tipo: "Estética", ultimoTurno: "11 abr 2026", tratamiento: "Mesoterapia", estado: "Seguimiento", avatar: "LM" },
    { id: "20.551.992", nombre: "Raúl Fernández", tipo: "Clínica", ultimoTurno: "09 abr 2026", tratamiento: "Cardiología", estado: "Activa", avatar: "RF" }
];

// Variables de estado para el filtrado y paginación
let busquedaActual = "";
let filtroTipo = "Todos";
let paginaActual = 1;
const pacientesPorPagina = 6;

/**
 * Normaliza el texto eliminando tildes y caracteres especiales
 */
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replaceAll(/[\u0300-\u036f]/g, ""); // Elimina diacríticos (tildes)
}

/**
 * Función para renderizar la tabla de pacientes
 */
function renderizarTabla() {
    const tbody = document.getElementById('patientTableBody');
    if (!tbody) return;

    // Término de búsqueda normalizado
    const terminoNormalizado = normalizarTexto(busquedaActual);
    const dniBusquedaLimpio = busquedaActual.replaceAll(/\D/g, ""); // Solo números para el DNI

    // 1. FILTRAR
    let pacientesProcesados = DATOS_PACIENTES.filter(p => {
        const nombreNormalizado = normalizarTexto(p.nombre);
        const dniPacienteLimpio = p.id.replaceAll(/\D/g, "");
        
        const coincideTermino = 
            nombreNormalizado.includes(terminoNormalizado) || 
            (dniBusquedaLimpio !== "" && dniPacienteLimpio.includes(dniBusquedaLimpio));

        let coincideFiltro = true;
        if (filtroTipo === "Activos") {
            coincideFiltro = p.estado === "Activa" || p.estado === "Turno hoy";
        } else if (filtroTipo === "Turno hoy") {
            coincideFiltro = p.estado === "Turno hoy";
        } else if (filtroTipo === "Seguimiento") {
            coincideFiltro = p.estado === "Seguimiento";
        } else if (filtroTipo === "Estética" || filtroTipo === "Clínica") {
            coincideFiltro = p.tipo === filtroTipo || p.tipo === "Ambas";
        }

        return coincideTermino && coincideFiltro;
    });

    // 2. ORDENAR (Criterio: Turno hoy primero)
    pacientesProcesados.sort((a, b) => {
        if (a.estado === "Turno hoy" && b.estado !== "Turno hoy") return -1;
        if (a.estado !== "Turno hoy" && b.estado === "Turno hoy") return 1;
        return a.nombre.localeCompare(b.nombre);
    });

    // 3. PAGINAR
    const totalResultados = pacientesProcesados.length;
    const inicio = (paginaActual - 1) * pacientesPorPagina;
    const fin = inicio + pacientesPorPagina;
    const pacientesPaginados = pacientesProcesados.slice(inicio, fin);

    // 4. RENDERIZAR
    tbody.innerHTML = "";
    pacientesPaginados.forEach(p => {
        const tr = document.createElement('tr');
        tr.tabIndex = 0;
        tr.className = p.estado === "Turno hoy" ? "patient-row highlight-row" : "patient-row";
        tr.onclick = () => globalThis.location.href = 'detalle-paciente.html';
        tr.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') globalThis.location.href = 'detalle-paciente.html'; };

        let claseTipo = p.tipo === "Estética" ? "tipo-estetica" : (p.tipo === "Clínica" ? "tipo-clinica" : "tipo-ambas");
        let claseEstado = p.estado === "Seguimiento" ? "estado-seguimiento" : (p.estado === "Turno hoy" ? "estado-hoy" : "estado-activa");

        tr.innerHTML = `
            <td>
                <div class="patient-cell">
                    <div class="patient-avatar ${p.tipo === 'Clínica' ? 'gray' : ''}">${p.avatar}</div>
                    <div>
                        <span class="patient-name">${p.nombre}</span>
                        <span class="patient-sub">DNI ${p.id}</span>
                    </div>
                </div>
            </td>
            <td><span class="tipo-badge ${claseTipo}">${p.tipo}</span></td>
            <td>${p.ultimoTurno}</td>
            <td>${p.tratamiento}</td>
            <td><span class="estado-badge ${claseEstado}">${p.estado}</span></td>
            <td>
                <button class="btn-ver ${p.estado === 'Turno hoy' ? 'highlight' : ''}" 
                        onclick="event.stopPropagation(); globalThis.location.href='detalle-paciente.html'">
                    Ver ficha
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    renderizarPaginacion(totalResultados);
}

/**
 * Renderiza los controles de paginación
 */
function renderizarPaginacion(totalItems) {
    const contenedor = document.getElementById('pagination');
    if (!contenedor) return;

    const totalPaginas = Math.ceil(totalItems / pacientesPorPagina);
    contenedor.innerHTML = "";

    if (totalPaginas <= 1) return; // No mostrar si hay una sola página

    // Botón Anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.innerText = "«";
    btnAnterior.disabled = paginaActual === 1;
    btnAnterior.onclick = () => { paginaActual--; renderizarTabla(); };
    contenedor.appendChild(btnAnterior);

    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        const btnPagina = document.createElement('button');
        btnPagina.innerText = i;
        btnPagina.className = i === paginaActual ? "active" : "";
        btnPagina.onclick = () => { paginaActual = i; renderizarTabla(); };
        contenedor.appendChild(btnPagina);
    }

    // Botón Siguiente
    const btnSiguiente = document.createElement('button');
    btnSiguiente.innerText = "»";
    btnSiguiente.disabled = paginaActual === totalPaginas;
    btnSiguiente.onclick = () => { paginaActual++; renderizarTabla(); };
    contenedor.appendChild(btnSiguiente);
}

/**
 * Inicialización de Event Listeners
 */
document.addEventListener('DOMContentLoaded', () => {
    const inputBusqueda = document.getElementById('searchInput');
    const botonesFiltro = document.querySelectorAll('.filter-btn');

    // Manejar búsqueda en tiempo real
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            busquedaActual = e.target.value;
            paginaActual = 1; // Resetear página
            renderizarTabla();
        });
    }

    // Manejar clics en los botones de filtro
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesFiltro.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const texto = btn.innerText.trim();
            filtroTipo = texto;
            paginaActual = 1; // Resetear página
            renderizarTabla();
        });
    });

    // Render inicial
    renderizarTabla();
});


/**
 * Inicialización de Event Listeners
 */
document.addEventListener('DOMContentLoaded', () => {
    const inputBusqueda = document.getElementById('searchInput');
    const botonesFiltro = document.querySelectorAll('.filter-btn');

    // Manejar búsqueda en tiempo real
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            busquedaActual = e.target.value;
            renderizarTabla();
        });
    }

    // Manejar clics en los botones de filtro
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar clase visual
            botonesFiltro.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Actualizar filtro lógico (usamos el texto del botón por ahora)
            const texto = btn.innerText.trim();
            filtroTipo = texto;
            renderizarTabla();
        });
    });

    // Render inicial
    renderizarTabla();
});
