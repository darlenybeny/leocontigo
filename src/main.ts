
import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="contenedor">
    <section class="bienvenida">
      <span class="etiqueta">¡Aprender es una aventura!</span>

      <h1>Bienvenidos a LeoContigo 📚</h1>

      <p class="descripcion">
        Un espacio mágico para descubrir historias,
        practicar la comprensión lectora y aprender
        jugando.
      </p>

      <div class="acciones">
        <button id="comenzar" type="button">
          ¡Comenzar aventura!
        </button>
      </div>

      <p id="mensaje" aria-live="polite"></p>
    </section>
  </main>
`;

const botonComenzar = document.querySelector<HTMLButtonElement>('#comenzar');
const mensaje = document.querySelector<HTMLParagraphElement>('#mensaje');

botonComenzar?.addEventListener('click', () => {
  if (mensaje) {
    mensaje.textContent = '¡Pronto descubriremos nuestra primera historia!';
  }
});
