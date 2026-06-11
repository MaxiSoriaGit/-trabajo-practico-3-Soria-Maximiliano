# Los Simpson — Trabajo Práctico III

Aplicación web desarrollada para la materia **Programación** de la **Tecnicatura Superior en Desarrollo de Software Multiplataforma** — Instituto Politécnico Formosa (Dr. Alberto Zorrilla).

---

## Vista previa

La app muestra los 20 personajes más icónicos de Springfield, permite buscarlos por nombre y ver su ficha completa en un modal con imagen, datos personales, descripción, frases características y primer episodio.

---

## Funcionalidades

| #   | Función              | Descripción                                                                            |
| --- | -------------------- | -------------------------------------------------------------------------------------- |
| 1   | **Listado**          | Al cargar la página se hace un `fetch` al endpoint general y se renderizan 20 tarjetas |
| 2   | **Buscador**         | Filtra sobre el arreglo local en tiempo real, sin nuevas consultas a la API            |
| 3   | **Validación**       | El buscador valida campo vacío y muestra mensaje si no hay resultados                  |
| 4   | **Modal de detalle** | Click en "Ver detalle" → `fetch` individual por ID → modal con info completa           |
| 5   | **Contador**         | Muestra cuántos resultados se están viendo respecto al total                           |
| 6   | **Botón limpiar**    | Aparece al buscar; al clickearlo resetea el filtro y vuelve al listado completo        |

---

## Estructura de archivos

```
trabajo-practico-3-apellido-nombre/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

---

## Tecnologías

- **HTML5** — estructura semántica
- **CSS3** — variables, animaciones, grid, responsive
- **JavaScript ES6+** — `async/await`, `fetch`, arrow functions, template literals, delegación de eventos
- **Bootstrap 5.3.8** — modal, spinner, grid, utilidades
- **Google Fonts** — Bangers + Nunito

---

## API utilizada

| Endpoint                                             | Descripción                      |
| ---------------------------------------------------- | -------------------------------- |
| `GET https://thesimpsonsapi.com/api/characters`      | Primera página con 20 personajes |
| `GET https://thesimpsonsapi.com/api/characters/{id}` | Detalle completo de un personaje |

**Imágenes:**
La API devuelve `portrait_path` como ruta relativa (ej: `/character/1.webp`).
La URL completa se construye concatenando el CDN base:

```
https://cdn.thesimpsonsapi.com/500/character/1.webp
```

---

## Estructura de la respuesta JSON

```js
// GET /api/characters
{
  count: 1182,
  results: [
    {
      id: 1,
      name: "Homer Simpson",
      age: 39,
      birthdate: "1956-05-12",
      gender: "Male",
      occupation: "Safety Inspector",
      portrait_path: "/character/1.webp",
      status: "Alive",
      phrases: ["Doh!", "Woo-hoo!", ...]
    },
    ...
  ]
}

// GET /api/characters/1  (detalle — campos adicionales)
{
  ...
  description: "Homer Jay Simpson es...",
  first_appearance_ep: {
    name: "Simpsons Roasting on an Open Fire",
    season: 1,
    episode_number: 1,
    airdate: "1989-12-17"
  }
}
```

---

## Conceptos de JavaScript aplicados

- **Asincronía:** `async/await` con `try/catch` en todas las llamadas a la API
- **Arreglos:** almacenamiento global, `.filter()`, `.forEach()`, `.slice()`, `.map()`
- **Objetos:** acceso a propiedades anidadas del JSON
- **Funciones:** una por responsabilidad (`obtenerPersonajes`, `obtenerDetalle`, `renderizarTarjetas`, `mostrarModal`, `filtrarPersonajes`, `limpiarContenedor`)
- **DOM:** manipulación dinámica con `innerHTML`, `querySelector`, `classList`
- **Eventos:** `addEventListener`, delegación de eventos en el contenedor, `dataset`
- **Estructuras de control:** `if/else`, operador ternario, `&&` para renderizado condicional

---

## Ramas de trabajo

| Rama                         | Descripción                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| `main`                       | Rama principal — entrega final                              |
| `feature/listado-personajes` | Fetch inicial, arreglo global, tarjetas, buscador, filtrado |
| `feature/detalle-modal`      | Fetch individual, modal de Bootstrap, frases, episodio      |

---

## Cómo ejecutar

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/trabajo-practico-3-apellido-nombre.git

# 2. Entrar a la carpeta
cd trabajo-practico-3-apellido-nombre

# 3. Abrir index.html en el navegador
#    (o usar Live Server desde VS Code)
```

> No requiere instalación de dependencias ni servidor backend.
> La API es pública y no necesita autenticación.

---

## Autor

**Nombre Apellido**
Tecnicatura Superior en Desarrollo de Software Multiplataforma
Instituto Politécnico Formosa — 2025
