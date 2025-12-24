
# SFamilyONE (Supabase MVP)

Red social PWA sin Firebase: feed con imágenes, perfil con música tipo MySpace y chat en tiempo real, usando **Supabase** (Auth + Postgres + Realtime + Storage) vía CDN.

## Qué necesitas
- Crear un proyecto en [Supabase](https://supabase.com/) y copiar `SUPABASE_URL` y `anon key`.
- Crear bucket público `images` en Storage.
- Ejecutar el SQL de `db/schema.sql` en el editor SQL de Supabase.
- Copiar `js/supabase-config-template.js` a `js/supabase-config.js` y pegar tus claves.

## Tablas y seguridad
Ejecuta `db/schema.sql` (incluye RLS/policies) para:
- `posts` (feed)
- `profiles` (perfil)
- `chat_messages` (chat)

## Publicar sin instalar nada
- Abre `index.html` directamente o sube a GitHub Pages.
- Funciona solo con el navegador (CDN supabase-js v2).

## Nota de autoplay
Los navegadores bloquean el autoplay con sonido; la app intenta reproducir silenciado y luego quitar silencio con un clic.

Hecho con ❤️ para Juan.
