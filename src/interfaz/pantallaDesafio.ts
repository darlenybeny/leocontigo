import type { Lectura, Pregunta } from '../lecturas/tipos';
import { esRespuestaCorrecta } from '../evaluacion/esRespuestaCorrecta';
import './pantallaDesafio.css';

type Respuestas = Record<string, string>;

export function mostrarPantallaDesafio(
  contenedor: HTMLElement,
  lectura: Lectura,
  alFinalizar: (respuestas: Respuestas) => void,
  alVolverLectura: () => void
): void {
  let indiceActual = 0;
  const respuestas: Respuestas = {};

  function mostrarPreguntaActual(): void {
    const pregunta = lectura.preguntas[indiceActual];

    if (!pregunta) {
      alFinalizar({ ...respuestas });
      return;
    }

    renderizarEstructura(
      contenedor,
      indiceActual,
      lectura.preguntas.length
    );

    const titulo = contenedor.querySelector('#pregunta-titulo');

    if (titulo) {
      titulo.textContent = pregunta.enunciado;
    }

    mostrarOpciones(contenedor, pregunta, (respuesta) => {
      respuestas[pregunta.id] = respuesta;

      mostrarRetroalimentacion(
        contenedor,
        pregunta,
        respuesta
      );
    });

    contenedor
      .querySelector('#volver-lectura')
      ?.addEventListener('click', alVolverLectura);

    const botonSiguiente =
      contenedor.querySelector<HTMLButtonElement>(
        '#siguiente-pregunta'
      );

    if (botonSiguiente) {
      const esUltimaPregunta =
        indiceActual === lectura.preguntas.length - 1;

      botonSiguiente.textContent = esUltimaPregunta
        ? '¡Ver mis resultados! →'
        : 'Siguiente pregunta →';

      botonSiguiente.addEventListener('click', () => {
        indiceActual++;
        mostrarPreguntaActual();
      });
    }
  }

  mostrarPreguntaActual();
}

function renderizarEstructura(
  contenedor: HTMLElement,
  indiceActual: number,
  totalPreguntas: number
): void {
  const numeroPregunta = indiceActual + 1;
  const progreso = (numeroPregunta / totalPreguntas) * 100;

  contenedor.innerHTML = `
    <main class="pantalla-desafio">

      <header class="desafio-navegacion">
        <span class="desafio-marca">
          ✦ Leo<span>Contigo</span>
        </span>

        <button
          class="desafio-volver"
          id="volver-lectura"
          type="button"
        >
          ← Volver a la lectura
        </button>
      </header>

      <section class="desafio-contenedor">

        <span class="desafio-etiqueta">
          ✦ Desafío de comprensión
        </span>

        <div class="desafio-progreso">
          <div class="desafio-progreso-texto">
            <span>
              Pregunta ${numeroPregunta} de ${totalPreguntas}
            </span>
            <span>${Math.round(progreso)}%</span>
          </div>

          <progress
            class="desafio-barra"
            value="${numeroPregunta}"
            max="${totalPreguntas}"
            aria-label="Avance del desafío"
          ></progress>
        </div>

        <article class="desafio-tarjeta">

          <img
            class="desafio-mascota"
            src="/images/mascota-saludo.png"
            alt="Lumi animándote a responder"
          />

          <h1 id="pregunta-titulo"></h1>

          <p class="desafio-instruccion">
            Seleccioná la respuesta correcta.
          </p>

          <div
            class="desafio-opciones"
            id="pregunta-opciones"
          ></div>

          <div
            id="retroalimentacion"
            class="desafio-retroalimentacion"
            role="status"
            aria-live="polite"
            hidden
          ></div>

          <button
            class="desafio-siguiente"
            id="siguiente-pregunta"
            type="button"
            disabled
          >
            Siguiente pregunta →
          </button>

        </article>

      </section>

    </main>
  `;
}

function mostrarOpciones(
  contenedor: HTMLElement,
  pregunta: Pregunta,
  alSeleccionar: (respuesta: string) => void
): void {
  const opciones =
    contenedor.querySelector('#pregunta-opciones');

  if (!opciones) {
    return;
  }

  pregunta.opciones.forEach((opcion, indice) => {
    const boton = document.createElement('button');
    const letra = document.createElement('span');
    const texto = document.createElement('span');

    boton.type = 'button';
    boton.className = 'desafio-opcion';

    letra.className = 'desafio-letra';
    letra.textContent = String.fromCharCode(65 + indice);

    texto.textContent = opcion;

    boton.append(letra, texto);

    boton.addEventListener('click', () => {
      if (boton.disabled) {
        return;
      }

      bloquearOpciones(contenedor);

      const correcta = esRespuestaCorrecta(
        opcion,
        pregunta.respuestaCorrecta
      );

      boton.classList.add(
        correcta ? 'opcion-correcta' : 'opcion-incorrecta'
      );

      alSeleccionar(opcion);
    });

    opciones.appendChild(boton);
  });
}

function bloquearOpciones(
  contenedor: HTMLElement
): void {
  contenedor
    .querySelectorAll<HTMLButtonElement>('.desafio-opcion')
    .forEach((boton) => {
      boton.disabled = true;
    });
}

function mostrarRetroalimentacion(
  contenedor: HTMLElement,
  pregunta: Pregunta,
  respuesta: string
): void {
  const retroalimentacion =
    contenedor.querySelector<HTMLElement>(
      '#retroalimentacion'
    );

  const botonSiguiente =
    contenedor.querySelector<HTMLButtonElement>(
      '#siguiente-pregunta'
    );

  const correcta = esRespuestaCorrecta(
    respuesta,
    pregunta.respuestaCorrecta
  );

  if (retroalimentacion) {
    const titulo = document.createElement('h2');
    const explicacion = document.createElement('p');

    titulo.textContent = correcta
      ? '🌟 ¡Excelente trabajo!'
      : '💜 ¡Buen intento! Sigamos aprendiendo.';

    explicacion.textContent = pregunta.explicacion;

    retroalimentacion.classList.add(
      correcta
        ? 'retroalimentacion-correcta'
        : 'retroalimentacion-incorrecta'
    );

    retroalimentacion.replaceChildren(
      titulo,
      explicacion
    );

    retroalimentacion.hidden = false;
  }

  if (botonSiguiente) {
    botonSiguiente.disabled = false;
  }
}