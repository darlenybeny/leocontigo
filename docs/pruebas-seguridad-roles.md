
# Pruebas de seguridad y autorización por roles

## 1. Información general

- Proyecto: LeoContigo
- Fecha de ejecución: 27 de noviembre de 2026
- Rama: `feature/seguridad-roles`
- Base de datos: PostgreSQL (Supabase)
- Migración: `202611260001_seguridad_roles.sql`
- Tipo de pruebas: integración, integridad y seguridad.
- Herramienta utilizada: Supabase SQL Editor.

## 2. Objetivo

Verificar que las restricciones de integridad, las políticas de Row Level Security (RLS) y los permisos de PostgreSQL protejan la información de los usuarios de LeoContigo según su rol y sección escolar.

Se busca garantizar que cada usuario tenga acceso únicamente a la información necesaria para realizar sus funciones, evitando accesos no autorizados y manipulaciones de los resultados académicos.

## 3. Datos de prueba

Para realizar las verificaciones se crearon seis cuentas ficticias mediante Supabase Authentication, vinculadas con sus respectivos perfiles.

| Usuario | Rol | Sección |
|---|---|---|
| Administrador de prueba | administrador | No aplica |
| Docente A | docente | 3.º A |
| Docente B | docente | 3.º B |
| Estudiante A1 | estudiante | 3.º A |
| Estudiante A2 | estudiante | 3.º A |
| Estudiante B1 | estudiante | 3.º B |

También se crearon tres lecturas ficticias:

| Lectura | Grado | Publicada |
|---|---|---|
| El pequeño colibrí | 3.º | Sí |
| El bosque secreto | 3.º | No |
| El viaje espacial | 4.º | Sí |

Se registraron cinco preguntas distribuidas entre las tres lecturas y tres intentos académicos de prueba.

No se utilizaron datos personales de estudiantes reales.

## 4. Metodología

Las pruebas de autorización se realizaron simulando diferentes identidades mediante:

- `SET LOCAL ROLE authenticated`: simula el rol de PostgreSQL utilizado por usuarios autenticados.
- `SET LOCAL ROLE anon`: simula un usuario sin autenticación.
- `set_config('request.jwt.claim.sub', ...)`: establece temporalmente la identidad del usuario de prueba.
- `BEGIN` y `ROLLBACK`: delimitan las transacciones de prueba y permiten revertir posibles modificaciones.

Las consultas se ejecutaron directamente en PostgreSQL para verificar que la seguridad no dependa exclusivamente de la interfaz gráfica.

Estas simulaciones no sustituyen las pruebas de autenticación mediante sesiones reales y solicitudes a la Data API.

## 5. Pruebas de integridad referencial

### PI-01. Verificación de restricciones

Se comprobó la existencia y validación de las siguientes restricciones:

- `perfil_id_rol_unico`
- `asignacion_rol_docente`
- `intento_rol_estudiante`

Resultado esperado: las tres restricciones deben existir y estar validadas.

Resultado obtenido: las tres restricciones presentaron el estado `true`.

Estado: APROBADA.

### PI-02. Verificación de columnas generadas

Se verificaron las columnas:

- `docentes_secciones.rol_docente`
- `intentos.rol_estudiante`

Resultado esperado: ambas columnas deben generarse automáticamente con sus respectivos roles.

Resultado obtenido: ambas columnas presentaron el atributo `ALWAYS` y las expresiones correspondientes a `docente` y `estudiante`.

Estado: APROBADA.

### PI-03. Asignación de un estudiante como docente

Se intentó asignar al estudiante A1 como docente de la sección B.

Resultado esperado: la base de datos debe rechazar la asignación.

Resultado obtenido: PostgreSQL devolvió el error `23503`, correspondiente a una violación de la restricción `asignacion_rol_docente`.

Estado: APROBADA.

### PI-04. Registro de un docente como estudiante

Se intentó registrar un intento académico utilizando el identificador del docente A.

Resultado esperado: únicamente los perfiles con rol estudiante pueden estar asociados como estudiantes a un intento.

Resultado obtenido: PostgreSQL devolvió el error `23503`, correspondiente a la restricción `intento_rol_estudiante`.

Estado: APROBADA.

## 6. Pruebas de acceso a perfiles

