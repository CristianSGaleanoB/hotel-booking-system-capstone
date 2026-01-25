# Lab 03 - Activity 4: Confirmación y Registro Final de la Reserva

## Lógica de Confirmación Final

Esta actividad representa el cierre del ciclo de negocio, donde la intención de viaje se convierte en un registro persistente en nuestra base de datos MongoDB.

### Pasos de la Implementación (`POST /bookings`)

1.  **Seguridad por JWT**: El endpoint está protegido. No confiamos en el `userId` enviado por el cliente; lo extraemos directamente del token decodificado de la petición (`req.user`).
2.  **Re-Validación de Disponibilidad**: Este es el paso más importante para un desarrollador senior. Entre el momento en que el usuario pidió el resumen (Actividad 3) y el momento en que hizo clic en "Confirmar", otro usuario pudo haber reservado la misma habitación. Por ello, volvemos a ejecutar `checkRoomAvailability` justo antes de guardar.
3.  **Validación de Integridad de Precios**: El sistema no confía en el precio enviado por el cliente. Re-calcula el costo total en el servidor usando los precios oficiales de la base de datos. Si el precio enviado no coincide con el real, la reserva se bloquea con un error 400.
4.  **Persistencia**: Si todas las validaciones pasan, creamos el documento en la colección `bookings` con estado `CONFIRMED`.

### Estructura de Datos (Body)

```json
{
  "startDate": "2026-06-01",
  "endDate": "2026-06-05",
  "roomIds": ["ID_DE_LA_HABITACION"],
  "totalPrice": 720
}
```

## Verificación y Resultados

- **Integridad**: Si intentas confirmar la misma reserva dos veces, la segunda fallará con un **409 Conflict** gracias a nuestra re-validación.
- **Trazabilidad**: Cada reserva queda ligada a un usuario, un hotel y una lista de habitaciones específicas.
