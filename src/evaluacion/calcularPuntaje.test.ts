import { describe, expect, it } from 'vitest';
import { calcularPuntaje } from './calcularPuntaje';
import type { Pregunta } from '../lecturas/tipos';

const preguntas: readonly Pregunta[] = [
  {
    id: 'p1',
    enunciado: '¿Qué encontró Lumi?',
    opciones: ['Un libro', 'Una piedra'],
    respuestaCorrecta: 'Un libro',
    explicacion: 'Lumi encontró un libro.'
  },
  {
    id: 'p2',
    enunciado: '¿A quién ayudó Lumi?',
    opciones: ['A una ardilla', 'A un dragón'],
    respuestaCorrecta: 'A una ardilla',
    explicacion: 'Lumi ayudó a una ardilla.'
  }
];

describe('Cálculo del puntaje', () => {
  it('debe otorgar un punto por cada respuesta correcta', () => {
    const respuestas = {
      p1: 'Un libro',
      p2: 'A una ardilla'
    };

    expect(calcularPuntaje(preguntas, respuestas)).toBe(2);
  });

  it('debe contar únicamente las respuestas correctas', () => {
    const respuestas = {
      p1: 'Un libro',
      p2: 'A un dragón'
    };

    expect(calcularPuntaje(preguntas, respuestas)).toBe(1);
  });

  it('debe devolver cero si todas las respuestas son incorrectas', () => {
    const respuestas = {
      p1: 'Una piedra',
      p2: 'A un dragón'
    };

    expect(calcularPuntaje(preguntas, respuestas)).toBe(0);
  });

  it('debe devolver cero cuando no hay preguntas', () => {
    expect(calcularPuntaje([], {})).toBe(0);
  });

  it('no debe sumar puntos por preguntas sin responder', () => {
    const respuestas = {
      p1: 'Un libro'
    };

    expect(calcularPuntaje(preguntas, respuestas)).toBe(1);
  });
});