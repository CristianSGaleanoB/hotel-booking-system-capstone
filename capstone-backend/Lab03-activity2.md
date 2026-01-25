# Lab 03 - Activity 2: Validación de Disponibilidad

## Lógica de Solapamiento de Fechas

Para garantizar que no existan dos reservas para la misma habitación en el mismo periodo, implementamos la siguiente lógica de comparación:

Una habitación se considera **ocupada** si se cumple la condición:
`(FechaInicioSolicitada < FechaFinExistente) && (FechaFinSolicitada > FechaInicioExistente)`

### Implementación Técnica (`bookings.service.ts`)

```typescript
async checkRoomAvailability(roomIds: string[], startDate: string, endDate: string): Promise<void> {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Buscamos cualquier reserva CONFIRMED que choque con las fechas
  const overlappingBooking = await this.bookingModel.findOne({
    status: 'CONFIRMED',
    rooms: { $in: roomIds.map(id => new Types.ObjectId(id)) },
    $or: [
      { startDate: { $lt: end }, endDate: { $gt: start } },
    ],
  }).exec();

  if (overlappingBooking) {
    throw new ConflictException(
      `Una o más habitaciones no están disponibles entre ${startDate} y ${endDate}.`,
    );
  }
}
```

## Manejo de Excepciones

Cuando el sistema detecta un conflicto:

1.  **Excepción**: Se lanza un `ConflictException` de NestJS.
2.  **Respuesta HTTP**: El cliente recibe un código **409 Conflict**.
3.  **Mensaje**: Se retorna un mensaje claro detallando que las habitaciones ya están ocupadas en ese rango.


## Pruebas Realizadas

- **Caso 1: Reserva Exitosa**: Se intentó verificar disponibilidad para una habitación sin reservas previas. Resultado: OK.
- **Caso 2: Conflicto Total**: Se intentó buscar disponibilidad en las mismas fechas de una reserva existente. Resultado: **409 Conflict**.
- **Caso 3: Conflicto Parcial**: Se intentó reservar una habitación que queda libre a mitad del rango solicitado. Resultado: **409 Conflict**.
