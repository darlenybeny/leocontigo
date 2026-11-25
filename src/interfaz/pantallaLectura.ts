import type { Lectura } from '../lecturas/tipos';
import './pantallaLectura.css';

export function mostrarPantallaLectura(
  contenedor: HTMLElement,
  lectura: Lectura,
  alComenzarDesafio: () => void,
  alVolverInicio: () => void
): void {
  contenedor.innerHTML = `
    <main class="pantalla-lectura">

      <header class="lectura-navegacion">
        <span class="lectura-marca">
          ✦ Leo<span>Contigo</span>
        </span>

        <button
          class="lectura-volver"
          id="volver-inicio"
          type="button"
        >
          ← Volver al inicio
        </button>
      </header>

      <section class="lectura-aventura">

        <span class="lectura-etiqueta" id="lectura-nivel">
        </span>

        <h1 id="lectura-titulo"></h1>

        <img
          class="lectura-ilustracion"
          id="lectura-imagen"
          alt="Ilustración de la aventura"
        />

        <article class="lectura-libro">

          <div id="lectura-contenido"></div>

          <div class="lectura-acciones">
            <p>¿Estás listo para demostrar lo que aprendiste?</p>

            <button
              class="lectura-comenzar"
              id="comenzar-desafio"
              type="button"
            >
              ¡Comenzar desafío! →
            </button>
          </div>

        </article>

      </section>

    </main>
  `;

  const titulo =
    contenedor.querySelector<HTMLHeadingElement>(
      '#lectura-titulo'
    );

  const nivel =
    contenedor.querySelector<HTMLElement>(
      '#lectura-nivel'
    );

  const imagen =
    contenedor.querySelector<HTMLImageElement>(
      '#lectura-imagen'
    );

  const contenido =
    contenedor.querySelector<HTMLDivElement>(
      '#lectura-contenido'
    );

  if (titulo) {
    titulo.textContent = lectura.titulo;
  }

  if (nivel) {
    nivel.textContent = `✦ Nivel ${lectura.nivel} · Aventura lectora`;
  }

  if (imagen) {
    imagen.src = lectura.imagen;
    imagen.alt = `Ilustración de ${lectura.titulo}`;
  }

  if (contenido) {
    for (const parrafo of lectura.contenido) {
      const elemento = document.createElement('p');
      elemento.textContent = parrafo;
      contenido.appendChild(elemento);
    }
  }

  contenedor
    .querySelector('#comenzar-desafio')
    ?.addEventListener('click', alComenzarDesafio);

  contenedor
    .querySelector('#volver-inicio')
    ?.addEventListener('click', alVolverInicio);
}