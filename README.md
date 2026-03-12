# Hotel Booking System - Proyecto Capstone

## Descripción del Proyecto

Este proyecto es una aplicación Full Stack desarrollada en la materia de programación 5 para la gestión de reservas hoteleras. La arquitectura se divide en un backend robusto construido con NestJS y un frontend moderno desarrollado en Angular v19+, priorizando la escalabilidad, el mantenimiento y la reactividad granular.

La solución permite a los usuarios buscar hoteles, ver detalles de habitaciones y gestionar reservas en tiempo real. El desarrollo se ha ido avanzando de manera incremental a través de laboratorios técnicos detallados.

## Objetivos del Capstone

- Gestión de Estado Reactiva: Implementar un manejo de datos centralizado mediante servicios inyectables y **Angular Signals** (Single Source of Truth) para asegurar la reactividad granular y evitar el Prop Drilling sin la sobrecarga de Redux tradicional.
- Arquitectura Profesional: Utilizar una estructura modular en el backend (Modules, Controllers, Providers) y componentes Standalone en el frontend para reducir el código repetitivo (boilerplate).
- Persistencia Escalable: Gestionar datos en una base de datos NoSQL (MongoDB Atlas) mediante el patrón Repository y Mongoose ODM.
- Rendimiento Avanzado: Implementar una aplicación Zoneless utilizando Angular Signals para notificar cambios directos al DOM sin depender de Zone.js.
- Diseño Responsivo: Crear una interfaz modular usando metodología BEM, CSS Grid y Flexbox bajo una estrategia Mobile First.

## Tecnologías Principales

- Lenguaje: TypeScript con configuración estricta (strict: true).
- Backend: NestJS, Mongoose, Class-Validator (DTOs).
- Frontend: Angular (Standalone Components), Signals, RxJS.
- Base de Datos: MongoDB

---

## Instrucciones de Instalación y Ejecución

### Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas en sus versiones estables:

- Node.js (Versión 18 o superior recomendada)
- Angular CLI: Instalar globalmente con:

```
npm install -g @angular/cli
```

- NestJS CLI: Instalar globalmente con:

```
npm install -g @nestjs/cli
```

- TypeScript: Instalar globalmente con:

```
npm install -g typescript
```

.

### 2. Configuración del Backend

1. Navega a la carpeta del servidor:
   ```bash
   cd capstone-backend
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno: Crea un archivo `.env` en la raíz de `capstone-backend` y añade tu cadena de conexión:
   ```env
   MONGO_URI=tu_cadena_de_conexion_de_mongodb_atlas
   ```
4. Inicia el servidor en modo desarrollo:
   ```bash
   npm run start:dev
   ```
   _Nota: El backend habilitará automáticamente CORS para permitir peticiones desde el puerto 4200._

### 3. Configuración del Frontend

1. Navega a la carpeta de la interfaz:
   ```bash
   cd hotel-frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta la aplicación:
   ```bash
   npm start
   ```
4. Abre tu navegador en `http://localhost:4200`. La aplicación utiliza **Lazy Loading**, por lo que los módulos se cargarán dinámicamente conforme navegues.

---

## Estructura del Proyecto

- **capstone-backend/**: API REST desarrollada con NestJS y MongoDB.
- **hotel-frontend/**: Interfaz de usuario SPA construida con Angular v21, utilizando Signals para la gestión de estado y BEM para la estilización.
