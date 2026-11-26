# Pruebas de la base de datos - LeoContigo

## 1. Objetivo

Verificar que el modelo relacional de LeoContigo funcione
correctamente, garantizando la integridad de los datos y
estableciendo una configuración inicial de seguridad.

## 2. Entorno de pruebas

- Motor de base de datos: PostgreSQL.
- Servicio de backend: Supabase.
- Herramienta: SQL Editor.
- Fecha de ejecución: 26 de noviembre de 2026.
- Tipo de pruebas: manuales de base de datos.
- Rama: feature/modelo-base-datos.

## 3. Modelo implementado

La base de datos está compuesta por seis tablas:

- secciones
- perfiles
- docentes_secciones
- lecturas
- preguntas
- intentos

Se implementaron claves primarias, claves foráneas,
restricciones CHECK, restricciones UNIQUE e índices.

## 4. Casos de prueba

### CP-BD-01: Creación del modelo relacional

- Objetivo: verificar la creación de las seis tablas.
- Procedimiento: ejecutar la migración inicial y consultar
  las tablas desde Table Editor.
- Resultado esperado: las seis tablas deben existir.
- Resultado obtenido: las seis tablas fueron creadas.
- Estado: APROBADA.

### CP-BD-02: Verificación de Row Level Security

- Objetivo: comprobar que RLS esté habilitada.
- Procedimiento: consultar pg_tables y verificar
  la propiedad rowsecurity.
- Resultado esperado: true en las seis tablas.
- Resultado obtenido: las seis tablas tienen RLS activa.
- Estado: APROBADA.

### CP-BD-03: Validación de grados escolares

- Objetivo: impedir el registro de grados inválidos.
- Datos de prueba: grado 15, sección A, año 2026.
- Resultado esperado: rechazo del registro.
- Resultado obtenido: error PostgreSQL 23514.
- Restricción: secciones_grado_check.
- Estado: APROBADA.

### CP-BD-04: Prevención de secciones duplicadas

- Objetivo: evitar secciones repetidas durante un mismo
  año lectivo.
- Datos de prueba: dos registros de tercero A, año 2026.
- Resultado esperado: rechazo del registro duplicado.
- Resultado obtenido: error PostgreSQL 23505.
- Restricción: seccion_unica.
- Estado: APROBADA.

### CP-BD-05: Integridad referencial

- Objetivo: impedir preguntas asociadas a lecturas
  inexistentes.
- Procedimiento: insertar una pregunta utilizando un
  identificador de lectura inexistente.
- Resultado esperado: rechazo del registro.
- Resultado obtenido: error PostgreSQL 23503.
- Restricción: preguntas_lectura_id_fkey.
- Estado: APROBADA.

### CP-BD-06: Registro de datos iniciales

- Objetivo: comprobar el almacenamiento de las secciones
  escolares iniciales.
- Resultado esperado: dos secciones activas.
- Resultado obtenido: tercero A y tercero B registrados
  correctamente.
- Estado: APROBADA.

| ID | Grado | Sección | Año lectivo | Activa |
|----|-------|---------|-------------|--------|
| 4  | 3     | A       | 2026        | true   |
| 5  | 3     | B       | 2026        | true   |

## 5. Resumen de resultados

| Caso de prueba | Resultado |
|----------------|-----------|
| CP-BD-01 | Aprobada |
| CP-BD-02 | Aprobada |
| CP-BD-03 | Aprobada |
| CP-BD-04 | Aprobada |
| CP-BD-05 | Aprobada |
| CP-BD-06 | Aprobada |

- Total de verificaciones: 6.
- Aprobadas: 6.
- Fallidas: 0.
- Porcentaje de aprobación: 100%.

## 6. Principios de ingeniería de software aplicados

- Separación de responsabilidades: la estructura de la
  base de datos se mantiene separada de los datos iniciales.
- KISS: se utiliza un modelo relacional sencillo y adecuado
  para las necesidades actuales del proyecto.
- YAGNI: no se incorporan tablas ni funcionalidades que
  todavía no son necesarias.
- Defensa en profundidad: se establecen restricciones de
  integridad, RLS y revocación inicial de permisos.
- Control de versiones: las migraciones y los datos
  iniciales se mantienen en el repositorio Git.

## 7. Limitaciones y trabajo pendiente

Las verificaciones realizadas corresponden al modelo
inicial y no representan una validación completa de
la seguridad del sistema.

Queda pendiente:

- Implementar políticas RLS según los roles de usuario.
- Configurar los permisos de acceso a las tablas.
- Implementar autenticación.
- Verificar el aislamiento de datos entre estudiantes.
- Verificar el acceso de docentes a sus secciones.
- Validar las restricciones restantes del modelo.
- Automatizar las pruebas de base de datos.

No se han registrado datos personales de estudiantes.

## 8. Conclusión

Las seis verificaciones realizadas fueron exitosas.
El modelo inicial de LeoContigo cuenta con restricciones
de integridad y una configuración restrictiva de acceso.

La estructura y los datos iniciales se mantienen en
archivos SQL versionables, facilitando la reproducibilidad,
la mantenibilidad y la evolución del proyecto.

## 9. Uso de inteligencia artificial

Se utilizó ChatGPT como herramienta de apoyo para el
diseño del modelo relacional, la elaboración de consultas
SQL y la documentación de las pruebas.

La ejecución de las consultas, la comprobación de los
resultados y la incorporación de los archivos al proyecto
fueron realizadas por la desarrolladora.
