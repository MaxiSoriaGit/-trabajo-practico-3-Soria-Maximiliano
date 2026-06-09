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