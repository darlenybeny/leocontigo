
import { describe, it, expect } from 'vitest';
import { obtenerResultado } from './obtenerResultado';

describe('Resultado del desafío', () => {
  it('debe otorgar tres estrellas cuando todas las respuestas son correctas', () => {
    const resultado = obtenerResultado(5, 5);

    expect(resultado.porcentaje).toBe(100);
    expect(resultado.estrellas).toBe(3);
  });

  it('debe otorgar dos estrellas con un desempeño intermedio', () => {
    const resultado = obtenerResultado(4, 5);

    expect(resultado.porcentaje).toBe(80);
    expect(resultado.estrellas).toBe(2);
  });

  it('debe otorgar dos estrellas al alcanzar el 60 por ciento', () => {
    const resultado = obtenerResultado(3, 5);

    expect(resultado.porcentaje).toBe(60);
    expect(resultado.estrellas).toBe(2);
  });

  it('debe otorgar dos estrellas con un 99 por ciento', () => {
    const resultado = obtenerResultado(99, 100);

    expect(resultado.porcentaje).toBe(99);
    expect(resultado.estrellas).toBe(2);
  });

  it('debe otorgar una estrella con un desempeño bajo', () => {
    const resultado = obtenerResultado(2, 5);

    expect(resultado.porcentaje).toBe(40);
    expect(resultado.estrellas).toBe(1);
  });

  it('debe otorgar una estrella con un 59 por ciento', () => {
    const resultado = obtenerResultado(59, 100);

    expect(resultado.porcentaje).toBe(59);
    expect(resultado.estrellas).toBe(1);
  });

  it('debe reconocer el esfuerzo aunque no existan respuestas correctas', () => {
    const resultado = obtenerResultado(0, 5);

    expect(resultado.porcentaje).toBe(0);
    expect(resultado.estrellas).toBe(1);
  });

  it('debe evitar la división entre cero cuando no existen preguntas', () => {
    const resultado = obtenerResultado(0, 0);

    expect(resultado.porcentaje).toBe(0);
    expect(resultado.estrellas).toBe(0);
  });
});
