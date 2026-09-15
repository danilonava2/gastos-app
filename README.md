# Gastos

App web instalable (PWA) para registrar gastos, ver un resumen por categoría y controlar presupuestos mensuales. React + Vite + TypeScript, con Firebase (Auth + Firestore) como backend.

## Funcionalidad

- Login con Google
- Alta y borrado de gastos (monto, categoría, fecha, nota)
- Historial navegable mes a mes
- Presupuesto mensual por categoría, con barra de progreso y alerta al superarlo
- Gráfico de distribución de gastos por categoría
- Instalable como app en el celular (PWA)

## 1. Crear el proyecto de Firebase

1. Andá a [console.firebase.google.com](https://console.firebase.google.com/) y creá un proyecto nuevo.
2. En **Build > Authentication**, pestaña **Sign-in method**, habilitá el proveedor **Google**.
3. En **Build > Firestore Database**, hacé clic en **Crear base de datos** (modo producción, elegí la región más cercana).
4. En **Configuración del proyecto** (ícono de engranaje) > **Tus apps**, agregá una app web (ícono `</>`), ponele un nombre y copiá el objeto `firebaseConfig` que te muestra.

## 2. Configurar la app

1. Copiá `.env.example` a `.env` y completá los valores con los datos de `firebaseConfig`:

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

2. Publicá las reglas de seguridad (`firestore.rules` en la raíz del proyecto) desde la consola de Firebase (Firestore Database > Reglas) o con la CLI:

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore   # elegí el proyecto ya creado, no sobreescribas firestore.rules
   firebase deploy --only firestore:rules
   ```

   Estas reglas hacen que cada usuario solo pueda leer y escribir sus propios datos (`users/{su-uid}/...`).

## 3. Correr en desarrollo

```bash
npm install
npm run dev
```

Abrí la URL que muestra la terminal. Desde el celular (misma red), usá `npm run dev -- --host` y entrá con la IP que te indique.

## 4. Instalar como app

Con la app abierta en Chrome/Edge (Android) o Safari (iOS), usá la opción "Agregar a la pantalla de inicio" / "Instalar app" del navegador.

## 5. Build de producción

```bash
npm run build
npm run preview
```

Para publicarla, cualquier hosting estático sirve (Firebase Hosting, Vercel, Netlify). Con Firebase Hosting:

```bash
firebase init hosting   # directorio público: dist
npm run build
firebase deploy --only hosting
```

## Modelo de datos en Firestore

```
users/{uid}/expenses/{expenseId}   -> { amount, category, date, note, createdAt }
users/{uid}/settings/budgets       -> { [categoria]: limiteMensual }
```

## Personalizar

- Categorías: `src/types.ts` (`CATEGORIES`)
- Moneda/formato: `src/utils/format.ts` (`formatCurrency`, por defecto ARS)
- Íconos de la app: `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/apple-touch-icon.png` son placeholders generados automáticamente — reemplazalos por tu propio ícono cuando quieras.
