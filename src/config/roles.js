export const ROLES = {
  ADMIN: 1,      // MAXimo nivel de acceso. Puede gestionar todas las entidades y usuarios.
  EMPLEADO: 2,   // Acceso intermedio. Puede gestionar Salones, Servicios y Turnos.
  CLIENTE: 3     // Acceso limitado. Solo puede crear sus propias Reservas y listar informacin.
};

// Exportamos los valores como un array para facilitar las comprobaciones en el middleware 'authorize'
export const ROLES_ARRAY = Object.values(ROLES);