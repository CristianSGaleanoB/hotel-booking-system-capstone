# Lab 06 - Actividad #1: Implementación del Módulo Auth y Ruteo

Este documento detalla paso a paso la implementación de la estructura de autenticación y el ruteo perezoso (Lazy Loading) para la aplicación.

---

## 1. Creación del Módulo de Rutas

### Carpeta y Definición de Rutas

- **Ubicación:** `src/app/features/auth/`
- Se creó la carpeta `auth` y dentro el archivo `auth.routes.ts`.
- **Implementación:** Se definió una constante `AUTH_ROUTES` de tipo `Routes`.
- **Lógica de la ruta por defecto:** Se configuró `{ path: '', component: LoginComponent }` para que, al navegar a la raíz del módulo de autenticación, se cargue directamente la vista principal (Home del módulo), que en este caso es el Login.

### Configuración de Lazy Loading

- **Ubicación:** `src/app/app.routes.ts`
- **Implementación:** Se configuró la ruta principal `/auth` usando la función `loadChildren`.
- **Detalle Técnico:**
  ```typescript
  {
      path: 'auth',
      loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  }
  ```
- Esto garantiza que el código relacionado con la autenticación no se cargue hasta que el usuario intente ingresar, optimizando el rendimiento inicial de la app.

---

## 2. Vista Contenedora de Login

### Creación del LoginComponent

- **Ubicación:** `src/app/features/auth/login/`
- **Implementación:** Se creó el componente `LoginComponent`.
- **Responsabilidad:** Este componente actúa como un "Contenedor". Su función es:
  - Gestionar el estado de la vista.
  - Comunicarse con el `AuthService` (inyectado en la lógica).
  - Alojar la estructura visual que recibirá en el futuro el formulario presentacional.
- **Configuración:** Se actualizó el nombre de la clase a `LoginComponent` y se aseguró que el selector fuera `app-login`.

---

## 3. Fidelidad al Diseño

### Recreación del Diseño (Figma)

- **Implementación:** Se utilizó **Tailwind CSS** para replicar la estética premium del diseño.
- **Detalles Visuales Clave:**
  - **Tarjeta de Login:** Un recuadro blanco con una sombra profunda (`shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]`) y bordes dorados/ocres (`#c5a04e`).
  - **Tipografía:** Se implementó una estructura limpia con encabezados grandes y campos de entrada con bordes dorados.
  - **Alineación:** El formulario se centra automáticamente en el área de contenido principal del layout global, manteniendo la proporción y el aire visual del mockup original.
- **Integración con Layout:** Se ajustó el enrutamiento para que el login se visualice dentro del `LayoutComponent` global, permitiendo la reutilización del Sidebar existente ("Traveler").

---

## 4. Conceptos de la Semana 6 Aplicados

Para cumplir con los estándares de la **Semana 6**, se implementaron los siguientes pilares de reactividad moderna:

- **Lazy Loading**: Configuración de rutas en `app.routes.ts` usando `loadChildren` e `import()` dinámico, lo que optimiza la carga inicial de la aplicación.
- **Signals**: Uso de `signal()` en el `AuthService` para gestionar el estado de autenticación (`isLoggedIn`). Esto permite una reactividad granular y eficiente sin depender de la detección de cambios tradicional de Angular (Zone.js).
- **Nuevo Control Flow (@if)**: Implementación de la sintaxis `@if` en los templates de `login.html` y `side-menu.component.html`, reemplazando las directivas estructurales antiguas.
- **Standalone Components**: Uso de componentes independientes, eliminando la necesidad de `NgModules` y simplificando la estructura del proyecto.

---

## Resultados

- [x] Estructura de ruteo funcional con Lazy Loading.
- [x] `LoginComponent` cargando correctamente en `/auth`.
- [x] Diseño estético consistente con Figma y Tailwind CSS.
- [x] Implementación validada con los conceptos de la **Semana 6**.
