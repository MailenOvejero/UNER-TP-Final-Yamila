/**
 * src/config/roles.js
 * * Mapeo de roles de usuario según el campo 'tipo_usuario' en la tabla 'usuarios'.
 * Esto garantiza que el código use nombres legibles (ADMIN) en lugar de números (1, 2, 3).
 */
//export const ROLES = {
    // 1: Máximo nivel de acceso. Puede gestionar todas las entidades y usuarios.
  //  ADMIN: 3, 
    
    // 2: Acceso intermedio. Puede gestionar Salones, Servicios y Turnos.
    //EMPLEADO: 2, 
    
    // 3: Acceso limitado. Solo puede crear sus propias Reservas y listar información.
    //CLIENTE: 1 
//};

// Exportamos los valores como un array para facilitar las comprobaciones en el middleware 'authorize'
//export const ROLES_ARRAY = Object.values(ROLES); 

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// COMENTO TODO ESTO PARA PODER PROBAR LAS CONSULTAS DE RESERVAS CON LOS ROLES COMO ESTAN EN LA bdd
// 



//
export const ROLES = {
  ADMIN: 1,      // MAXimo nivel de acceso. Puede gestionar todas las entidades y usuarios.
  EMPLEADO: 2,   // Acceso intermedio. Puede gestionar Salones, Servicios y Turnos.
  CLIENTE: 3     // Acceso limitado. Solo puede crear sus propias Reservas y listar informacin.
};

// Exportamos los valores como un array para facilitar las comprobaciones en el middleware 'authorize'
export const ROLES_ARRAY = Object.values(ROLES);