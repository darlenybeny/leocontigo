import './style.css';
import { mostrarPantallaInicio } from './interfaz/pantallaInicio';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('No se encontró el contenedor de LeoContigo');
}

mostrarPantallaInicio(app);