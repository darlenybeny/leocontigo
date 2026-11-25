import type { Lectura } from './tipos';

export const lecturaDemostracion: Lectura = {
  id: 'bosque-magico',
  titulo: 'El secreto del bosque mágico',
  nivel: 1,
  imagen: '/images/mascota-lectora.png',

  contenido: [
    'Una mañana, Lumi salió a caminar por el bosque mágico. Mientras observaba las flores de colores, descubrió un libro brillante debajo de un árbol.',

    'Cuando abrió el libro, apareció un mensaje: «La verdadera magia está en ayudar a los demás».',

    'Lumi continuó su camino y encontró a una pequeña ardilla que no podía alcanzar unas frutas. Sin pensarlo dos veces, la ayudó a recogerlas.',

    'Más adelante, encontró a un conejito triste porque había perdido su camino a casa. Lumi lo acompañó hasta encontrar a su familia.',

    'De repente, el libro comenzó a brillar con más fuerza. Lumi comprendió que cada buena acción hacía crecer su magia.',

    'Desde aquel día, Lumi compartió sus aventuras con todos los habitantes del bosque y descubrió que ayudar a los demás era el secreto más maravilloso de todos.'
  ],

  preguntas: [
    {
      id: 'pregunta-1',
      enunciado: '¿Qué encontró Lumi debajo del árbol?',
      opciones: [
        'Una corona dorada',
        'Un libro brillante',
        'Una cesta de frutas'
      ],
      respuestaCorrecta: 'Un libro brillante',
      explicacion:
        'Lumi descubrió un libro brillante debajo de un árbol mientras caminaba por el bosque.'
    },
    {
      id: 'pregunta-2',
      enunciado: '¿A qué animal ayudó Lumi primero?',
      opciones: [
        'A una ardilla',
        'A un conejito',
        'A un pájaro'
      ],
      respuestaCorrecta: 'A una ardilla',
      explicacion:
        'La ardilla fue el primer animal que Lumi ayudó, recogiendo las frutas que no podía alcanzar.'
    },
    {
      id: 'pregunta-3',
      enunciado: '¿Por qué estaba triste el conejito?',
      opciones: [
        'Porque tenía hambre',
        'Porque había perdido un juguete',
        'Porque no encontraba el camino a casa'
      ],
      respuestaCorrecta:
        'Porque no encontraba el camino a casa',
      explicacion:
        'El conejito estaba triste porque se había perdido y no sabía cómo regresar con su familia.'
    },
    {
      id: 'pregunta-4',
      enunciado: '¿Por qué el libro comenzó a brillar más?',
      opciones: [
        'Porque Lumi ayudó a los animales',
        'Porque salió el sol',
        'Porque Lumi encontró un tesoro'
      ],
      respuestaCorrecta:
        'Porque Lumi ayudó a los animales',
      explicacion:
        'Cada buena acción de Lumi hacía crecer la magia del libro.'
    },
    {
      id: 'pregunta-5',
      enunciado: '¿Qué nos enseña esta historia?',
      opciones: [
        'Que debemos guardar todo para nosotros',
        'Que ayudar a los demás es importante',
        'Que debemos evitar las aventuras'
      ],
      respuestaCorrecta:
        'Que ayudar a los demás es importante',
      explicacion:
        'La historia nos enseña que compartir y ayudar a los demás puede hacer del mundo un lugar mejor.'
    }
  ]
};