
export function mostrarPantallaInicio(
  contenedor: HTMLElement,
  alExplorarLectura: () => void
): void {
  contenedor.innerHTML = `
    <header class="encabezado">
      <nav class="navegacion" aria-label="Navegación principal">
        <a class="logo" href="#inicio" aria-label="LeoContigo, inicio">
          <span class="logo-icono" aria-hidden="true">✦</span>
          <span>Leo<span class="logo-acento">Contigo</span></span>
          <span class="logo-destello" aria-hidden="true">✦</span>
        </a>

        <div class="enlaces">
          <a href="#inicio">Inicio</a>
          <a href="#conocenos">Conócenos</a>
          <a href="#lecturas">Lecturas</a>
          <a href="#como-funciona">¿Cómo funciona?</a>
        </div>

        <a class="nav-lecturas" href="#lecturas">
          Explorar lecturas
        </a>
      </nav>
    </header>

    <main>
      <!-- INICIO PÚBLICO -->
      <section class="hero" id="inicio">
        <div class="hero-interior">
          <div class="hero-contenido">
            <span class="etiqueta">
              ✨ ¡Aprender es una aventura!
            </span>

            <h1>
              ¡Cada historia es<br />
              una nueva aventura!
            </h1>

            <p class="hero-descripcion">
              Descubrí un mundo de lecturas, personajes y desafíos
              donde aprender es divertido.
            </p>

            <div class="accesos">
              <button
                class="boton boton-estudiante"
                type="button"
                data-acceso="estudiante"
              >
                Soy estudiante
                <span aria-hidden="true">➜</span>
              </button>

              <button
                class="boton boton-docente"
                type="button"
                data-acceso="docente"
              >
                Soy docente
                <span aria-hidden="true">➜</span>
              </button>
            </div>

            <button
              class="boton-demostracion"
              type="button"
              data-lectura-demostracion
            >
              <span aria-hidden="true">✦</span>
              Explorar una lectura de demostración
            </button>

            <p
              id="aviso-acceso"
              class="aviso-acceso"
              role="status"
              aria-live="polite"
            ></p>
          </div>

          <div class="hero-ilustracion">
            <img
              class="imagen-mascota"
              src="/images/mascota-lectora.png"
              alt="Mascota azul y esponjosa de LeoContigo leyendo un libro mágico"
              fetchpriority="high"
            />
          </div>
        </div>

        <div class="decoraciones-inferiores" aria-hidden="true">
          <img
            class="nubes-izquierda"
            src="/images/nubes-plantas.png"
            alt=""
          />
          <img
            class="nubes-derecha"
            src="/images/nubes-plantas.png"
            alt=""
          />
        </div>
      </section>

      <!-- CARACTERÍSTICAS -->
      <section class="seccion caracteristicas" id="como-funciona">
        <div class="titulo-seccion">
          <span class="decoracion-titulo" aria-hidden="true">✦</span>
          <h2>¿Qué encontrarás en LeoContigo?</h2>
          <span class="decoracion-titulo" aria-hidden="true">✦</span>
        </div>

        <div class="tarjetas">
          <article class="tarjeta tarjeta-historias">
            <img
              class="tarjeta-icono"
              src="/images/icono-historias.png"
              alt=""
              loading="lazy"
            />
            <div>
              <h3>Historias increíbles</h3>
              <p>
                Lecturas divertidas y adecuadas para tu nivel.
              </p>
            </div>
          </article>

          <article class="tarjeta tarjeta-desafios">
            <img
              class="tarjeta-icono"
              src="/images/icono-desafios.png"
              alt=""
              loading="lazy"
            />
            <div>
              <h3>Desafíos de comprensión</h3>
              <p>
                Respondé preguntas y demostrá lo que comprendiste.
              </p>
            </div>
          </article>

          <article class="tarjeta tarjeta-progreso">
            <img
              class="tarjeta-icono"
              src="/images/icono-progreso.png"
              alt=""
              loading="lazy"
            />
            <div>
              <h3>Tu progreso</h3>
              <p>
                Seguí tu avance y celebrá cada logro.
              </p>
            </div>
          </article>
        </div>
      </section>

      <!-- LECTURA PÚBLICA -->
      <section class="seccion demostracion" id="lecturas">
        <div class="demostracion-contenido">
          <span class="etiqueta">✦ Biblioteca de aventuras</span>

          <h2>Una historia te está esperando</h2>

          <p>
            Descubrí nuestra primera lectura de demostración:
            El secreto del bosque mágico. Acompañá a Lumi
            en una aventura llena de amistad y magia.
          </p>

          <button
            class="boton boton-estudiante"
            type="button"
            data-lectura-demostracion
          >
            ¡Comenzar aventura!
            <span aria-hidden="true">➜</span>
          </button>
        </div>

        <div class="demostracion-ilustracion">
          <img
            src="/images/icono-historias.png"
            alt=""
            loading="lazy"
          />
        </div>
      </section>

      <!-- CONÓCENOS -->
      <section class="seccion conocenos" id="conocenos">
        <img
          class="imagen-saludo"
          src="/images/mascota-saludo.png"
          alt="Mascota azul de LeoContigo saludando alegremente"
          loading="lazy"
        />

        <div class="conocenos-contenido">
          <span class="etiqueta">✦ Nuestra misión</span>

          <h2>Conoce LeoContigo</h2>

          <p>
            LeoContigo es una plataforma educativa creada para
            fortalecer la comprensión lectora en niños de tercer
            grado mediante historias, personajes y actividades
            interactivas.
          </p>

          <p>
            Queremos que cada estudiante descubra que leer
            puede convertirse en una aventura llena de imaginación.
          </p>

          <a class="enlace-conocenos" href="#como-funciona">
            Descubrí cómo funciona
            <span aria-hidden="true">➜</span>
          </a>
        </div>
      </section>
    </main>

    <footer class="pie-pagina">
      <div class="pie-contenido">
        <span class="pie-logo">✦ LeoContigo</span>
        <p>Aprender a leer es una aventura.</p>
        <small>Proyecto educativo de comprensión lectora.</small>
      </div>
    </footer>
  `;

  configurarAccesosPorRol(contenedor);
  configurarAccesoLectura(contenedor, alExplorarLectura);
}

function configurarAccesosPorRol(
  contenedor: HTMLElement
): void {
  // Los accesos por rol se conectarán al módulo de autenticación.
  // Por ahora informan al visitante que están en desarrollo.

  const avisoAcceso =
    contenedor.querySelector<HTMLParagraphElement>(
      '#aviso-acceso'
    );

  contenedor
    .querySelectorAll<HTMLButtonElement>('[data-acceso]')
    .forEach((boton) => {
      boton.addEventListener('click', () => {
        const rol = boton.dataset.acceso;

        if (avisoAcceso) {
          avisoAcceso.textContent =
            `El acceso para ${rol === 'docente' ? 'docentes' : 'estudiantes'} estará disponible próximamente.`;
        }
      });
    });
}

function configurarAccesoLectura(
  contenedor: HTMLElement,
  alExplorarLectura: () => void
): void {
  contenedor
    .querySelectorAll<HTMLButtonElement>(
      '[data-lectura-demostracion]'
    )
    .forEach((boton) => {
      boton.addEventListener('click', alExplorarLectura);
    });
}
