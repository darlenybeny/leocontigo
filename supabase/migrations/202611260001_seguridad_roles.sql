-- LeoContigo
-- Segunda migración de la base de datos
-- Módulo: seguridad y autorización por roles
--
-- Objetivos:
-- 1. Garantizar la integridad de los roles.
-- 2. Centralizar las funciones de autorización.
-- 3. Aplicar el principio de mínimo privilegio.
-- 4. Proteger los datos mediante políticas RLS.
-- 5. Restringir el acceso a las respuestas correctas.
-- 6. Impedir la modificación directa de resultados.

BEGIN;

-- =============================================
-- 1. Integridad de los roles
-- =============================================

ALTER TABLE public.perfiles
    ADD CONSTRAINT perfil_id_rol_unico
    UNIQUE (id, rol);

-- Validar el rol de los docentes asignados

ALTER TABLE public.docentes_secciones
    ADD COLUMN rol_docente VARCHAR(20)
        GENERATED ALWAYS AS ('docente'::VARCHAR(20)) STORED;

ALTER TABLE public.docentes_secciones
    ADD CONSTRAINT asignacion_rol_docente
    FOREIGN KEY (docente_id, rol_docente)
    REFERENCES public.perfiles(id, rol)
    ON DELETE CASCADE;

-- Validar el rol de los estudiantes en los intentos

ALTER TABLE public.intentos
    ADD COLUMN rol_estudiante VARCHAR(20)
        GENERATED ALWAYS AS ('estudiante'::VARCHAR(20)) STORED;

ALTER TABLE public.intentos
    ADD CONSTRAINT intento_rol_estudiante
    FOREIGN KEY (estudiante_id, rol_estudiante)
    REFERENCES public.perfiles(id, rol);

-- =============================================
-- 2. Funciones auxiliares de seguridad
-- =============================================

-- Crear un esquema interno para las funciones
-- de autorización, fuera de la API pública.

CREATE SCHEMA IF NOT EXISTS privado;

REVOKE ALL ON SCHEMA privado
FROM PUBLIC, anon, authenticated;

GRANT USAGE ON SCHEMA privado
TO authenticated;

-- ---------------------------------------------
-- 2.1. Obtener el rol del usuario autenticado
-- ---------------------------------------------

CREATE FUNCTION privado.obtener_rol_actual()
RETURNS VARCHAR(20)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT rol
    FROM public.perfiles
    WHERE id = (SELECT auth.uid())
        AND activo = TRUE;
$$;

REVOKE ALL ON FUNCTION privado.obtener_rol_actual()
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION privado.obtener_rol_actual()
TO authenticated;

-- ---------------------------------------------
-- 2.2. Verificar la asignación de un docente
-- ---------------------------------------------

CREATE FUNCTION privado.es_docente_de_seccion(
    p_seccion_id BIGINT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.docentes_secciones AS ds
        INNER JOIN public.perfiles AS p
            ON p.id = ds.docente_id
        INNER JOIN public.secciones AS s
            ON s.id = ds.seccion_id
        WHERE ds.docente_id = (SELECT auth.uid())
            AND ds.seccion_id = p_seccion_id
            AND p.rol = 'docente'
            AND p.activo = TRUE
            AND s.activa = TRUE
    );
$$;

REVOKE ALL ON FUNCTION
    privado.es_docente_de_seccion(BIGINT)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
    privado.es_docente_de_seccion(BIGINT)
TO authenticated;

-- ---------------------------------------------
-- 2.3. Verificar el acceso a un grado escolar
-- ---------------------------------------------

CREATE FUNCTION privado.tiene_acceso_a_grado(
    p_grado SMALLINT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.secciones AS s
        WHERE s.grado = p_grado
            AND s.activa = TRUE
            AND (
                privado.es_docente_de_seccion(s.id)

                OR EXISTS (
                    SELECT 1
                    FROM public.perfiles AS p
                    WHERE p.id = (SELECT auth.uid())
                        AND p.rol = 'estudiante'
                        AND p.activo = TRUE
                        AND p.seccion_id = s.id
                )
            )
    );
$$;

REVOKE ALL ON FUNCTION
    privado.tiene_acceso_a_grado(SMALLINT)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
    privado.tiene_acceso_a_grado(SMALLINT)
TO authenticated;

-- =============================================
-- 3. Privilegios de acceso
-- =============================================

-- Revocar los privilegios directos de las tablas.
-- El acceso se concederá de manera explícita.

REVOKE ALL ON TABLE
    public.secciones,
    public.perfiles,
    public.docentes_secciones,
    public.lecturas,
    public.preguntas,
    public.intentos
FROM PUBLIC, anon, authenticated;

-- Conceder únicamente permisos de lectura.
-- Las operaciones de escritura permanecen
-- restringidas hasta implementar mecanismos
-- seguros de gestión y evaluación.

