
import type { Resultado } from '../evaluacion/obtenerResultado';
import './pantallaResultados.css';

const TOTAL_ESTRELLAS = 3;

export function mostrarPantallaResultados(
  contenedor: HTMLElement,
  puntaje: number,
  totalPreguntas: number,
  resultado: Resultado,
  alReintentar: () => void,
  alVolverInicio: () => void
): void {
  contenedor.innerHTML = `
    <main class="pantalla-resultados">

      <header class="resultados-navegacion">
        <span class="resultados-marca">
          ✦ Leo<span>Contigo</span>
        </span>
      </header>

      <section class="resultados-contenedor">

        <span class="resultados-etiqueta">
          ✦ ¡Aventura completada!
        </span>

        <h1 id="resultados-titulo"></h1>

        <img
          class="resultados-mascota"
          src="/images/mascota-saludo.png"
          alt="Lumi celebrando tu aventura lectora"
        />

        <div
          class="resultados-estrellas"
          id="resultados-estrellas"
        ></div>

        <p
          class="resultados-recompensa"
          id="resultados-recompensa"
        ></p>

        <article class="resultados-tarjeta">

          <div class="resultados-estadisticas">

            <div class="resultado-dato">
              <span>Respuestas correctas</span>
              <strong id="resultados-puntaje"></strong>
            </div>

            <div class="resultado-dato resultado-porcentaje">
              <span>Comprensión lectora</span>
              <strong id="resultados-porcentaje"></strong>
            </div>

          </div>

          <div class="resultados-mensaje">
            <span aria-hidden="true">💜</span>
            <p id="resultados-mensaje"></p>
          </div>

          <div class="resultados-acciones">

            <button
              class="resultados-reintentar"
              id="reintentar-desafio"
              type="button"
            >
              ↻ Volver a intentarlo
            </button>

            <button
              class="resultados-inicio"
              id="resultados-volver-inicio"
              type="button"
            >
              Volver al inicio
            </button>

          </div>

        </article>

      </section>

    </main>
  `;

  mostrarEstadisticas(
    contenedor,
    puntaje,
    totalPreguntas,
    resultado
  );

  mostrarEstrellas(contenedor, resultado.estrellas);

  mostrarMensajeMotivador(
    contenedor,
    resultado.estrellas
  );

  contenedor
    .querySelector('#reintentar-desafio')
    ?.addEventListener('click', alReintentar);

  contenedor
    .querySelector('#resultados-volver-inicio')
    ?.addEventListener('click', alVolverInicio);
}

function mostrarEstadisticas(
  contenedor: HTMLElement,
  puntaje: number,
  totalPreguntas: number,
  resultado: Resultado
): void {
  const elementoPuntaje =
    contenedor.querySelector('#resultados-puntaje');

  const elementoPorcentaje =
    contenedor.querySelector('#resultados-porcentaje');

  if (elementoPuntaje) {
    elementoPuntaje.textContent =
      `${puntaje}/${totalPreguntas}`;
  }

  if (elementoPorcentaje) {
    elementoPorcentaje.textContent =
      `${resultado.porcentaje}%`;
  }
}

function mostrarEstrellas(
  contenedor: HTMLElement,
  cantidad: number
): void {
  const estrellas =
    contenedor.querySelector('#resultados-estrellas');

  const recompensa =
    contenedor.querySelector('#resultados-recompensa');

  if (estrellas) {
    estrellas.setAttribute('role', 'img');

    estrellas.setAttribute(
      'aria-label',
      `${cantidad} de ${TOTAL_ESTRELLAS} estrellas`
    );

    for (let indice = 0; indice < TOTAL_ESTRELLAS; indice++) {
      const estrella = document.createElement('span');

      estrella.textContent = '★';

      estrella.className = indice < cantidad
        ? 'estrella-obtenida'
        : 'estrella-pendiente';

      estrella.setAttribute('aria-hidden', 'true');

      estrellas.appendChild(estrella);
    }
  }

  if (recompensa) {
    const unidad = cantidad === 1
      ? 'estrella'
      : 'estrellas';

    recompensa.textContent =
      `¡Conseguiste ${cantidad} ${unidad}!`;
  }
}

function mostrarMensajeMotivador(
  contenedor: HTMLElement,
  estrellas: number
): void {
  const titulo =
    contenedor.querySelector('#resultados-titulo');

  const mensaje =
    contenedor.querySelector('#resultados-mensaje');

  if (!titulo || !mensaje) {
    return;
  }

  if (estrellas === TOTAL_ESTRELLAS) {
    titulo.textContent = '¡Lo hiciste increíble!';

    mensaje.textContent =
      '¡Lumi está muy orgulloso de vos! Comprendiste toda la historia. Seguí descubriendo nuevas aventuras.';

    return;
  }

  if (estrellas === 2) {
    titulo.textContent = '¡Excelente aventura!';

    mensaje.textContent =
      '¡Vas por muy buen camino! Cada lectura te ayuda a aprender algo nuevo. Seguí practicando.';

    return;
  }

  titulo.textContent = '¡Cada intento cuenta!';

  mensaje.textContent =
    'Lumi sabe que aprender lleva tiempo. No te rindás, volvé a leer la historia y seguí intentándolo.';
}