| ID | Escenario | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|
| PS-01 | Estudiante A1 consulta perfiles | Únicamente su perfil | 1 registro: A1 | APROBADA |
| PS-02 | Docente A consulta perfiles | Su perfil y estudiantes de 3.º A | 3 registros | APROBADA |
| PS-03 | Docente B consulta perfiles | Su perfil y estudiantes de 3.º B | 2 registros | APROBADA |
| PS-04 | Administrador consulta perfiles | Todos los perfiles de prueba | 6 registros | APROBADA |
| PS-05 | Usuario anónimo consulta perfiles | Acceso denegado | Error 42501 | APROBADA |

Estas pruebas demuestran que los usuarios evaluados no pueden consultar perfiles fuera de su alcance autorizado.

## 7. Pruebas de acceso a lecturas y preguntas

| ID | Escenario | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|
| PS-06 | Estudiante A1 consulta lecturas | Solo lecturas publicadas de su grado | El pequeño colibrí | APROBADA |
| PS-07 | Estudiante consulta columnas autorizadas de preguntas | Acceso permitido | 3 preguntas | APROBADA |
| PS-08 | Estudiante consulta respuesta_correcta | Acceso denegado | Error 42501 | APROBADA |
| PS-09 | Estudiante consulta explicacion | Acceso denegado | Error 42501 | APROBADA |
| PS-10 | Estudiante ejecuta SELECT * sobre preguntas | Acceso denegado | Error 42501 | APROBADA |
| PS-11 | Estudiante consulta preguntas de todas las lecturas | Solo preguntas de lecturas autorizadas | 3 de 5 preguntas | APROBADA |

Se comprobó que la lectura no publicada y la lectura correspondiente a cuarto grado no fueron visibles para el estudiante A1.

Además, los permisos por columna impiden consultar directamente las respuestas correctas y sus explicaciones.

La interfaz deberá solicitar explícitamente las columnas autorizadas, evitando utilizar `SELECT *` sobre la tabla de preguntas.

## 8. Pruebas de acceso a resultados académicos

Se registraron los siguientes resultados ficticios:

| Estudiante | Puntaje | Total de preguntas | Porcentaje | Estrellas |
|---|---|---|---|---|
| A1 | 3 | 3 | 100 % | 3 |
| A2 | 2 | 3 | 67 % | 2 |
| B1 | 1 | 3 | 33 % | 1 |

Posteriormente, se verificaron los permisos de consulta.

| ID | Escenario | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|
| PS-12 | Estudiante A1 consulta intentos | Únicamente sus resultados | 1 registro | APROBADA |
| PS-13 | Docente A consulta intentos | Resultados de 3.º A | 2 registros: A1 y A2 | APROBADA |
| PS-14 | Docente B consulta intentos | Resultados de 3.º B | 1 registro: B1 | APROBADA |
| PS-15 | Administrador consulta intentos | Todos los resultados de prueba | 3 registros | APROBADA |
| PS-16 | Usuario anónimo consulta intentos | Acceso denegado | Error 42501 | APROBADA |

## 9. Pruebas contra manipulación de resultados

### PS-17. Inserción no autorizada

Se simuló al estudiante A1 intentando registrar directamente un resultado académico.

Resultado esperado: impedir la creación directa de calificaciones desde un usuario autenticado.

Resultado obtenido: error `42501`, permiso denegado sobre la tabla `intentos`.

Estado: APROBADA.

### PS-18. Modificación no autorizada

Se simuló al estudiante A2 intentando modificar su calificación de 67 % a 100 % y aumentar sus estrellas de dos a tres.

Resultado esperado: impedir la modificación directa de resultados.

Resultado obtenido: error `42501`, permiso denegado sobre la tabla `intentos`.

Estado: APROBADA.

### PS-19. Eliminación no autorizada

Se simuló al estudiante B1 intentando eliminar su propio resultado académico.

Resultado esperado: impedir la eliminación directa del historial académico.

Resultado obtenido: error `42501`, permiso denegado sobre la tabla `intentos`.

Estado: APROBADA.

### PS-20. Conservación de los resultados originales

Después de los intentos de manipulación, se realizó una consulta de verificación desde el SQL Editor con privilegios administrativos de base de datos.

Resultado esperado: conservar los tres registros originales sin modificaciones.

