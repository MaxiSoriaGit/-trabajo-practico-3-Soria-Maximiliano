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