import { getDbPool } from '../config/db.js';


// get todos los salones activos + paginación
export const getAllSalones = async ({ limit, offset, order = 'titulo', asc = true }) => {
  const pool = getDbPool();

  const validOrderColumns = ['titulo', 'capacidad', 'importe'];
  const orderByColumn = validOrderColumns.includes(order) ? order : 'titulo';
  const sortDirection = asc ? 'ASC' : 'DESC';

  const sql = `
    SELECT salon_id, titulo, direccion, latitud, longitud, capacidad, importe 
    FROM salones 
    WHERE activo = 1 
    ORDER BY ${orderByColumn} ${sortDirection} 
    LIMIT ? OFFSET ?
  `;
  const [rows] = await pool.query(sql, [limit, offset]);
  return rows;
};

// getun salón por ID
export const getSalonById = async (salonId) => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    'SELECT * FROM salones WHERE salon_id = ? AND activo = 1',
    [salonId]
  );
  return rows[0] || null;
};

// crear nuevo salón
export const createSalon = async (salonData) => {
  const pool = getDbPool();
  const sql = `
    INSERT INTO salones (titulo, direccion, latitud, longitud, capacidad, importe)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    salonData.titulo,
    salonData.direccion,
    salonData.latitud || null,
    salonData.longitud || null,
    salonData.capacidad || null,
    salonData.importe
  ];
  const [result] = await pool.query(sql, params);
  return result.insertId;
};

// actualizo salón por ID
export const updateSalon = async (salonId, salonData) => {
  const pool = getDbPool();
  const updatableColumns = ['titulo', 'direccion', 'latitud', 'longitud', 'capacidad', 'importe', 'activo'];

  const updates = {};
  for (const key of updatableColumns) {
    if (salonData.hasOwnProperty(key)) {
      updates[key] = salonData[key];
    }
  }

  const keys = Object.keys(updates);
  if (keys.length === 0) return 0;

  const setClauses = keys.map(key => `${key} = ?`).join(', ');
  const sql = `UPDATE salones SET ${setClauses} WHERE salon_id = ?`;
  const params = [...Object.values(updates), salonId];

  const [result] = await pool.query(sql, params);
  return result.affectedRows;
};

// (softDelete)
export const deleteSalon = async (salonId) => {
  const pool = getDbPool();
  const [result] = await pool.query(
    'UPDATE salones SET activo = 0 WHERE salon_id = ? AND activo = 1',
    [salonId]
  );
  return result.affectedRows;
};
