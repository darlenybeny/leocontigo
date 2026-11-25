export interface Pregunta {
  readonly id: string;
  readonly enunciado: string;
  readonly opciones: readonly string[];
  readonly respuestaCorrecta: string;
  readonly explicacion: string;
}

export interface Lectura {
  readonly id: string;
  readonly titulo: string;
  readonly nivel: number;
  readonly contenido: readonly string[];
  readonly imagen: string;
  readonly preguntas: readonly Pregunta[];
}