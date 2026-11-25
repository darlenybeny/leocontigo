
import './style.css';

import { mostrarPantallaInicio } from './interfaz/pantallaInicio';
import { mostrarPantallaLectura } from './interfaz/pantallaLectura';
import { mostrarPantallaDesafio } from './interfaz/pantallaDesafio';
import { mostrarPantallaResultados } from './interfaz/pantallaResultados';

import { lecturaDemostracion } from './lecturas/lecturaDemostracion';

import { calcularPuntaje } from './evaluacion/calcularPuntaje';
import { obtenerResultado } from './evaluacion/obtenerResultado';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('No se encontró el contenedor de LeoContigo');
}

const contenedor: HTMLElement = app;

function irAlInicio(): void {
  mostrarPantallaInicio(contenedor, irALectura);
  window.scrollTo(0, 0);
}

function irALectura(): void {
  mostrarPantallaLectura(
    contenedor,
    lecturaDemostracion,
    irAlDesafio,
    irAlInicio
  );

  window.scrollTo(0, 0);
}

function irAlDesafio(): void {
  mostrarPantallaDesafio(
    contenedor,
    lecturaDemostracion,
    irAResultados,
    irALectura
  );

  window.scrollTo(0, 0);
}

function irAResultados(
  respuestas: Readonly<Record<string, string>>
): void {
  const preguntas = lecturaDemostracion.preguntas;
  const totalPreguntas = preguntas.length;

  const puntaje = calcularPuntaje(
    preguntas,
    respuestas
  );

  const resultado = obtenerResultado(
    puntaje,
    totalPreguntas
  );

  mostrarPantallaResultados(
    contenedor,
    puntaje,
    totalPreguntas,
    resultado,
    irALectura,
    irAlInicio
  );

  window.scrollTo(0, 0);
}

irAlInicio();
