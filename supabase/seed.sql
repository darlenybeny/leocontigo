-- LeoContigo
-- Datos iniciales de la plataforma
-- Secciones escolares del CEB Nueva Honduras

BEGIN;

INSERT INTO public.secciones (
    grado,
    seccion,
    anio_lectivo
)
VALUES
    (3, 'A', 2026),
    (3, 'B', 2026)
ON CONFLICT (grado, seccion, anio_lectivo)
DO NOTHING;

COMMIT;