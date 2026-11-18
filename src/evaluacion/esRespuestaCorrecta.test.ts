
import { describe, expect, test } from 'vitest';
import { esRespuestaCorrecta } from './esRespuestaCorrecta';

describe('Evaluación de respuestas', () => {
  test('debe aceptar una respuesta correcta', () => {
    // Arrange: preparar los datos
    const respuestaEstudiante = 'B';
    const respuestaEsperada = 'B';

    // Act: ejecutar la función
    const resultado = esRespuestaCorrecta(
      respuestaEstudiante,
      respuestaEsperada
    );

    // Assert: verificar el resultado
    expect(resultado).toBe(true);
  });

  test('debe rechazar una respuesta incorrecta', () => {
  // Arrange
  const respuestaEstudiante = 'A';
  const respuestaEsperada = 'B';

  // Act
  const resultado = esRespuestaCorrecta(
    respuestaEstudiante,
    respuestaEsperada
  );

  // Assert
  expect(resultado).toBe(false);
});
  
});
