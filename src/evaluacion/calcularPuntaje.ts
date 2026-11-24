import type { Pregunta } from '../lecturas/tipos';
import { esRespuestaCorrecta } from './esRespuestaCorrecta';

export function calcularPuntaje(
  preguntas: readonly Pregunta[],
  respuestas: Readonly<Record<string, string>>
): number {
  let puntaje = 0;

  for (const pregunta of preguntas) {
    const respuestaEstudiante = respuestas[pregunta.id];

    if (
      respuestaEstudiante !== undefined &&
      esRespuestaCorrecta(
        respuestaEstudiante,
        pregunta.respuestaCorrecta
      )
    ) {
      puntaje++;
    }
  }

  return puntaje;
}