import './style.css';

import { mostrarPantallaInicio } from './interfaz/pantallaInicio';
import { mostrarPantallaLectura } from './interfaz/pantallaLectura';
import { mostrarPantallaDesafio } from './interfaz/pantallaDesafio';
import { lecturaDemostracion } from './lecturas/lecturaDemostracion';

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

function irAResultados(): void {
  window.alert('¡Completaste el desafío de comprensión!');
}

irAlInicio();