# DSM-5 Interactivo 🧠

Versión interactiva del Manual Diagnóstico y Estadístico de los Trastornos Mentales (DSM-5): criterios diagnósticos, diagnóstico diferencial, glosario clínico y buscador.

## Estructura

- `index.html` — página principal
- `style.css` — estilos (modo claro/oscuro)
- `data.js` — datos del DSM-5 (144 trastornos indexados)
- `app.js` — lógica de la aplicación (búsqueda, filtros, pestañas)
- `cats.js` — gatito compañero 🐱

Es un sitio estático: no necesita build ni dependencias.

## Ejecutar localmente

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
```

## Despliegue en Vercel

1. Entra a [vercel.com/new](https://vercel.com/new) e importa este repositorio.
2. Framework Preset: **Other** (sitio estático, sin build).
3. Deploy — no requiere configuración adicional.
