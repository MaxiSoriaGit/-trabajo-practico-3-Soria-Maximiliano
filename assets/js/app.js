// ── URLs de la API ──────────────────────────────────────────
const URL_API_GENERAL    = "https://thesimpsonsapi.com/api/characters";
const URL_API_INDIVIDUAL = "https://thesimpsonsapi.com/api/characters/";
const URL_CDN            = "https://cdn.thesimpsonsapi.com/500";

// ── Arreglo global donde se guardan los 20 personajes ───────
// El buscador filtra sobre este arreglo sin hacer nuevos fetchs
let personajes = [];

// Instancia del modal 
const modalBody = document.querySelector("#modalBody");
const myModal   = new bootstrap.Modal(document.querySelector("#modal"));

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
// ── Fetch del detalle individual ─────────────────────────────
const obtenerDetalle = async (id) => {
  try {
    const response = await fetch(`${URL_API_INDIVIDUAL}${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data; // el endpoint devuelve el objeto directamente, no un array
  } catch (error) {
    console.error("Error al obtener el detalle:", error);
    mostrarAlerta("⚠️ No se pudo cargar el detalle. Intentá de nuevo.");
    return null;
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
// ── Mostrar modal con los datos del personaje ────────────────
const mostrarModal = (personaje) => {
  const urlImg     = construirUrlImagen(personaje.portrait_path);
  const claseBadge = personaje.status === "Alive" ? "badge-alive" : "badge-deceased";
  const edad       = personaje.age !== null ? `${personaje.age} años` : "Desconocida";
  const nacimiento = formatearFecha(personaje.birthdate);

  // Tomamos las primeras 3 frases (puede que algunos tengan pocas)
  const frases = personaje.phrases && personaje.phrases.length > 0
    ? personaje.phrases.slice(0, 3)
    : ["Sin frases registradas."];

  const frasesHTML = frases.map(f => `<div class="modal-frase">"${f}"</div>`).join("");

  // Primer episodio (viene en el endpoint de detalle)
  const ep = personaje.first_appearance_ep;
  const episodioHTML = ep ? `
    <div class="modal-episodio">
      <p class="modal-episodio-label">📺 Primera aparición</p>
      <p class="modal-episodio-nombre">${ep.name}</p>
      <p class="modal-episodio-dato">Temporada ${ep.season} — Episodio ${ep.episode_number}</p>
    </div>
  ` : "";

  modalBody.innerHTML = `
    <div class="modal-inner">
      <img src="${urlImg}" alt="${personaje.name}" class="modal-img"
        onerror="this.src='https://placehold.co/150x150/1a2f4a/7a96b4?text=Sin+imagen'" />
      <h2 class="modal-nombre">${personaje.name}</h2>
      <span class="modal-estado-badge ${claseBadge}">${personaje.status}</span>
      <div class="modal-grid">
        <div class="modal-dato">
          <p class="modal-dato-label">Edad</p>
          <p class="modal-dato-valor">${edad}</p>
        </div>
        <div class="modal-dato">
          <p class="modal-dato-label">Nacimiento</p>
          <p class="modal-dato-valor">${nacimiento}</p>
        </div>
        <div class="modal-dato">
          <p class="modal-dato-label">Género</p>
          <p class="modal-dato-valor">${personaje.gender}</p>
        </div>
        <div class="modal-dato">
          <p class="modal-dato-label">Ocupación</p>
          <p class="modal-dato-valor">${personaje.occupation}</p>
        </div>
      </div>
      ${personaje.description ? `<p class="modal-descripcion">${personaje.description}</p>` : ""}
      <p class="modal-frases-titulo">💬 Frases características</p>
      ${frasesHTML}
      ${episodioHTML}
    </div>
  `;

  myModal.show();
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
// ── Click en "Ver detalle" (delegación de eventos) ───────────
// El listener va en el contenedor, no en cada botón,
// porque los botones se crean dinámicamente y no existen al cargar la página
contenedor.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-ver-detalle")) {

    const idPersonaje = e.target.dataset.id;

    // Mostramos spinner en el modal mientras carga
    modalBody.innerHTML = `
      <div class="modal-loading">
        <div class="spinner-border text-warning" role="status"></div>
        <p class="mt-3">Cargando personaje...</p>
      </div>
    `;
    myModal.show();

    const personaje = await obtenerDetalle(idPersonaje);
    if (personaje) mostrarModal(personaje);
  }
});
// ── Arranque ─────────────────────────────────────────────────
cargarPersonajes();