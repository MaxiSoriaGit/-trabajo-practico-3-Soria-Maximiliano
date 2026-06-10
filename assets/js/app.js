// ── URLs de la API ──────────────────────────────────────────
const URL_API_GENERAL    = "https://thesimpsonsapi.com/api/characters";
const URL_API_INDIVIDUAL = "https://thesimpsonsapi.com/api/characters/";
const URL_CDN            = "https://cdn.thesimpsonsapi.com/500";

// ── Arreglo global donde se guardan los 20 personajes ───────
// El buscador filtra sobre este arreglo sin hacer nuevos fetchs
let personajes = [];

// ── Referencias al DOM ──────────────────────────────────────
const contenedor         = document.querySelector("#contenedor");
const inputBusqueda      = document.querySelector("#inputBusqueda");
const btnBuscar          = document.querySelector("#btnBuscar");
const btnLimpiar         = document.querySelector("#btnLimpiar");
const mensajeAlerta      = document.querySelector("#mensajeAlerta");
const contadorResultados = document.querySelector("#contadorResultados");

// ── Helpers ─────────────────────────────────────────────────

// Construye la URL completa de la imagen concatenando el CDN
const construirUrlImagen = (portraitPath) => `${URL_CDN}${portraitPath}`;

// Convierte "1956-05-12" en "12/05/1956", o devuelve "Desconocida"
const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "Desconocida";
  const [anio, mes, dia] = fechaStr.split("-");
  return `${dia}/${mes}/${anio}`;
};

// ── Fetch del listado general ────────────────────────────────
const obtenerPersonajes = async () => {
  try {
    const response = await fetch(URL_API_GENERAL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.results; // la API responde { count, results: [...] }
  } catch (error) {
    console.error("Error al obtener el listado:", error);
    mostrarAlerta("⚠️ No se pudo cargar la lista de personajes.");
    return [];
  }
};

// ── Funciones de UI ──────────────────────────────────────────

const mostrarAlerta = (texto) => {
  mensajeAlerta.textContent = texto;
  mensajeAlerta.classList.remove("d-none");
};

const ocultarAlerta = () => {
  mensajeAlerta.classList.add("d-none");
  mensajeAlerta.textContent = "";
};

const actualizarContador = (cantidad, total) => {
  if (cantidad === total) {
    contadorResultados.classList.add("d-none");
  } else {
    contadorResultados.textContent = `${cantidad} resultado${cantidad !== 1 ? "s" : ""} de ${total}`;
    contadorResultados.classList.remove("d-none");
  }
};

const limpiarContenedor = () => {
  contenedor.innerHTML = "";
};

// ── Renderizado de tarjetas ──────────────────────────────────
const renderizarTarjetas = (lista) => {
  limpiarContenedor();
  ocultarAlerta();

  if (lista.length === 0) {
    mostrarAlerta("🔍 No se encontraron personajes con ese nombre.");
    actualizarContador(0, personajes.length);
    return;
  }

  lista.forEach((personaje) => {
    const urlImg     = construirUrlImagen(personaje.portrait_path);
    const claseBadge = personaje.status === "Alive" ? "badge-alive" : "badge-deceased";
    const textoEstado = personaje.status === "Alive" ? "● Alive" : "● Deceased";

    contenedor.innerHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card-personaje">
          <div class="card-img-wrapper">
            <img src="${urlImg}" alt="${personaje.name}" loading="lazy"
              onerror="this.src='https://placehold.co/210x210/1a2f4a/7a96b4?text=Sin+imagen'" />
            <span class="badge-estado ${claseBadge}">${textoEstado}</span>
          </div>
          <div class="card-body-custom">
            <h5 class="card-nombre">${personaje.name}</h5>
            <p class="card-ocupacion">💼 ${personaje.occupation}</p>
            <button class="btn-ver-detalle" data-id="${personaje.id}">Ver detalle</button>
          </div>
        </div>
      </div>
    `;
  });

  actualizarContador(lista.length, personajes.length);
};

// ── Filtrado (sin nuevo fetch) ───────────────────────────────
const filtrarPersonajes = () => {
  const termino = inputBusqueda.value.trim();

  if (termino === "") {
    mostrarAlerta("✏️ Ingresá un nombre para buscar.");
    return;
  }

  const resultado = personajes.filter((p) =>
    p.name.toLowerCase().includes(termino.toLowerCase())
  );

  renderizarTarjetas(resultado);
  btnLimpiar.classList.remove("d-none");
};

// ── Inicialización ───────────────────────────────────────────
const cargarPersonajes = async () => {
  contenedor.innerHTML = `
    <div class="col-12">
      <div class="spinner-wrapper">
        <div class="spinner-border text-warning" style="width:3rem;height:3rem;" role="status"></div>
        <p>Cargando personajes...</p>
      </div>
    </div>
  `;
  personajes = await obtenerPersonajes();
  renderizarTarjetas(personajes);
};

// ── Event listeners del buscador ────────────────────────────
btnBuscar.addEventListener("click", filtrarPersonajes);

inputBusqueda.addEventListener("keydown", (e) => {
  if (e.key === "Enter") filtrarPersonajes();
});

inputBusqueda.addEventListener("input", () => {
  if (inputBusqueda.value.trim() === "") {
    renderizarTarjetas(personajes);
    btnLimpiar.classList.add("d-none");
  }
});

btnLimpiar.addEventListener("click", () => {
  inputBusqueda.value = "";
  btnLimpiar.classList.add("d-none");
  renderizarTarjetas(personajes);
});

// ── Arranque ─────────────────────────────────────────────────
cargarPersonajes();