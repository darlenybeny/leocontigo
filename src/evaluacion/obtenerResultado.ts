
const PORCENTAJE_PERFECTO = 100;
const PORCENTAJE_INTERMEDIO = 60;

export interface Resultado {
  readonly porcentaje: number;
  readonly estrellas: number;
}

export function obtenerResultado(
  puntaje: number,
  totalPreguntas: number
): Resultado {
  if (totalPreguntas === 0) {
    return {
      porcentaje: 0,
      estrellas: 0
    };
  }

  const porcentaje = (puntaje / totalPreguntas) * 100;

  return {
    porcentaje: Math.round(porcentaje),
    estrellas: determinarEstrellas(porcentaje)
  };
}

function determinarEstrellas(
  porcentaje: number
): number {
  if (porcentaje === PORCENTAJE_PERFECTO) {
    return 3;
  }

  if (porcentaje >= PORCENTAJE_INTERMEDIO) {
    return 2;
  }

  return 1;
}