Resultado obtenido:

- Estudiante A1: 100 %, 3 estrellas.
- Estudiante A2: 67 %, 2 estrellas.
- Estudiante B1: 33 %, 1 estrella.

Estado: APROBADA.

## 10. Resumen de resultados

| Categoría | Ejecutadas | Aprobadas | Fallidas |
|---|---|---|---|
| Integridad referencial | 4 | 4 | 0 |
| Acceso a perfiles | 5 | 5 | 0 |
| Acceso a lecturas y preguntas | 6 | 6 | 0 |
| Acceso a resultados académicos | 5 | 5 | 0 |
| Protección contra manipulación | 4 | 4 | 0 |
| Total | 24 | 24 | 0 |

Porcentaje de aprobación de las pruebas ejecutadas: 100 %.

Los errores 23503 y 42501 obtenidos durante las pruebas negativas representan resultados esperados y no fallas de la implementación.

## 11. Principios de ingeniería de software aplicados

### Principio de mínimo privilegio

Cada usuario recibe únicamente los permisos necesarios para realizar sus funciones.

Un estudiante puede consultar sus resultados, pero no puede insertar, modificar ni eliminar directamente sus calificaciones.

### Defensa en profundidad

La seguridad se implementa mediante diferentes mecanismos complementarios:

- Autenticación de usuarios.
- Autorización según roles.
- Políticas Row Level Security.
- Permisos por tabla y columna.
- Restricciones de integridad referencial.

La protección no depende únicamente de ocultar elementos en la interfaz.

### Integridad de los datos

Las restricciones de PostgreSQL impiden establecer relaciones incompatibles con los roles definidos en el sistema.

Esto permite detectar y rechazar operaciones inválidas directamente en la base de datos.

### Separación de responsabilidades

La autenticación identifica al usuario, mientras que la autorización determina las operaciones y los datos a los que puede acceder.

La interfaz presenta la información, pero no es la autoridad final sobre los permisos ni deberá serlo sobre las calificaciones oficiales.

### Bajo acoplamiento

Los estudiantes están relacionados con una sección escolar y no directamente con un docente.

Esto permite cambiar al docente responsable de una sección sin modificar individualmente los perfiles de sus estudiantes.

### Fail Fast

Las operaciones inválidas se rechazan en el momento en que incumplen una restricción o un permiso, evitando que se almacenen datos inconsistentes.

## 12. Limitaciones y trabajo pendiente

Las pruebas realizadas corresponden a verificaciones manuales de integración y seguridad en PostgreSQL.

Queda pendiente:

- Verificar los permisos mediante sesiones reales de Supabase Authentication y solicitudes a la Data API.
- Implementar el inicio de sesión desde la interfaz de LeoContigo.
- Implementar la creación segura de cuentas de estudiantes por parte de docentes autorizados.
- Implementar la evaluación de respuestas mediante lógica confiable del lado del servidor.
- Implementar el registro seguro de resultados académicos.
- Ampliar las pruebas para usuarios inactivos, cambios de asignación y otros escenarios de autorización.
- Automatizar las pruebas de seguridad para detectar regresiones.
- Retirar los datos ficticios antes de utilizar la plataforma con estudiantes reales.

La aprobación de las pruebas ejecutadas no implica que la seguridad completa de la aplicación haya sido certificada.

## 13. Conclusión

Las pruebas realizadas permitieron verificar que las restricciones de integridad y los mecanismos de autorización implementados funcionan correctamente en los escenarios evaluados.

Se comprobó el aislamiento de información entre estudiantes y secciones, el acceso diferenciado por roles, la protección de las respuestas correctas y la prevención de modificaciones directas de los resultados académicos.

Estos mecanismos constituyen una base para continuar desarrollando las funcionalidades de autenticación, evaluación y seguimiento académico de LeoContigo.

## 14. Disclosure de inteligencia artificial

Se utilizó ChatGPT como herramienta de apoyo para comprender los mecanismos de seguridad de PostgreSQL, diseñar consultas SQL, preparar escenarios de prueba, interpretar los resultados y organizar la documentación técnica.

Las consultas fueron ejecutadas manualmente por la autora del proyecto en Supabase, verificando los resultados obtenidos y revisando el comportamiento de las restricciones y los permisos implementados.
