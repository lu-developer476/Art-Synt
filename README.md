# Art-Syntex

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Firestore](https://img.shields.io/badge/Cloud_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Firebase Auth](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-009688?style=for-the-badge)

Art-Syntex es una SPA con estética cyberpunk orientada a catálogo, acceso de usuarios y flujo básico de compra. El frontend corre sobre React + Vite y usa Firebase como backend gestionado para autenticación, catálogo y persistencia de datos.

## Estado real del proyecto

### Frontend

El frontend está implementado con:

- **React 18**
- **TypeScript**
- **Vite**
- **React Router DOM** para navegación cliente
- **Tailwind CSS** para estilos

La app expone las rutas:

- `/`
- `/acceso`
- `/productos`
- `/contacto`

### Backend

El repositorio incluye un backend Node.js separado en `server/index.js` con:

- **Express**
- **CORS**
- **Nodemailer**

Ese servidor ofrece:

- `GET /health`
- `POST /send`

Su propósito es recibir mensajes y reenviarlos por email usando credenciales SMTP/Gmail definidas en variables de entorno.

> **Importante:** hoy ese backend Express **no está integrado activamente con el frontend**. La app cliente no hace `fetch` ni llamadas HTTP a `/send`; en su lugar escribe directamente en Firebase (`contactMessages`, `mail`, `notifications`, `purchaseOrders`, etc.). Si querés usar el servidor Express para contacto, hoy haría falta conectar explícitamente el frontend a ese endpoint.

## Qué hace realmente la aplicación

Actualmente el frontend implementa estas capacidades:

- Carga el catálogo desde **Firestore**.
- Si la colección `products` está vacía, hace un **seed automático** con los datos de `src/data/products.ts`.
- Permite registrar usuarios con **Firebase Authentication** (email/password).
- Guarda el perfil básico del usuario en `users/{uid}`.
- Permite iniciar sesión y cerrar sesión.
- Permite agregar productos al carrito en memoria del cliente.
- Al confirmar compra, crea una orden en `purchaseOrders`.
- El formulario de contacto guarda postulaciones en `contactMessages`.
- Además escribe documentos en `mail` y `notifications` para flujos auxiliares dentro de Firebase.

## Rol de Firebase

Firebase cumple varios roles en el proyecto:

### 1. Authentication

Se usa **Firebase Authentication** con proveedor **Email/Password** para:

- registro de usuario
- inicio de sesión
- persistencia de sesión del usuario autenticado

### 2. Cloud Firestore

Se usa **Firestore** como base de datos principal para:

- `products`: catálogo
- `users`: perfiles de usuario
- `purchaseOrders`: órdenes de compra
- `contactMessages`: mensajes enviados desde contacto
- `notifications`: eventos internos
- `mail`: documentos de correo para integraciones/extensiones basadas en Firebase

### 3. Hosting

El deploy del frontend está preparado para **Firebase Hosting**, publicando la carpeta `dist` generada por Vite.

### 4. Reglas e índices

El repositorio incluye:

- reglas de Firestore en `src/firebase/firestore.rules`
- índices de Firestore en `src/firebase/firestore.indexes.json`

## Arquitectura resumida

```text
React + Vite SPA
        |
        |-- Firebase Authentication
        |-- Cloud Firestore
        \-- Firebase Hosting

Servidor opcional separado
Node.js + Express + Nodemailer
        |
        \-- SMTP / Gmail
```

## Estructura principal

```text
src/
  components/        Componentes UI
  data/              Seed estático de productos
  firebase/          Configuración Firebase, reglas e integración con Firestore
  hooks/             Estado de auth, carrito y productos
  layout/            Layout principal
  pages/             Rutas principales
  sections/          Secciones de página
server/
  index.js           Servidor Express para envío de correo
```

## Requisitos

- **Node.js 18+** recomendado
- **npm**
- Un proyecto de **Firebase** con Authentication y Firestore habilitados

## Variables de entorno

### Frontend (`.env`)

Creá un archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Variables requeridas por el frontend:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Backend Express opcional

Si querés correr el servidor de correo localmente, además necesitás estas variables en tu entorno:

```env
EMAIL_USER=
EMAIL_PASS=
ALLOWED_ORIGIN=
PORT=3001
```

Notas:

- `EMAIL_USER` y `EMAIL_PASS` son obligatorias para que el servidor arranque.
- `ALLOWED_ORIGIN` restringe CORS si querés permitir solo un origen concreto.
- Estas variables **no** son necesarias para levantar el frontend si no vas a usar el backend Express.

## Cómo correr el proyecto localmente

### Opción A: solo frontend (flujo principal actual)

1. Instalá dependencias:

```bash
npm install
```

2. Configurá `.env` con tus credenciales de Firebase.

3. Verificá en Firebase Console que estén habilitados:

- Authentication > Email/Password
- Firestore Database

4. Iniciá el frontend:

```bash
npm run dev
```

La app de Vite corre por defecto en `http://localhost:5173`.

### Opción B: frontend + backend Express de correo

Si además querés levantar el servidor Express incluido en el repo:

```bash
npm run server
```

Por defecto escucha en `http://localhost:3001`.

> Levantar este servidor no cambia el comportamiento del frontend actual por sí solo. Para usarlo desde la interfaz habría que integrar llamadas al endpoint `POST /send`.

## Cómo hacer build

Para generar el build de producción del frontend:

```bash
npm run build
```

Esto ejecuta:

- compilación TypeScript
- build de Vite
- salida final en `dist/`

Para previsualizar localmente el build generado:

```bash
npm run preview
```

## Cómo desplegar

### Frontend en Firebase Hosting

1. Instalá dependencias:

```bash
npm install
```

2. Generá el build:

```bash
npm run build
```

3. Desplegá Hosting:

```bash
npm run firebase:deploy:hosting
```

Ese flujo publica `dist/` en Firebase Hosting usando la configuración de `firebase.json`.

### Reglas e índices de Firestore

Para desplegar reglas e índices:

```bash
npm run firebase:deploy:firestore
```

### Deploy completo de Firebase

Si querés desplegar Hosting y Firestore en un mismo paso:

```bash
npm run firebase:deploy
```

## Qué NO hace hoy el proyecto

Para que el README sea fiel al estado actual, conviene dejar explícito lo que **no** está implementado o no está conectado:

- No hay integración activa entre el frontend y el servidor Express.
- No hay backend API principal para catálogo, auth o compras: esos flujos van directo a Firebase desde el cliente.
- No hay pasarela de pago real.
- No hay panel administrativo en este repo.
- No hay SSR ni framework full-stack; es una SPA de Vite.
- No hay evidencia en este repositorio de deploy del backend Express a un proveedor específico.

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run server
npm run firebase:deploy
npm run firebase:deploy:firestore
npm run firebase:deploy:hosting
```

## Configuración de Firebase recomendada

Para que el proyecto funcione como está implementado hoy:

1. Habilitá **Email/Password** en Firebase Authentication.
2. Creá Firestore Database.
3. Publicá las reglas e índices incluidos en el repo.
4. Si querés procesar la colección `mail`, configurá del lado de Firebase la integración/extensión correspondiente; este repo solo crea los documentos.

## Licencia

Este repositorio no declara actualmente un archivo `LICENSE` en la raíz. Si necesitás una licencia explícita para distribución o uso, conviene agregarla.
