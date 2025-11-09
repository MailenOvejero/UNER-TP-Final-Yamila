import chalk from 'chalk';
import mysql from 'mysql2/promise'; 

let pool;


// inicializa el pool de conexiones usando las variables de entorno cargadas
// SIEMRE SÓLO después de dotenv.config()

export async function initializeDbPool() {
    
    if (!process.env.DB_NAME) {
        console.error(chalk.red.bold('\n\u2718 ERROR FATAL: DB_NAME no está definido tras la carga de dotenv. Verifique el archivo .env.'));
        process.exit(1); 
    }
    
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME, 
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    //  test de la conexión
    try {
        await pool.getConnection();
        console.log(chalk.blue.bold('\u2714 MySQL Database Connection Successful!'));
    } catch (error) {
        console.error(chalk.red.bold('\n\u2718 Error connecting to MySQL Database:'), error.message);
        process.exit(1); 
    }
}

//  Funcion de obtencion del pool (para usar en servicios)
export function getDbPool() {
    if (!pool) {
        throw new Error("El Pool de la base de datos no ha sido inicializado. Llame a initializeDbPool() primero.");
    }
    return pool;
}
