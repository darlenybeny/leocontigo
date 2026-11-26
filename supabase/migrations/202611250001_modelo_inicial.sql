-- LeoContigo
-- Migración inicial de la base de datos
-- Módulo: organización escolar
BEGIN;
CREATE TABLE public.secciones (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    grado SMALLINT NOT NULL
        CHECK (grado BETWEEN 1 AND 9),

    seccion VARCHAR(10) NOT NULL
        CHECK (length(trim(seccion)) > 0),

    anio_lectivo SMALLINT NOT NULL
        CHECK (anio_lectivo >= 2026),

    activa BOOLEAN NOT NULL DEFAULT TRUE,

    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT seccion_unica
        UNIQUE (grado, seccion, anio_lectivo)
);

-- Seguridad de acceso a los datos

ALTER TABLE public.secciones
    ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.secciones
    FROM anon, authenticated;


    -- Perfiles de usuarios de LeoContigo

CREATE TABLE public.perfiles (
    id UUID PRIMARY KEY
        REFERENCES auth.users(id) ON DELETE CASCADE,

    nombres VARCHAR(100) NOT NULL
        CHECK (length(trim(nombres)) > 0),

    apellidos VARCHAR(100) NOT NULL
        CHECK (length(trim(apellidos)) > 0),

    rol VARCHAR(20) NOT NULL
        CHECK (rol IN (
            'administrador',
            'docente',
            'estudiante'
        )),

    seccion_id BIGINT
        REFERENCES public.secciones(id),

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT perfil_seccion_valida CHECK (
        (rol = 'estudiante' AND seccion_id IS NOT NULL)
        OR
        (rol IN ('docente', 'administrador')
            AND seccion_id IS NULL)
    )
);

-- Seguridad de los perfiles

ALTER TABLE public.perfiles
    ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.perfiles
    FROM anon, authenticated;


    -- Asignación de docentes a secciones

CREATE TABLE public.docentes_secciones (
    docente_id UUID NOT NULL
        REFERENCES public.perfiles(id) ON DELETE CASCADE,

    seccion_id BIGINT NOT NULL
        REFERENCES public.secciones(id) ON DELETE CASCADE,

    asignado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (docente_id, seccion_id)
);

-- Seguridad de las asignaciones

ALTER TABLE public.docentes_secciones
    ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.docentes_secciones
    FROM anon, authenticated;


    -- Lecturas educativas de LeoContigo

CREATE TABLE public.lecturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    titulo VARCHAR(150) NOT NULL
        CHECK (length(trim(titulo)) > 0),

    descripcion TEXT NOT NULL,

    contenido TEXT NOT NULL
        CHECK (length(trim(contenido)) > 0),

    imagen_url TEXT,

    grado SMALLINT NOT NULL
        CHECK (grado BETWEEN 1 AND 9),

    nivel SMALLINT NOT NULL
        CHECK (nivel >= 1),

    publicada BOOLEAN NOT NULL DEFAULT FALSE,

    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seguridad de las lecturas

ALTER TABLE public.lecturas
    ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.lecturas
    FROM anon, authenticated;


-- Preguntas de comprensión lectora

CREATE TABLE public.preguntas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    lectura_id UUID NOT NULL
        REFERENCES public.lecturas(id) ON DELETE CASCADE,

    enunciado TEXT NOT NULL
        CHECK (length(trim(enunciado)) > 0),

    opciones TEXT[] NOT NULL
        CHECK (cardinality(opciones) >= 2),

    respuesta_correcta TEXT NOT NULL,

    explicacion TEXT NOT NULL
        CHECK (length(trim(explicacion)) > 0),

    orden SMALLINT NOT NULL
        CHECK (orden >= 1),

    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT respuesta_en_opciones
        CHECK (
            array_position(opciones, respuesta_correcta)
                IS NOT NULL
        ),

    CONSTRAINT opciones_sin_nulos
        CHECK (array_position(opciones, NULL) IS NULL),

    CONSTRAINT pregunta_orden_unico
        UNIQUE (lectura_id, orden)
);

-- Seguridad de las preguntas

ALTER TABLE public.preguntas
    ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.preguntas
    FROM anon, authenticated;

-- Historial de intentos de comprensión lectora

CREATE TABLE public.intentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    estudiante_id UUID NOT NULL
        REFERENCES public.perfiles(id),

    lectura_id UUID NOT NULL
        REFERENCES public.lecturas(id),

    puntaje SMALLINT NOT NULL
        CHECK (puntaje >= 0),

    total_preguntas SMALLINT NOT NULL
        CHECK (total_preguntas > 0),

    porcentaje SMALLINT NOT NULL
        CHECK (porcentaje BETWEEN 0 AND 100),

    estrellas SMALLINT NOT NULL
        CHECK (estrellas BETWEEN 1 AND 3),

    completado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT puntaje_valido
        CHECK (puntaje <= total_preguntas),

    CONSTRAINT porcentaje_coherente
        CHECK (
            porcentaje = ROUND(
                puntaje * 100.0 / total_preguntas
            )
        ),

    CONSTRAINT estrellas_coherentes
        CHECK (
            estrellas = CASE
                WHEN puntaje = total_preguntas THEN 3
                WHEN puntaje * 100 >= total_preguntas * 60 THEN 2
                ELSE 1
            END
        )
);

-- Índices para consultar el historial

CREATE INDEX idx_intentos_estudiante
    ON public.intentos(estudiante_id);

CREATE INDEX idx_intentos_lectura
    ON public.intentos(lectura_id);

-- Seguridad del historial

ALTER TABLE public.intentos
    ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.intentos
    FROM anon, authenticated;

    COMMIT;