GRANT SELECT ON TABLE
    public.secciones,
    public.perfiles,
    public.docentes_secciones,
    public.lecturas,
    public.intentos
TO authenticated;

-- Permitir únicamente las columnas necesarias
-- para presentar las preguntas al usuario.
--
-- respuesta_correcta y explicacion permanecen
-- restringidas para los clientes autenticados.

GRANT SELECT (
    id,
    lectura_id,
    enunciado,
    opciones,
    orden
)
ON TABLE public.preguntas
TO authenticated;

-- =============================================
-- 4. Políticas de seguridad a nivel de filas
-- =============================================

-- ---------------------------------------------
-- 4.1. Perfiles
-- ---------------------------------------------
--
-- Administrador: todos los perfiles.
-- Docente: perfil propio y estudiantes asignados.
-- Estudiante: únicamente su propio perfil.
-- Usuario inactivo: ningún perfil.

CREATE POLICY perfiles_consulta_autorizada
ON public.perfiles
FOR SELECT
TO authenticated
USING (
    (SELECT privado.obtener_rol_actual()) = 'administrador'

    OR (
        id = (SELECT auth.uid())
        AND (SELECT privado.obtener_rol_actual()) IS NOT NULL
    )

    OR (
        rol = 'estudiante'
        AND privado.es_docente_de_seccion(seccion_id)
    )
);

-- ---------------------------------------------
-- 4.2. Secciones
-- ---------------------------------------------
--
-- Administrador: todas las secciones.
-- Docente: secciones activas asignadas.
-- Estudiante: su propia sección activa.

CREATE POLICY secciones_consulta_autorizada
ON public.secciones
FOR SELECT
TO authenticated
USING (
    (SELECT privado.obtener_rol_actual()) = 'administrador'

    OR privado.es_docente_de_seccion(id)

    OR (
        (SELECT privado.obtener_rol_actual()) = 'estudiante'
        AND activa = TRUE
        AND EXISTS (
            SELECT 1
            FROM public.perfiles AS p
            WHERE p.id = (SELECT auth.uid())
                AND p.seccion_id = secciones.id
                AND p.activo = TRUE
        )
    )
);

-- ---------------------------------------------
-- 4.3. Asignaciones docentes
-- ---------------------------------------------
--
-- Administrador: todas las asignaciones.
-- Docente: sus propias asignaciones activas.
-- Estudiante: sin acceso.

CREATE POLICY docentes_secciones_consulta_autorizada
ON public.docentes_secciones
FOR SELECT
TO authenticated
USING (
    (SELECT privado.obtener_rol_actual()) = 'administrador'

    OR (
        docente_id = (SELECT auth.uid())
        AND privado.es_docente_de_seccion(seccion_id)
    )
);

-- ---------------------------------------------
-- 4.4. Lecturas
-- ---------------------------------------------
--
-- Administrador: todas las lecturas.
-- Docente: lecturas publicadas de sus grados.
-- Estudiante: lecturas publicadas de su grado.

CREATE POLICY lecturas_consulta_autorizada
ON public.lecturas
FOR SELECT
TO authenticated
USING (
    (SELECT privado.obtener_rol_actual()) = 'administrador'

    OR (
        publicada = TRUE
        AND privado.tiene_acceso_a_grado(grado)
    )
);

-- ---------------------------------------------
-- 4.5. Preguntas
-- ---------------------------------------------
--
-- Solo se permite consultar preguntas asociadas
-- a lecturas autorizadas por su política RLS.
--
-- Los privilegios de columna restringen el acceso
-- directo a las respuestas correctas.

CREATE POLICY preguntas_consulta_autorizada
ON public.preguntas
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.lecturas AS l
        WHERE l.id = preguntas.lectura_id
    )
);

-- ---------------------------------------------
-- 4.6. Intentos y resultados
-- ---------------------------------------------
--
-- Administrador: todos los resultados.
-- Docente: resultados de estudiantes asignados
-- actualmente a sus secciones activas.
-- Estudiante: únicamente sus propios resultados.
--
-- Los resultados oficiales serán registrados
-- posteriormente mediante un mecanismo seguro
-- de evaluación del lado del servidor.

CREATE POLICY intentos_consulta_autorizada
ON public.intentos
FOR SELECT
TO authenticated
USING (
    (SELECT privado.obtener_rol_actual()) = 'administrador'

    OR (
        estudiante_id = (SELECT auth.uid())
        AND (SELECT privado.obtener_rol_actual()) = 'estudiante'
    )

    OR (
        (SELECT privado.obtener_rol_actual()) = 'docente'
        AND EXISTS (
            SELECT 1
            FROM public.perfiles AS p
            WHERE p.id = intentos.estudiante_id
                AND p.rol = 'estudiante'
                AND privado.es_docente_de_seccion(
                    p.seccion_id
                )
        )
    )
);

-- =============================================
-- Fin de la migración
-- =============================================

COMMIT;